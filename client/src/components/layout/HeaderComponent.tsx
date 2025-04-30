import React, { useState } from 'react'
import WrapperComponent from './WrapperComponent'
import { Link, NavLink } from 'react-router-dom'
import { header_links } from '@/constants/link.constant'
import clsx from 'clsx'
import AuthButtonMenu from '@/features/authentication/components/AuthButtonMenu'
import InputSearrch from '../InputSearrch'
import { IoMdSearch } from 'react-icons/io'
import { HiBars3 } from 'react-icons/hi2'
import { Button } from '../ui/button'
import { useAuthStore } from '@/features/authentication/stores/auth.store'
import SidebarComponent from './SidebarComponent'
import { AiOutlineComment } from 'react-icons/ai'
import MessageSidebar from '@/features/message/components/MessageSidebar'

const HeaderComponent = () => {
  const { user } = useAuthStore()
  const [showSidebar, setShowSidebar] = useState(false)
  const [showSidebarMessage, setShowSidebarMessage] = useState(false)
  return (
    <>
      <div id="header" className="bg-bgColorBox py-2 mb-6 shadow">
        <WrapperComponent className="flex items-center gap-6">
          <div className="md:max-w-xs w-full">
            <Link to={`/`} className="font-semibold text-xl text-blue-600">
              Social
            </Link>
          </div>
          <div className="flex-1 hidden md:flex items-center justify-between">
            <div className="flex items-center justify-start gap-4">
              {header_links.list1.map((item) => {
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      clsx([
                        `text-textColorSecondary hover:text-blue-500 flex items-center gap-1`,
                        isActive && `text-blue-500`,
                      ])
                    }
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.name}</span>
                  </NavLink>
                )
              })}
            </div>
            <InputSearrch />
          </div>
          <div className="hidden md:block max-w-xs w-full">
            <div className="flex items-center justify-end gap-4">
              {header_links.list2.map((item) => {
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      clsx([
                        `text-textColorSecondary hover:text-blue-500 flex items-center gap-1`,
                        isActive && `text-blue-500`,
                      ])
                    }
                  >
                    <span className="text-base">{item.icon}</span>
                  </NavLink>
                )
              })}
              <AuthButtonMenu />
            </div>
          </div>
          <div className="md:hidden flex items-center gap-4 text-xl">
            <Link to={`/search`}>
              <IoMdSearch />
            </Link>
            {user ? (
              <>
                <button onClick={() => setShowSidebarMessage(true)}>
                  <AiOutlineComment />
                </button>
                <button onClick={() => setShowSidebar(true)}>
                  <HiBars3 />
                </button>
              </>
            ) : (
              <Link to={`/signin`}>
                <Button size={'sm'}>Sign In</Button>
              </Link>
            )}
          </div>
        </WrapperComponent>
      </div>
      <SidebarComponent
        open={showSidebar}
        onClose={() => setShowSidebar(false)}
      />
      {showSidebarMessage && (
        <div className="z-50 fixed top-0 left-0 bottom-0 right-0 inset-0">
          <div
            onClick={() => setShowSidebarMessage(false)}
            className="absolute inset-0 bg-black/50 -z-10"
          ></div>
          <MessageSidebar
            open={showSidebarMessage}
            onClose={() => setShowSidebarMessage(false)}
            className="h-full"
          />
        </div>
      )}
    </>
  )
}

export default HeaderComponent
