import { IMAGE_NOTFOUND } from '@/constants/image.constant'
import { useAuthStore } from '@/features/authentication/stores/auth.store'
import { RiFlagFill, RiImageAiFill, RiLiveFill } from 'react-icons/ri'
import { usePostFormStore } from '../stores/post.form.store'
import { Link } from 'react-router-dom'

const actions = [
  {
    icon: <RiLiveFill />,
    label: `Live`,
  },
  {
    icon: <RiImageAiFill />,
    label: `Photo/Image`,
  },
  {
    icon: <RiFlagFill />,
    label: `Life event`,
  },
]

const PostCardButton = () => {
  const { user } = useAuthStore()
  const { handleOpen } = usePostFormStore()
  return (
    <div className="p-3 rounded-lg bg-bgColorBox space-y-2">
      <div className="flex items-stretch gap-3">
        <Link
          to={`/profile/` + user?._id}
          className="w-8 aspect-square overflow-hidden rounded-full"
        >
          <img
            src={user?.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
            alt={user?.avatar}
            loading="lazy"
          />
        </Link>
        <div
          onClick={handleOpen}
          className="bg-gray-100 text-textColorSecondary w-full rounded-lg flex items-center px-2 cursor-pointer"
        >
          What is your mind?
        </div>
      </div>
      <hr />
      <div className="grid grid-cols-3 justify-items-center">
        {actions.map(({ icon, label }) => (
          <div
            key={label}
            className="text-textColorSecondary flex items-center justify-center gap-2 hover:bg-gray-100 w-full p-1 rounded-lg cursor-pointer font-medium"
          >
            <span>{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PostCardButton
