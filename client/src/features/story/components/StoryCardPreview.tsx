import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useStoryPreviewStore } from '../stores/story.prevew.store'
import { displayTime } from '@/utils/time'
import { IMAGE_NOTFOUND } from '@/constants/image.constant'
import AutoProgress from './AutoProgress'
import { useStoryStore } from '../stores/story.store'

const StoryCardPreview = () => {
  const duration = 5000
  const { open, story, setStory, handleClose } = useStoryPreviewStore()
  const { datas } = useStoryStore()
  const [index, setIndex] = useState(0)

  const onOpenChange = () => {
    handleClose()
    setStory(null)
  }

  useEffect(() => {
    const findIndex = datas.findIndex((item) => item._id === story?._id)
    if (findIndex === -1) return
    setIndex(findIndex)
  }, [datas, story])

  const handleNextStory = useCallback(() => {
    if (index >= datas.length - 1) {
      setIndex(0)
      onOpenChange()
      return
    }

    setIndex((prev) => prev + 1)
  }, [datas, index])

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
            <div className="absolute top-5 left-2 flex items-center gap-2 text-white">
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
            <AutoProgress
              duration={duration}
              className="absolute top-2 right-1 left-2"
              onSuccess={() => {
                handleNextStory()
              }}
            />
            <img
              src={datas[index]?.file_url}
              alt={datas[index]?.file_url}
              loading="lazy"
            />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default memo(StoryCardPreview)
