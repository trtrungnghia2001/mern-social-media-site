import { UserType } from '@/features/authentication/types/user.type'
import React from 'react'
import ButtonFollow from './ButtonFollow'
import { IMAGE_NOTFOUND } from '@/constants/image.constant'
import { Link } from 'react-router-dom'

const UserCard = ({ data }: { data: UserType }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-bgColorBox rounded-lg">
      <Link to={`/profile/` + data._id} className="flex items-center gap-2">
        <div className="w-10 aspect-square overflow-hidden rounded-full">
          <img
            src={data.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
            alt={data.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
            loading="lazy"
          />
        </div>
        <div>
          <h6>{data.name}</h6>
          <p className="text-xs text-textColorSecondary">
            {data.total_follower} followers
          </p>
        </div>
      </Link>
      <ButtonFollow user={data} />
    </div>
  )
}

export default UserCard
