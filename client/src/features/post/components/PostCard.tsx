import React, { memo, useEffect, useState } from 'react'
import { PostType } from '../types/post.type'
import { FaRegCommentAlt } from 'react-icons/fa'
import { displayTime } from '@/utils/time'
import { AiFillLike, AiOutlineLike } from 'react-icons/ai'
import { RiShareForwardLine } from 'react-icons/ri'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { HiDotsHorizontal } from 'react-icons/hi'
import { IMAGE_NOTFOUND } from '@/constants/image.constant'
import { Link } from 'react-router-dom'
import { usePostStore } from '../stores/post.store'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import CommentContainer from '@/features/comment/components/CommentContainer'
import { useAuthStore } from '@/features/authentication/stores/auth.store'
import { usePostFormStore } from '../stores/post.form.store'

const PostCard = ({ data }: { data: PostType }) => {
  const { user } = useAuthStore()
  const { handleOpen, handleUpdate } = usePostFormStore()
  const { saveUnsave, likeUnlike, deleteById } = usePostStore()
  // save
  const [checkSave, setCheckSave] = useState(false)
  const saveUnsaveResult = useMutation({
    mutationFn: async () => saveUnsave(data._id),
    onSuccess: (data) => {
      toast.success(data.message)
      setCheckSave(!checkSave)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  // like
  const [checkLike, setCheckLike] = useState(false)
  const [totalLike, setTotalLike] = useState(0)
  const likeUnlikeResult = useMutation({
    mutationFn: async () => likeUnlike(data._id),
    onSuccess: (data) => {
      toast.success(data.message)
      setCheckLike(!checkLike)
      if (checkLike) {
        setTotalLike((prev) => prev - 1)
      } else {
        setTotalLike((prev) => prev + 1)
      }
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  useEffect(() => {
    setCheckSave(data.isSaved || false)
    setCheckLike(data.isLiked || false)
    setTotalLike(data.total_likes || 0)
  }, [data])
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
  // copy
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.origin + `/post/${data._id}`)
    toast.success('Link copied to clipboard')
  }
  // comment
  const [showComment, setShowComment] = useState(false)

  return (
    <div className="p-3 rounded-lg bg-bgColorBox space-y-4">
      {/* header */}
      <div className="flex items-center justify-between">
        <Link
          to={`/profile/` + data.user?._id}
          className="flex items-center gap-2"
        >
          <div className="aspect-square w-8 rounded-full overflow-hidden">
            <img
              src={data.user?.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
              alt={data.user?.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
              loading="lazy"
            />
          </div>
          <div>
            <h6>{data.user?.name}</h6>
            <p className="text-xs text-textColorSecondary">
              {displayTime(data.createdAt)}
            </p>
          </div>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <HiDotsHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {user && (
              <>
                {data.user?._id === user._id && (
                  <DropdownMenuItem
                    onClick={() => {
                      handleUpdate(data)
                      handleOpen()
                    }}
                  >
                    Edit
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => saveUnsaveResult.mutate()}>
                  {checkSave ? `Unsave` : `Save`}
                </DropdownMenuItem>
                {data.user?._id === user._id && (
                  <DropdownMenuItem onClick={handleDelete}>
                    Delete
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuItem onClick={copyLink}>Copy link</DropdownMenuItem>
            <DropdownMenuItem>Report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* main */}
      <div className="space-y-2">
        {data.content && (
          <div
            className="whitespace-break-spaces"
            dangerouslySetInnerHTML={{ __html: data.content }}
          ></div>
        )}
        {data.file_url && (
          <div>
            <img src={data.file_url} alt={data.file_url} loading="lazy" />
          </div>
        )}
      </div>
      {/* footer */}
      <div className=" flex items-center justify-between gap-2">
        <button
          onClick={() => likeUnlikeResult.mutate()}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-textColorSecondary text-xs"
        >
          {checkLike ? (
            <AiFillLike className="text-blue-500" />
          ) : (
            <AiOutlineLike />
          )}
          <p className="border-l-2 leading-none pl-2">
            {totalLike}{' '}
            <span className="hidden sm:inline-block">
              {checkLike ? `UnLike` : `Like`}
            </span>
          </p>
        </button>
        <button
          onClick={() => {
            setShowComment(true)
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-textColorSecondary text-xs"
        >
          <FaRegCommentAlt />
          <p className="border-l-2 leading-none pl-2">
            {data.total_comments}{' '}
            <span className="hidden sm:inline-block">Comments</span>
          </p>
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-textColorSecondary text-xs">
          <RiShareForwardLine />
          <p className="border-l-2 leading-none pl-2">
            {0} <span className="hidden sm:inline-block">Share</span>
          </p>
        </button>
      </div>
      {/* comment */}
      {showComment && <CommentContainer postId={data._id} />}
    </div>
  )
}

export default memo(PostCard)
