import React, { memo } from 'react'
import { useAuthStore } from '@/features/authentication/stores/auth.store'
import { MdAddCircle } from 'react-icons/md'
import { IMAGE_NOTFOUND } from '@/constants/image.constant'
import { useStoryFormStore } from '../stores/story.form.store'

const StoryCardButton = () => {
  const { user } = useAuthStore()
  const { handleOpen } = useStoryFormStore()
  return (
    <div
      onClick={handleOpen}
      className="bg-bgColorBox rounded-lg relative overflow-hidden aspect-story cursor-pointer"
    >
      <img
        src={user?.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
        alt={user?.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
        loading="lazy"
      />
      <div className="absolute bottom-0 right-0 left-0 h-10 bg-bgColorBox text-xs text-textColorSecondary text-center pt-3">
        <div className="absolute top-0 left-[50%] -translate-x-[50%] -translate-y-[50%] rounded-full bg-bgColorBox">
          <MdAddCircle size={24} />
        </div>
        Create story
      </div>
    </div>
  )
}

export default memo(StoryCardButton)
