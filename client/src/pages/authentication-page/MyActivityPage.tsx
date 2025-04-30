import ActivityCardList from '@/features/common/components/ActivityCardList'
import { useActivityStore } from '@/features/common/stores/activity.store'
import useSearchParamsValue from '@/hooks/useSearchParamsValue'
import { useQuery } from '@tanstack/react-query'

const MyActivityPage = () => {
  const { searchParams, handleSearchParams } = useSearchParamsValue()
  const { getActivitiesByUser, activities } = useActivityStore()
  const getActivitiesByUserResult = useQuery({
    queryKey: ['me', 'activity', searchParams.toString()],
    queryFn: async () => await getActivitiesByUser(searchParams.toString()),
  })
  return (
    <ActivityCardList
      datas={activities}
      paginations={{
        current_page:
          getActivitiesByUserResult.data?.data.paginations.current_page || 1,
        total_pages:
          getActivitiesByUserResult.data?.data.paginations.total_pages || 0,
        onChangePage: handleSearchParams,
      }}
      isLoading={getActivitiesByUserResult.isLoading}
    />
  )
}

export default MyActivityPage
