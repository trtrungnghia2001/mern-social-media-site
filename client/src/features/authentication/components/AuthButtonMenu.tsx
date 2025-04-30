import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { memo } from 'react'
import { useAuthStore } from '../stores/auth.store'
import { Button } from '@/components/ui/button'
import { Link, NavLink } from 'react-router-dom'
import { IMAGE_NOTFOUND } from '@/constants/image.constant'
import clsx from 'clsx'
import { MdLogout } from 'react-icons/md'
import { user_menu_links } from '@/constants/link.constant'

const AuthButtonMenu = () => {
  const { user, signout } = useAuthStore()
  if (!user)
    return (
      <Link to={`/signin`}>
        <Button size={'sm'}>Signin</Button>
      </Link>
    )
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="w-6 aspect-square overflow-hidden rounded-full">
          <img
            src={user?.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
            alt={user?.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
            loading="lazy"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {user_menu_links.map((item) => (
          <DropdownMenuItem key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                clsx([`flex items-center gap-2`, isActive && `text-blue-500`])
              }
            >
              {item.icon} {item.name}
            </NavLink>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={signout}
          className={clsx([`flex items-center gap-2`])}
        >
          <MdLogout />
          Loggout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default memo(AuthButtonMenu)
