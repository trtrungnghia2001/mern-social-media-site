import { IMAGE_NOTFOUND } from '@/constants/image.constant'
import { auth_nav_links, support_links } from '@/constants/link.constant'
import { useAuthStore } from '@/features/authentication/stores/auth.store'
import clsx from 'clsx'
import React, { memo, useEffect } from 'react'
import { MdClose, MdLogout } from 'react-icons/md'
import { Link, NavLink } from 'react-router-dom'

type Type = {
  open: boolean
  onClose: () => void
}

const SidebarComponent = ({ onClose, open }: Type) => {
  const { user, signout } = useAuthStore()
  // hidden overflow scrollbar
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [open])

  if (!open) return

  return (
    <div className="z-[100] fixed inset-0 w-screen h-screen bg-black/50">
      <div className="bg-[#f0f2f5] h-screen overflow-y-auto space-y-4 py-4">
        <div className="px-3 flex items-center justify-between">
          <h3>Menu</h3>
          <button onClick={onClose}>
            <MdClose size={24} />
          </button>
        </div>
        <div className="bg-bgColorBox p-3 rounded-lg">
          {/* avatar */}
          <Link
            to={`/profile/` + user?._id}
            onClick={onClose}
            className="border-b pb-3 mb-3 flex items-center gap-3"
          >
            <div className="rounded-full w-10 aspect-square overflow-hidden">
              <img
                src={user?.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
                alt={user?.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
                loading="lazy"
              />
            </div>
            <div className="space-y-0.5">
              <h6>{user?.name}</h6>
              <p className="text-13 text-textColorSecondary">{user?.email}</p>
            </div>
          </Link>
          {/* links */}
          <ul>
            {auth_nav_links.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={`/me` + item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    clsx([
                      `flex items-center gap-3 p-3 rounded-lg`,
                      isActive && `bg-gray-100`,
                    ])
                  }
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <ul className="space-y-3">
            {support_links.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    clsx([
                      `flex items-center gap-3 p-3 rounded-lg bg-bgColorBox`,
                      isActive && `bg-gray-100`,
                    ])
                  }
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
            <li>
              <button
                onClick={() => {
                  signout()
                  onClose()
                }}
                className={clsx([
                  `flex items-center gap-3 p-3 rounded-lg bg-bgColorBox w-full`,
                ])}
              >
                <MdLogout />
                Loggout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default memo(SidebarComponent)
