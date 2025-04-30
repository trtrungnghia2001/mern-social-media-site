import React, { memo } from 'react'
import { ActivityType } from '../types/activity.type'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { HiDotsHorizontal } from 'react-icons/hi'
import { useActivityStore } from '../stores/activity.store'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const ActivityCard = ({ data }: { data: ActivityType }) => {
  const { unLike } = useActivityStore()
  const unLikeResult = useMutation({
    mutationFn: async () => {
      return await unLike(data._id)
    },
    onSuccess: (data) => {
      toast.success(data.message)
    },
    onError: (error) => {
      toast.error(error.message)
      console.error(error)
    },
  })
  return (
    <div className="p-3 rounded-lg bg-bgColorBox">
      <div className="flex items-center justify-between">
        <div>
          <span>{data.user.name} </span>
          <span>{data.post && `liked post on `}</span>
          <span>{data.comment && `liked comment on `}</span>
          <span>{new Date(data.createdAt).toDateString()}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <HiDotsHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => unLikeResult.mutate()}>
              Unlike
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div
        className="whitespace-break-spaces"
        dangerouslySetInnerHTML={{
          __html: data.comment?.content || data.post?.content,
        }}
      ></div>
    </div>
  )
}

export default memo(ActivityCard)
