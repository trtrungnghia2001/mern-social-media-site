import { ChangeEvent, memo, useState } from 'react'
import { v4 } from 'uuid'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MdClose, MdEmojiEmotions } from 'react-icons/md'
import { AiFillFileImage } from 'react-icons/ai'
import { useAuthStore } from '@/features/authentication/stores/auth.store'

import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useCommentStore } from '../stores/comment.store'
import { CommentType } from '../types/comment.type'
import { IoMdSend } from 'react-icons/io'
import { IMAGE_NOTFOUND } from '@/constants/image.constant'

type Type = {
  postId: string
  // reply
  commentId?: string
  isReply?: boolean
}

const CommentCreateUpdateForm = ({ postId, isReply, commentId }: Type) => {
  const formId = v4()
  const { user } = useAuthStore()
  const { create } = useCommentStore()
  const createResult = useMutation({
    mutationFn: async () => {
      const formData = new FormData()

      Object.entries(formValue).forEach(([key, value]) => {
        formData.append(key, value as string)
      })
      formData.append('post', postId)

      if (file) {
        formData.append('file', file)
      }
      if (isReply) {
        formData.append('comment', commentId as string)
      }
      return await create(formData)
    },
    onSuccess: (data) => {
      toast.success(data.message)
      setFormValue({ content: '', file_url: '' })
      setFile(null)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    createResult.mutate()
  }
  const [formValue, setFormValue] = useState<Partial<CommentType>>({
    content: '',
    file_url: '',
  })
  const [file, setFile] = useState<File | null>(null)

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex items-start gap-4">
        <div className="w-8 aspect-square rounded-full overflow-hidden">
          <img
            src={user?.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
            alt={user?.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
            loading="lazy"
          />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg pr-2">
            <Textarea
              className="flex-1 border-none outline-none resize-none"
              placeholder="Write a comment..."
              value={formValue.content}
              onChange={(e) =>
                setFormValue({ ...formValue, content: e.target.value })
              }
            />
            {/* actions */}
            <div className="flex flex-col gap-2">
              <label htmlFor={formId} className="inline-block cursor-pointer">
                <AiFillFileImage size={16} />
                <input
                  accept="image/*"
                  type="file"
                  id={formId}
                  name={formId}
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] as File)}
                />
              </label>
              <button type="button">
                <MdEmojiEmotions size={16} />
              </button>
            </div>
          </div>
          {/* files */}
          {file && (
            <div className="max-w-24 w-full relative overflow-hidden rounded-lg">
              <img src={URL.createObjectURL(file)} alt={file?.name} />
              <button
                className="absolute top-1 right-1 bg-gray-100 rounded-full"
                onClick={() => setFile(null)}
              >
                <MdClose />
              </button>
            </div>
          )}
          <Button
            size={'sm'}
            className="w-full"
            disabled={
              (!file && !formValue?.content) || createResult.isPending
                ? true
                : false
            }
            type="submit"
          >
            {createResult.isPending
              ? 'Loading...'
              : isReply
              ? 'Reply'
              : 'Comment'}
            <IoMdSend />
          </Button>
        </div>
      </div>
    </form>
  )
}

export default memo(CommentCreateUpdateForm)
