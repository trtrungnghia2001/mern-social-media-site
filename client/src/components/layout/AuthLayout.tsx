import { auth_nav_links } from '@/constants/link.constant'
import clsx from 'clsx'
import { NavLink, Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className="max-w-[1032px] w-full mx-auto flex items-start gap-6">
      <div className="hidden md:block bg-bgColorBox p-3 rounded-lg max-w-xs w-full">
        <ul>
          {auth_nav_links.map((item) => (
            <li key={item.name}>
              <NavLink
                to={`/me` + item.path}
                className={({ isActive }) =>
                  clsx([
                    'py-2 px-4 flex items-center space-x-2 text-textColorSecondary transition-all duration-200 hover:bg-gray-100 rounded-lg',
                    isActive && 'bg-gray-100',
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
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
