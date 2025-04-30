import PaginateComponent from '@/components/layout/paginate-component'
import PostCard from '@/features/post/components/PostCard'
import useSearchParamsValue from '@/hooks/useSearchParamsValue'
import { postGetAllApi } from '@/services/post.api'
import { useQuery } from '@tanstack/react-query'

const SearchPostPage = () => {
  const { searchParams, handleSearchParams } = useSearchParamsValue()
  const getPostGetAllResult = useQuery({
    queryKey: ['search', 'post', searchParams.toString()],
    queryFn: async () => await postGetAllApi(searchParams.toString()),
  })

  if (getPostGetAllResult.data?.data.results.length === 0)
    return (
      <div className="max-w-xl w-full mx-auto text-center">
        <h5>No post found</h5>
        <p>Please try searching with a different keyword or date range.</p>
      </div>
    )

  return (
    <div className="max-w-xl w-full mx-auto space-y-4">
      {/* title */}
      <div className="bg-bgColorBox rounded-lg p-3">
        <h5>
          <span className="text-textColorSecondary">Search results: </span>
          <span className="italic underline">{searchParams.get('_q')}</span>
        </h5>
      </div>
      {getPostGetAllResult.data?.data.results.map((item) => (
        <PostCard key={item._id} data={item} />
      ))}
      {getPostGetAllResult.data?.data.paginations && (
        <PaginateComponent
          forcePage={
            getPostGetAllResult.data?.data.paginations.current_page - 1
          }
          pageCount={getPostGetAllResult.data?.data.paginations.total_pages}
          onPageChange={(e) => {
            handleSearchParams(`_page`, (e.selected + 1).toString())
          }}
        />
      )}
    </div>
  )
}

export default SearchPostPage
