import React, { memo } from 'react'
import { IMAGE_NOTFOUND } from '@/constants/image.constant'
import { StoryType } from '../types/story.type'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { HiDotsHorizontal } from 'react-icons/hi'
import { useMutation } from '@tanstack/react-query'
import { useStoryStore } from '../stores/story.store'
import toast from 'react-hot-toast'
import { useStoryPreviewStore } from '../stores/story.prevew.store'
type Type = { data: StoryType; isAuth?: boolean }

const StoryCard = ({ data, isAuth }: Type) => {
  const { handleOpen, setStory } = useStoryPreviewStore()
  const { deleteById } = useStoryStore()
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
  return (
    <div className="bg-bgColorBox rounded-lg relative overflow-hidden aspect-story cursor-pointer">
      <img
        onClick={() => {
          setStory(data)
          handleOpen()
        }}
        src={data.file_url}
        alt={data.file_url}
        loading="lazy"
      />
      <div className="absolute top-1 left-1 w-8 aspect-square rounded-full overflow-hidden">
        <img
          src={data.user?.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
          alt={data.user?.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
          loading="lazy"
        />
      </div>
      {isAuth && (
        <div className="absolute top-1 right-1">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <HiDotsHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}

export default memo(StoryCard)
