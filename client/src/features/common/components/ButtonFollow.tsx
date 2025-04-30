import { Button } from '@/components/ui/button'
import React, { memo, useEffect, useState } from 'react'
import { useFollowStore } from '../stores/follow.store'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { UserType } from '@/features/authentication/types/user.type'

type Type = {
  user: UserType
}

const ButtonFollow = ({ user }: Type) => {
  const [checked, setChecked] = useState(false)
  useEffect(() => {
    if (user) {
      setChecked(user.isFollowing)
    }
  }, [user])
  const { followUnfollow } = useFollowStore()
  const followUnfollowResult = useMutation({
    mutationFn: async () => await followUnfollow(user._id),
    onSuccess: (data) => {
      toast.success(data.message)
      setChecked(!checked)
    },
    onError: (error) => {
      toast.error(error.message)
      console.error('Error:', error)
    },
  })
  return (
    <Button onClick={() => followUnfollowResult.mutate()} size={'sm'}>
      {checked ? 'UnFollow' : 'Follow'}
    </Button>
  )
}

export default memo(ButtonFollow)
