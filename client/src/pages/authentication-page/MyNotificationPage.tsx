import { Button } from '@/components/ui/button'
import NotificationCardList from '@/features/common/components/NotificationCardList'
import { useNotificationStore } from '@/features/common/stores/notification.store'
import useSearchParamsValue from '@/hooks/useSearchParamsValue'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
const MyNotificationPage = () => {
  const { searchParams, handleSearchParams } = useSearchParamsValue()
  const { getNotificationsByUser, notifications, deleteByMe } =
    useNotificationStore()
  const getNotificationsByUserResult = useQuery({
    queryKey: ['me', 'notification', searchParams.toString()],
    queryFn: async () => await getNotificationsByUser(searchParams.toString()),
  })
  const deleteByMeResult = useMutation({
    mutationFn: async () => await deleteByMe(),
    onSuccess: (data) => {
      toast.success(data.message)
    },
    onError: (error) => {
      toast.error(error.message)
      console.error('Error:', error)
    },
  })

  return (
    <div className="space-y-6">
      {notifications.length > 0 && (
        <div>
          <Button
            disabled={deleteByMeResult.isPending}
            size={'sm'}
            variant="destructive"
            onClick={() => deleteByMeResult.mutate()}
          >
            {deleteByMeResult.isPending
              ? 'Loading...'
              : 'Delete All Notifications'}
          </Button>
        </div>
      )}
      <NotificationCardList
        datas={notifications}
        paginations={{
          current_page:
            getNotificationsByUserResult.data?.data.paginations.current_page ||
            1,
          total_pages:
            getNotificationsByUserResult.data?.data.paginations.total_pages ||
            0,
          onChangePage: handleSearchParams,
        }}
        isLoading={getNotificationsByUserResult.isLoading}
      />
    </div>
  )
}

export default MyNotificationPage
