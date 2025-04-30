import React, { memo } from 'react'
import { PostType } from '../types/post.type'
import PostCard from './PostCard'
import PaginateComponent from '@/components/layout/paginate-component'

type Type = {
  datas: PostType[]
  isLoading: boolean
  paginations: {
    current_page: number
    total_pages: number
    onChangePage: (name: string, value: string) => void
  }
}

const PostCardList = ({ datas, paginations, isLoading }: Type) => {
  if (isLoading) return <div>Loading...</div>

  // No post found
  if (datas.length === 0) return <div>No post found.</div>

  return (
    <div className="space-y-4">
      {datas.map((item) => (
        <PostCard key={item._id} data={item} />
      ))}
      <PaginateComponent
        forcePage={(paginations.current_page || 1) - 1}
        pageCount={paginations.total_pages || 0}
        onPageChange={(e) => {
          paginations.onChangePage(`_page`, (e.selected + 1).toString())
        }}
      />
    </div>
  )
}

export default memo(PostCardList)
