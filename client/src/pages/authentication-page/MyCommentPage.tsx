import CommentCardList from '@/features/comment/components/CommentCardList'
import { useCommentStore } from '@/features/comment/stores/comment.store'
import useSearchParamsValue from '@/hooks/useSearchParamsValue'
import { useQuery } from '@tanstack/react-query'

const MyCommentPage = () => {
  const { searchParams, handleSearchParams } = useSearchParamsValue()
  const { getCommentsByMe, comments } = useCommentStore()
  const getCommentsByMeResult = useQuery({
    queryKey: ['me', 'comment', searchParams.toString()],
    queryFn: async () => await getCommentsByMe(searchParams.toString()),
  })
  return (
    <CommentCardList
      datas={comments}
      paginations={{
        current_page:
          getCommentsByMeResult.data?.data.paginations.current_page || 1,
        total_pages:
          getCommentsByMeResult.data?.data.paginations.total_pages || 0,
        onChangePage: handleSearchParams,
      }}
      isLoading={getCommentsByMeResult.isLoading}
    />
  )
}

export default MyCommentPage
