import { Checkbox } from '@/components/ui/checkbox'
import { useAuthStore } from '@/features/authentication/stores/auth.store'
import { useSocketioStore } from '@/features/socket.io/stores/soket.store'
import React, { ComponentProps, FC, memo, useMemo, useState } from 'react'
import { GrGroup } from 'react-icons/gr'
import { useMessageStore } from '../stores/message.store'
import { useInfiniteQuery } from '@tanstack/react-query'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { IMAGE_NOTFOUND } from '@/constants/image.constant'
import { MdSearch } from 'react-icons/md'
import { useDebounce } from 'use-debounce'

interface IMessageSidebar extends ComponentProps<'div'> {
  open?: boolean
  onClose?: () => void
}

const MessageSidebar: FC<IMessageSidebar> = ({ className, open, onClose }) => {
  const { user } = useAuthStore()
  const { onlineUsers } = useSocketioStore()
  const { getChatUser } = useMessageStore()

  const [showOnline, setShowOnline] = useState(false)
  const [searchUser, setSearchUser] = useState('')
  const [searchUserDebounce] = useDebounce(searchUser, 1000)

  const getUsersResult = useInfiniteQuery({
    queryKey: ['message', 'user', searchUserDebounce, showOnline],
    queryFn: async ({ pageParam }) =>
      await getChatUser(
        `_page=${pageParam}&_online=${showOnline}&_q=${searchUserDebounce}`,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (
        lastPage.data.paginations.current_page >=
          lastPage.data.paginations.total_pages ||
        lastPage.data.results.length < lastPage.data.paginations.limit ||
        lastPage.data.paginations.total_pages < 2
      )
        return null
      return lastPageParam + 1
    },
  })

  const users = useMemo(() => {
    if (!getUsersResult.isSuccess && !getUsersResult.data) return []

    return getUsersResult.data?.pages.flatMap((item) => item.data.results)
  }, [getUsersResult])

  if (!open) return

  return (
    <div
      className={clsx([
        `max-w-xs w-full bg-bgColorBox rounded-lg px-2 py-3 max-h-screen overflow-y-auto`,
        className,
      ])}
    >
      <div>
        <h5 className="px-2 flex items-center gap-3 mb-4">
          <GrGroup />
          Contact
        </h5>
        <ul className="">
          <li className="px-3 mb-3">
            <div className="border rounded-full overflow-hidden flex items-center gap-2 pr-3 text-13">
              <input
                type="text"
                className="flex-1 py-1 pl-3 border-none outline-none"
                placeholder="Search for users..."
                value={searchUser}
                onChange={(e) => {
                  setSearchUser(e.target.value)
                }}
              />
              <MdSearch />
            </div>
          </li>
          <li className="flex items-center space-x-2 px-3 mb-3">
            <Checkbox
              id="online"
              onClick={() => setShowOnline(!showOnline)}
              checked={showOnline}
            />
            <label
              htmlFor="online"
              className="text-xs leading-none text-textColorSecondary"
            >
              Show online only (
              {onlineUsers.filter((item) => item !== user?._id).length})
            </label>
          </li>
          {users.map((item) => (
            <li key={item._id}>
              <NavLink
                onClick={() => {
                  if (!onClose) return
                  onClose()
                }}
                className={({ isActive }) =>
                  clsx(
                    [
                      `flex items-center gap-3 hover:bg-gray-100 rounded-lg p-2`,
                    ],
                    isActive && `bg-gray-100`,
                  )
                }
                to={`/messages/` + item._id}
              >
                <div className="relative">
                  <div className="w-9 aspect-square overflow-hidden rounded-full">
                    <img
                      src={item.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
                      alt={item.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
                      loading="lazy"
                    />
                  </div>
                  {onlineUsers.includes(item._id) && (
                    <div className="absolute bottom-0 right-0 p-0.5 aspect-square rounded-full bg-bgColorBox">
                      <div className="w-2 aspect-square rounded-full overflow-hidden bg-green-500"></div>
                    </div>
                  )}
                </div>
                <div>
                  <h6>{item.name}</h6>
                  <p className="text-xs">
                    {onlineUsers.includes(item._id) ? `online` : `offline`}
                  </p>
                </div>
              </NavLink>
            </li>
          ))}
          {getUsersResult.hasNextPage && (
            <li
              className="p-2 text-xs text-blue-500 cursor-pointer"
              onClick={() => {
                getUsersResult.fetchNextPage()
              }}
            >
              {getUsersResult.isFetchingNextPage ? 'Loading...' : 'View more'}
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default memo(MessageSidebar)
