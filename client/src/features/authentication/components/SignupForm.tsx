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
import { SignupType } from '../types/auth.type'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Password must be at least 6 characters long',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters long',
  }),
  confirm_password: z.string().min(6, {
    message: 'Confirm password must be at least 6 characters long',
  }),
})

const SignupForm = () => {
  const { signup } = useAuthStore()
  const signupResult = useMutation({
    mutationFn: async (values: SignupType) => {
      return await signup(values)
    },
    onSuccess: (data) => {
      toast.success(data.message)
      navigate(`/signin`)
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
      email: '',
      name: '',
      password: '',
      confirm_password: '',
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    signupResult.mutate(values)
  }

  const navigate = useNavigate()

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            disabled={signupResult.isPending}
            type="submit"
            className="w-full"
          >
            {signupResult.isPending ? 'Loading...' : 'Sign Up'}
          </Button>
        </form>
      </Form>
    </>
  )
}

export default memo(SignupForm)
