import React, { memo } from 'react'
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
import { ChangePasswordType } from '../types/auth.type'
import toast from 'react-hot-toast'

const formSchema = z.object({
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters long',
  }),
  confirm_password: z.string().min(6, {
    message: 'Confirm password must be at least 6 characters long',
  }),
})

const ChangePasswordForm = () => {
  const { changePassword } = useAuthStore()
  const changePasswordResult = useMutation({
    mutationFn: async (values: ChangePasswordType) => {
      return await changePassword(values)
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
      password: '',
      confirm_password: '',
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    changePasswordResult.mutate(values)
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-bgColorBox p-4 rounded-lg space-y-4"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            size={'sm'}
            disabled={changePasswordResult.isPending}
            type="submit"
          >
            {changePasswordResult.isPending ? 'Loading...' : 'Change Password'}
          </Button>
        </form>
      </Form>
    </>
  )
}

export default memo(ChangePasswordForm)
