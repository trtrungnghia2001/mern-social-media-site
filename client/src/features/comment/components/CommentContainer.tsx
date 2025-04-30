import React, { memo, useMemo } from 'react'
import CommentCreateUpdateForm from './CommentCreateUpdateForm'
import { useInfiniteQuery } from '@tanstack/react-query'
import { commentGetPostIdApi } from '@/services/comment.api'
import CommentCard from './CommentCard'
import { useCommentStore } from '../stores/comment.store'
import { useAuthStore } from '@/features/authentication/stores/auth.store'

type Type = {
  postId: string
}
const CommentContainer = ({ postId }: Type) => {
  const { user } = useAuthStore()
  const { comments } = useCommentStore()
  const commentsByPost = useMemo(() => {
    return comments.filter(
      (item) => item.post._id === postId && item.comment === undefined,
    )
  }, [comments])

  const getCommentGetPostIdResult = useInfiniteQuery({
    queryKey: ['post', 'comment', postId],
    queryFn: async ({ pageParam }) =>
      await commentGetPostIdApi(
        postId as string,
        `_page=${pageParam}&_skip=${commentsByPost.length}`,
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
    enabled: !!postId,
  })

  return (
    <div className="space-y-4">
      {user && <CommentCreateUpdateForm postId={postId} />}
      {commentsByPost.map((item) => (
        <CommentCard key={item._id} data={item} />
      ))}
      {getCommentGetPostIdResult.data?.pages
        .flatMap((item) => item.data.results)
        .map((item) => (
          <CommentCard key={item._id} data={item} />
        ))}

      {getCommentGetPostIdResult.hasNextPage && (
        <button
          className="text-xs font-medium"
          onClick={() => getCommentGetPostIdResult.fetchNextPage()}
        >
          View more comment
        </button>
      )}
    </div>
  )
}

export default memo(CommentContainer)
