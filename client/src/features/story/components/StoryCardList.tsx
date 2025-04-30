import React, { memo } from 'react'
import PaginateComponent from '@/components/layout/paginate-component'
import StoryCard from './StoryCard'
import { StoryType } from '../types/story.type'

type Type = {
  datas: StoryType[]
  isLoading: boolean
  paginations: {
    current_page: number
    total_pages: number
    onChangePage: (name: string, value: string) => void
  }
}

const StoryCardList = ({ datas, paginations, isLoading }: Type) => {
  if (isLoading) return <div>Loading...</div>

  // No post found
  if (datas.length === 0) return <div>No story found.</div>

  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
        {datas.map((item) => (
          <StoryCard key={item._id} data={item} isAuth />
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

export default memo(StoryCardList)
