import React, { memo, useEffect, useMemo, useState } from 'react'
import { CommentType } from '../types/comment.type'
import { IMAGE_NOTFOUND } from '@/constants/image.constant'
import { Link } from 'react-router-dom'
import { displayTime } from '@/utils/time'
import CommentCreateUpdateForm from './CommentCreateUpdateForm'
import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import { commentGetCommentIdApi } from '@/services/comment.api'
import { useCommentStore } from '../stores/comment.store'
import { AiFillLike } from 'react-icons/ai'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/features/authentication/stores/auth.store'

type Type = { data: CommentType; isAuth?: boolean }

const CommentCard = ({ data, isAuth }: Type) => {
  const { user } = useAuthStore()
  const { comments, likeUnlike, deleteById } = useCommentStore()
  const repliesByComment = useMemo(() => {
    if (isAuth) return []
    return comments.filter((item) => item.comment?._id === data._id)
  }, [comments, isAuth])

  const [replyForm, setReplyForm] = useState(false)
  const [replyFetch, setReplyFetch] = useState(false)

  const getCommentGetCommentIdApiResult = useInfiniteQuery({
    queryKey: ['post', 'comment', 'replies', data._id],
    queryFn: async ({ pageParam }) =>
      await commentGetCommentIdApi(
        data._id as string,
        `_page=${pageParam}&_skip=${repliesByComment.length}`,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (
        lastPage.data.results.length < lastPage.data.paginations.limit ||
        lastPage.data.paginations.current_page ===
          lastPage.data.paginations.total_pages
      ) {
        return null
      }
      return lastPageParam + 1
    },
    enabled: !!(data._id && replyFetch) && !isAuth,
  })

  // reply
  const handleReply = () => {
    if (!user) {
      toast.error('Please sign in to reply.')
      return
    }
    setReplyForm(true)
  }

  // delete
  const deleteByIdResult = useMutation({
    mutationFn: async () => deleteById(data._id),
    onSuccess: (data) => {
      toast.success(data.message)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  const handleDelete = () => {
    deleteByIdResult.mutate()
  }

  // like
  const [checkLike, setCheckLike] = useState(false)
  const [totalLike, setTotalLike] = useState(0)
  const likeUnlikeResult = useMutation({
    mutationFn: async () => likeUnlike(data._id),
    onSuccess: (data) => {
      toast.success(data.message)
      setCheckLike(!checkLike)
      if (checkLike) {
        setTotalLike(totalLike - 1)
      } else {
        setTotalLike(totalLike + 1)
      }
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  useEffect(() => {
    setCheckLike(data.isLiked)
    setTotalLike(data.total_likes)
  }, [data])

  return (
    <div className="flex items-start gap-4">
      <div className="w-8 aspect-square rounded-full overflow-hidden">
        <img
          src={data.user.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
          alt={data.user.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
          loading="lazy"
        />
      </div>
      <div className="flex-1 space-y-4">
        <div className="space-y-2">
          <div className="rounded-lg bg-gray-100 py-1 px-2 w-max">
            <Link to={`/profile/${data.user._id}`}>
              <h6>{data.user.name}</h6>
            </Link>
            {data.content && (
              <div
                className="whitespace-break-spaces"
                dangerouslySetInnerHTML={{ __html: data.content }}
              ></div>
            )}
          </div>
          {data.file_url && (
            <div className="max-w-40 overflow-hidden rounded-lg">
              <img src={data.file_url} alt={data.file_url} loading="lazy" />
            </div>
          )}
          {/* actions */}
          <div className="text-xs font-medium flex items-center gap-3">
            <span>{displayTime(data.createdAt)}</span>
            <button onClick={() => likeUnlikeResult.mutate()}>
              {checkLike ? 'Unlike' : 'Like'}
            </button>
            <button onClick={handleReply}>Reply</button>
            {isAuth && <button onClick={handleDelete}>Delete</button>}
            {data.total_replies > 0 && !replyFetch && (
              <button onClick={() => setReplyFetch(true)}>
                View {data.total_replies} replies
              </button>
            )}
            {totalLike > 0 && (
              <span className="flex items-center gap-1 text-blue-500">
                {totalLike}
                <AiFillLike />
              </span>
            )}
          </div>
        </div>
        {repliesByComment.map((item) => (
          <CommentCard key={item._id} data={item} />
        ))}
        {getCommentGetCommentIdApiResult.data?.pages
          .flatMap((item) => item.data.results)
          .map((item) => (
            <CommentCard key={item._id} data={item} />
          ))}
        {getCommentGetCommentIdApiResult.hasNextPage && (
          <button
            className="text-xs font-medium"
            onClick={() => getCommentGetCommentIdApiResult.fetchNextPage()}
          >
            View more replies
          </button>
        )}
        {replyForm && (
          <CommentCreateUpdateForm
            postId={data.post._id}
            commentId={data._id}
            isReply
          />
        )}
      </div>
    </div>
  )
}

export default memo(CommentCard)
