import InputSearrch from '@/components/InputSearrch'
import { Button } from '@/components/ui/button'
import UserCard from '@/features/common/components/UserCard'
import PostCard from '@/features/post/components/PostCard'
import useSearchParamsValue from '@/hooks/useSearchParamsValue'
import { postGetAllApi } from '@/services/post.api'
import { userGetAllApi } from '@/services/user.api'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const SearchPage = () => {
  const location = useLocation()
  const { searchParams } = useSearchParamsValue()

  const getUserGetAllResult = useQuery({
    queryKey: ['search', 'user', searchParams.toString()],
    queryFn: async () => await userGetAllApi(searchParams.toString()),
  })
  const getPostGetAllResult = useQuery({
    queryKey: ['search', 'post', searchParams.toString()],
    queryFn: async () => await postGetAllApi(searchParams.toString()),
  })

  //   if()
  return (
    <div className="max-w-xl w-full mx-auto space-y-4">
      <div className="md:hidden px-3">
        <InputSearrch className="bg-bgColorBox" />
      </div>
      {/* title */}
      <h5 className="px-3">
        <span className="text-textColorSecondary">Search results: </span>
        <span className="italic underline">{searchParams.get('_q')}</span>
      </h5>
      {getUserGetAllResult.data?.data?.paginations?.total_rows === 0 &&
        getPostGetAllResult.data?.data?.paginations?.total_rows === 0 && (
          <div>
            <p>No results found.</p>
          </div>
        )}
      {/* users */}
      {getUserGetAllResult.data &&
        getUserGetAllResult.data?.data?.paginations?.total_rows > 0 && (
          <div className="bg-bgColorBox rounded-lg py-3">
            <h4 className="px-3 mb-4">People</h4>
            {getUserGetAllResult.data?.data.results.map((item) => (
              <UserCard key={item._id} data={item} />
            ))}
            <div className="px-3">
              <Link to={`/search/user` + location.search} className="block">
                <Button size={'sm'} variant={'secondary'} className="w-full">
                  See all users
                </Button>
              </Link>
            </div>
          </div>
        )}
      {/* posts */}
      {getPostGetAllResult.data &&
        getPostGetAllResult.data?.data?.paginations?.total_rows > 0 && (
          <div className="space-y-4">
            {getPostGetAllResult.data?.data.results.map((item) => (
              <PostCard key={item._id} data={item} />
            ))}
            <Link to={`/search/post` + location.search} className="block">
              <Button size={'sm'} variant={'secondary'} className="w-full">
                See all posts
              </Button>
            </Link>
          </div>
        )}
    </div>
  )
}

export default SearchPage
