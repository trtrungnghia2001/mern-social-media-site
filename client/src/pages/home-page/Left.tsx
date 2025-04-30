import { Button } from '@/components/ui/button'
import { IMAGE_NOTFOUND } from '@/constants/image.constant'
import { auth_nav_links } from '@/constants/link.constant'
import { useAuthStore } from '@/features/authentication/stores/auth.store'
import clsx from 'clsx'
import { Link, NavLink } from 'react-router-dom'

const Left = () => {
  const { user } = useAuthStore()
  return (
    <section className="hidden md:block max-w-xs w-full space-y-6">
      {/* card user */}
      {user && (
        <div className="bg-bgColorBox p-3 rounded-lg">
          <div className="relative">
            <div className="bg-gray-100 rounded overflow-hidden h-20">
              {user.banner && (
                <img src={user.banner} alt={user.banner} loading="lazy" />
              )}
            </div>
            <div className="absolute -translate-y-[50%] left-[50%] -translate-x-[50%] bg-bgColorBox rounded-full p-0.5">
              <div className="rounded-full overflow-hidden aspect-square w-16 ">
                <img
                  src={user.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
                  alt={user.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
          <div className="mt-10 text-center space-y-1">
            <h6>{user?.name}</h6>
            <div>
              <Link to={`/profile/` + user?._id}>
                <Button size={'sm'}>My Profile</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
      {/* nav list */}
      <div className="bg-bgColorBox p-3 rounded-lg">
        <ul>
          {auth_nav_links.map((item) => (
            <li key={item.name}>
              <NavLink
                to={`/me` + item.path}
                className={() =>
                  clsx([
                    'py-2 px-4 flex items-center space-x-2 text-textColorSecondary',
                    'transition-all duration-200 hover:bg-gray-100 rounded-lg',
                  ])
                }
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Left
