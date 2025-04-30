import React, { memo, useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '../stores/auth.store'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { UserType } from '../types/user.type'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { IMAGE_NOTFOUND } from '@/constants/image.constant'
import { gender_options } from '../constants/option.constant'

const formSchema = z.object({
  avatar: z.string(),
  banner: z.string(),
  name: z.string().min(3, {
    message: 'Name must be at least 3 characters long',
  }),
  nickName: z.string(),
  phoneNumber: z.string(),
  address: z.string(),
  birthday: z.string(),
  gender: z.string(),
  work: z.string(),
  education: z.string(),
  skills: z.string(),
  bio: z.string(),
})

const UpdateProfileForm = () => {
  const { updataMe, user } = useAuthStore()
  const updataMeResult = useMutation({
    mutationFn: async (values: Partial<UserType>) => {
      const formData = new FormData()

      Object.entries(values).forEach(([key, value]) =>
        formData.append(key, value as string),
      )

      if (fileAvatar) {
        formData.append('fileAvatar', fileAvatar)
      }
      if (fileBanner) {
        formData.append('fileBanner', fileBanner)
      }

      return await updataMe(formData)
    },
    onSuccess: (data) => {
      toast.success(data.message)
    },
    onError: (error) => {
      toast.error(error.message)
      console.error('Error:', error)
    },
  })

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      avatar: '',
      banner: '',
      name: '',
      nickName: '',
      phoneNumber: '',
      address: '',
      birthday: '',
      gender: '',
      work: '',
      education: '',
      skills: '',
      bio: '',
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    updataMeResult.mutate(values)
    // console.log({ values })
  }

  // update
  useEffect(() => {
    if (user) {
      Object.entries(user).forEach(([key]) => {
        form.setValue(
          key as keyof z.infer<typeof formSchema>,
          user[key as keyof z.infer<typeof formSchema>],
        )
      })
    }
  }, [user])

  // files
  const [fileAvatar, setFileAvatar] = useState<File | null>(null)
  const [previewAvatar, setPreviewAvatar] = useState('')
  const [fileBanner, setFileBanner] = useState<File | null>(null)
  const [previewBanner, setPreviewBanner] = useState('')
  useEffect(() => {
    if (fileAvatar) {
      const url = URL.createObjectURL(fileAvatar)
      setPreviewAvatar(url)
      return () => {
        URL.revokeObjectURL(url)
      }
    } else if (user?.avatar) {
      setPreviewAvatar(user?.avatar)
    }

    if (fileBanner) {
      const url = URL.createObjectURL(fileBanner)
      setPreviewBanner(url)
      return () => {
        URL.revokeObjectURL(url)
      }
    } else if (user?.banner) {
      setPreviewBanner(user?.banner)
    }
  }, [user, fileAvatar, fileBanner])

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-bgColorBox p-4 rounded-lg space-y-4"
        >
          <div className="relative mb-24">
            {/* banner */}
            <label
              htmlFor="fileBanner"
              className="block bg-gray-100 h-40 rounded-lg overflow-hidden"
            >
              <img
                src={previewBanner || ''}
                alt={previewBanner || ''}
                loading="lazy"
              />
              <input
                accept="image/*"
                type="file"
                id="fileBanner"
                name="fileBanner"
                onChange={(e) => setFileBanner(e.target.files?.[0] as File)}
                className="hidden"
              />
            </label>
            {/* avatar */}
            <div className="absolute top-[50%] left-[50%] -translate-x-[50%] rounded-full p-1 bg-bgColorBox">
              <label
                htmlFor="fileAvatar"
                className="block mx-auto w-40 aspect-square rounded-full overflow-hidden"
              >
                <img
                  src={previewAvatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
                  alt={previewAvatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
                  loading="lazy"
                />
                <input
                  accept="image/*"
                  type="file"
                  id="fileAvatar"
                  name="fileAvatar"
                  onChange={(e) => setFileAvatar(e.target.files?.[0] as File)}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nickName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nick name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthday"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birthday</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={(value) =>
                    value != '' && field.onChange(value)
                  }
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {gender_options.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="work"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="education"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Education</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skills</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button size={'sm'} disabled={updataMeResult.isPending} type="submit">
            {updataMeResult.isPending ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </Form>
    </>
  )
}

export default memo(UpdateProfileForm)
