import React, { memo } from 'react'
import PaginateComponent from '@/components/layout/paginate-component'
import { CommentType } from '../types/comment.type'
import CommentCard from './CommentCard'

type Type = {
  datas: CommentType[]
  isLoading: boolean
  paginations: {
    current_page: number
    total_pages: number
    onChangePage: (name: string, value: string) => void
  }
}

const CommentCardList = ({ datas, paginations, isLoading }: Type) => {
  if (isLoading) return <div>Loading...</div>

  // No post found
  if (datas.length === 0) return <div>No comment found.</div>

  return (
    <div className="space-y-4">
      <div className="grid gap-4 ">
        {datas.map((item) => (
          <CommentCard key={item._id} data={item} isAuth />
        ))}
      </div>
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

export default memo(CommentCardList)
