import PostCardList from '@/features/post/components/PostCardList'
import { usePostStore } from '@/features/post/stores/post.store'
import useSearchParamsValue from '@/hooks/useSearchParamsValue'
import { useQuery } from '@tanstack/react-query'

const MyPostPage = () => {
  const { searchParams, handleSearchParams } = useSearchParamsValue()
  const { getDatasByMe, datas } = usePostStore()
  const getDatasByMeResult = useQuery({
    queryKey: ['me', 'post', searchParams.toString()],
    queryFn: async () => await getDatasByMe(searchParams.toString()),
  })
  return (
    <PostCardList
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

export default MyPostPage
