import React, { memo } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { HiDotsHorizontal } from 'react-icons/hi'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { NotificationType } from '../types/notification.type'
import { Link } from 'react-router-dom'
import { useNotificationStore } from '../stores/notification.store'
import { IMAGE_NOTFOUND } from '@/constants/image.constant'

const NotificationCard = ({ data }: { data: NotificationType }) => {
  const { deleteById } = useNotificationStore()
  const deleteByIdResult = useMutation({
    mutationFn: async () => {
      return await deleteById(data._id)
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
    <div className="p-3 rounded-lg bg-bgColorBox flex items-center gap-3">
      <Link
        to={`/profile/` + data.sender._id}
        className="w-8 aspect-square overflow-hidden rounded-full"
      >
        <img
          src={data.sender.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
          alt={data.sender.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
          loading="lazy"
        />
      </Link>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <Link to={`/profile/` + data.sender._id}>{data.sender.name} </Link>
            <span>{data.type} on </span>
            <span>{new Date(data.createdAt).toDateString()}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <HiDotsHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => deleteByIdResult.mutate()}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div
          className="whitespace-break-spaces"
          dangerouslySetInnerHTML={{
            __html: data?.content || data.post?.content,
          }}
        ></div>
      </div>
    </div>
  )
}

export default memo(NotificationCard)
