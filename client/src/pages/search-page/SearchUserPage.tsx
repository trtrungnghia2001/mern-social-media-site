import PaginateComponent from '@/components/layout/paginate-component'
import UserCard from '@/features/common/components/UserCard'
import useSearchParamsValue from '@/hooks/useSearchParamsValue'
import { userGetAllApi } from '@/services/user.api'
import { useQuery } from '@tanstack/react-query'

const SearchUserPage = () => {
  const { searchParams, handleSearchParams } = useSearchParamsValue()
  const getUserGetAllResult = useQuery({
    queryKey: ['search', 'user', searchParams.toString()],
    queryFn: async () => await userGetAllApi(searchParams.toString()),
  })

  if (getUserGetAllResult.data?.data.results.length === 0)
    return (
      <div className="max-w-xl w-full mx-auto text-center">
        <h5>No user found</h5>
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
      {getUserGetAllResult.data?.data.results.map((item) => (
        <UserCard key={item._id} data={item} />
      ))}
      {getUserGetAllResult.data?.data.paginations && (
        <PaginateComponent
          forcePage={
            getUserGetAllResult.data?.data.paginations.current_page - 1
          }
          pageCount={getUserGetAllResult.data?.data.paginations.total_pages}
          onPageChange={(e) => {
            handleSearchParams(`_page`, (e.selected + 1).toString())
          }}
        />
      )}
    </div>
  )
}

export default SearchUserPage
