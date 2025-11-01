import { IMAGE_NOTFOUND } from '@/constants/image.constant'
import { useAuthStore } from '@/features/authentication/stores/auth.store'
import { useMessageStore } from '@/features/message/stores/message.store'
import { useSocketioStore } from '@/features/socket.io/stores/soket.store'
import { userGetIdApi } from '@/services/user.api'
import { displayTime } from '@/utils/time'
import { useMutation, useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import { FaFileImage } from 'react-icons/fa'
import { IoIosSend } from 'react-icons/io'
import { MdClose } from 'react-icons/md'
import { useParams } from 'react-router-dom'

const MyMessageIdPage = () => {
  const { onlineUsers, subscribeToMessages, unsubscribeFromMessages } =
    useSocketioStore()
  const { user } = useAuthStore()
  const { id } = useParams()
  const getUserIdResult = useQuery({
    queryKey: ['message', 'user', id],
    queryFn: async () => await userGetIdApi(id as string),
    enabled: !!id,
  })
  const userData = getUserIdResult.data?.data
  const [file, setFile] = useState<File | null>(null)
  const [previewFile, setPreivewFile] = useState('')
  useEffect(() => {
    if (file) {
      const newPreview = URL.createObjectURL(file)
      setPreivewFile(newPreview)
      return () => {
        URL.revokeObjectURL(newPreview)
      }
    } else {
      setPreivewFile('')
    }
  }, [file])
  const [message, setMessage] = useState('')

  const { create, getChatByUserId, messages } = useMessageStore()

  const createMessageResult = useMutation({
    mutationFn: async () => {
      const formData = new FormData()

      formData.append('message', message)
      formData.append('receiver', id as string)
      if (file) {
        formData.append('file', file)
      }
      return await create(formData)
    },
    onSuccess() {
      setMessage('')
      setFile(null)
    },
  })
  const getChatByUserIdResult = useQuery({
    queryKey: ['message', 'chat', id],
    queryFn: async () => await getChatByUserId(id as string),
    enabled: !!id,
  })

  useEffect(() => {
    subscribeToMessages(id as string)
    return () => {
      unsubscribeFromMessages()
    }
  }, [
    id,
    createMessageResult.data,
    subscribeToMessages,
    unsubscribeFromMessages,
  ])

  const bottomRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages])

  return (
    <div
      className={clsx([
        `bg-bgColorBox p-3 rounded-lg relative h-full flex flex-col gap-4 justify-between`,
      ])}
    >
      {/* top */}
      <div className={`flex items-center gap-3 border-b pb-2`}>
        <div className="relative">
          <div className="w-9 aspect-square overflow-hidden rounded-full">
            <img
              src={userData?.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
              alt={userData?.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
              loading="lazy"
            />
          </div>
          {onlineUsers.includes(userData?._id as string) && (
            <div className="absolute bottom-0 right-0 p-0.5 aspect-square rounded-full bg-bgColorBox">
              <div className="w-2 aspect-square rounded-full overflow-hidden bg-green-500"></div>
            </div>
          )}
        </div>
        <div>
          <h6>{userData?.name}</h6>
          <p className="text-xs">
            {onlineUsers.includes(userData?._id as string)
              ? `online`
              : `offline`}
          </p>
        </div>
      </div>
      {/* messages */}
      <div className="flex-1 overflow-y-auto">
        {getChatByUserIdResult.isLoading && <div>Loading...</div>}

        <ul className="space-y-4 ">
          {messages?.map((item) => (
            <li
              key={item._id}
              className={clsx([
                `flex`,
                item.sender._id === user?._id ? `justify-end` : `justify-start`,
              ])}
            >
              <div className="flex items-end gap-2 max-w-[50%]">
                <div
                  className={clsx([
                    `flex-1 overflow-hidden flex flex-col gap-1`,
                    item.sender._id === user?._id ? `items-end` : `items-start`,
                  ])}
                >
                  {item.file_url && (
                    <div className="w-40 overflow-hidden rounded">
                      <img src={item.file_url} alt={item.file_url} />
                    </div>
                  )}
                  {item.message && (
                    <div
                      className={clsx([
                        `whitespace-break-spaces break-words px-3 py-1 rounded w-max`,
                        item.sender._id === user?._id
                          ? `bg-blue-500 text-white`
                          : `bg-gray-100`,
                      ])}
                      dangerouslySetInnerHTML={{ __html: item.message }}
                    ></div>
                  )}
                  <p
                    className={clsx([
                      `text-xs text-textColorSecondary`,
                      item.sender._id === user?._id
                        ? `text-right`
                        : `text-left`,
                    ])}
                  >
                    {displayTime(item.createdAt)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div ref={bottomRef}></div>
      </div>
      {/* input */}
      <div className="bg-bgColorBox z-50 p-3 relative">
        {/* preview file*/}
        {previewFile && (
          <div className="bg-bgColorBox border-t absolute left-3 right-3 -top-20 pt-1.5">
            <div className="w-20 aspect-square rounded-lg overflow-hidden relative">
              <button
                type="button"
                className="absolute top-1 right-1 bg-gray-100 rounded-full"
                onClick={() => setFile(null)}
              >
                <MdClose />
              </button>
              <img src={previewFile} alt={previewFile} loading="lazy" />
            </div>
          </div>
        )}
        {/* input */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            createMessageResult.mutate()
          }}
          className="flex items-center gap-4"
        >
          <textarea
            className="flex-1 border p-1.5"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <label htmlFor="file" className="block cursor-pointer">
            <FaFileImage size={16} />
            <input
              id="file"
              name="file"
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] as File)}
            />
          </label>
          <button
            disabled={
              (!file && !message) || createMessageResult.isPending
                ? true
                : false
            }
            type="submit"
          >
            {createMessageResult.isPending ? (
              'Loading...'
            ) : (
              <IoIosSend size={20} />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default MyMessageIdPage
