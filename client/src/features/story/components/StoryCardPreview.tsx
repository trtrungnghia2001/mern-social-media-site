import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import React, { memo } from 'react'
import { useStoryPreviewStore } from '../stores/story.prevew.store'
import { displayTime } from '@/utils/time'
import { IMAGE_NOTFOUND } from '@/constants/image.constant'

const StoryCardPreview = () => {
  const { open, story, setStory, handleClose } = useStoryPreviewStore()
  const onOpenChange = () => {
    handleClose()
    setStory(null)
  }
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onOpenChange()
      }}
    >
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Story preview</DialogTitle>
          <DialogDescription></DialogDescription>
          <div className="relative rounded overflow-hidden">
            <div className="absolute top-1 left-1 flex items-center gap-2 text-white">
              <div className="w-8 aspect-square overflow-hidden rounded-full">
                <img
                  src={story?.user?.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
                  alt={story?.user?.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
                  loading="lazy"
                />
              </div>
              <div className="flex-1">
                <h6>{story?.user?.name}</h6>
                <p className="text-xs text-white/60">
                  {story?.createdAt && displayTime(story?.createdAt)}
                </p>
              </div>
            </div>
            <img src={story?.file_url} alt={story?.file_url} loading="lazy" />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default memo(StoryCardPreview)
