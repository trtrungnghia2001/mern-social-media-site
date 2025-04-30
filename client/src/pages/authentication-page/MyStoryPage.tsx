import StoryCardList from '@/features/story/components/StoryCardList'
import { useStoryStore } from '@/features/story/stores/story.store'
import useSearchParamsValue from '@/hooks/useSearchParamsValue'
import { useQuery } from '@tanstack/react-query'

const MyStoryPage = () => {
  const { searchParams, handleSearchParams } = useSearchParamsValue()
  const { getDatasByMe, datas } = useStoryStore()
  const getDatasByMeResult = useQuery({
    queryKey: ['me', 'story', searchParams.toString()],
    queryFn: async () => await getDatasByMe(searchParams.toString()),
  })
  return (
    <StoryCardList
      datas={datas}
      paginations={{
        current_page:
          getDatasByMeResult.data?.data.paginations.current_page || 1,
        total_pages: getDatasByMeResult.data?.data.paginations.total_pages || 0,
        onChangePage: handleSearchParams,
      }}
      isLoading={getDatasByMeResult.isLoading}
    />
  )
}

export default MyStoryPage
