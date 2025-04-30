import React, { ChangeEvent, memo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useStoryFormStore } from '../stores/story.form.store'
import { RiImageAddLine } from 'react-icons/ri'
import { useStoryStore } from '../stores/story.store'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const StoryCreateUpateForm = () => {
  const { open, handleClose } = useStoryFormStore()
  const { create } = useStoryStore()
  const [file, setFile] = useState<File | null>(null)
  const createResult = useMutation({
    mutationFn: async () => {
      const formData = new FormData()
      if (file) {
        formData.append('file', file)
      }
      return await create(formData)
    },
    onSuccess: (data) => {
      toast.success(data.message)
      onOpenChange()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  const onSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    createResult.mutate()
  }
  const onOpenChange = () => {
    handleClose()
    setFile(null)
  }
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onOpenChange()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create story?</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 ">
          <label className="rounded-lg bg-gray-100 text-center block cursor-pointer overflow-y-auto">
            {!file ? (
              <div className=" p-8 flex flex-col items-center gap-2">
                <RiImageAddLine size={24} />
                <h6>Add photo</h6>
                <p className="text-xs text-textColorSecondary">
                  or drag and drop
                </p>
              </div>
            ) : (
              <div className="aspect-video overflow-y-auto">
                <div className="w-full ">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={URL.createObjectURL(file)}
                    loading="lazy"
                  />
                </div>
              </div>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] as File)}
            />
          </label>
          <Button
            disabled={!file || createResult.isPending}
            type="submit"
            className="w-full"
          >
            {createResult.isPending ? 'Loading...' : 'Create'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default memo(StoryCreateUpateForm)
