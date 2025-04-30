import PostCardList from '@/features/post/components/PostCardList'
import { usePostStore } from '@/features/post/stores/post.store'
import useSearchParamsValue from '@/hooks/useSearchParamsValue'
import { useQuery } from '@tanstack/react-query'

const MySavePage = () => {
  const { searchParams, handleSearchParams } = useSearchParamsValue()
  const { getSaveByMe, posts_save } = usePostStore()
  const getSaveByMeResult = useQuery({
    queryKey: ['me', 'save', searchParams.toString()],
    queryFn: async () => await getSaveByMe(searchParams.toString()),
  })
  return (
    <PostCardList
      datas={posts_save}
      paginations={{
        current_page:
          getSaveByMeResult.data?.data.paginations.current_page || 1,
        total_pages: getSaveByMeResult.data?.data.paginations.total_pages || 0,
        onChangePage: handleSearchParams,
      }}
      isLoading={getSaveByMeResult.isLoading}
    />
  )
}

export default MySavePage
