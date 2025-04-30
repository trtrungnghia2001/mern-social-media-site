import React, { memo } from 'react'
import PaginateComponent from '@/components/layout/paginate-component'
import ActivityCard from './ActivityCard'
import { ActivityType } from '../types/activity.type'

type Type = {
  datas: ActivityType[]
  isLoading: boolean
  paginations: {
    current_page: number
    total_pages: number
    onChangePage: (name: string, value: string) => void
  }
}

const ActivityCardList = ({ datas, paginations, isLoading }: Type) => {
  if (isLoading) return <div>Loading...</div>

  // No post found
  if (datas.length === 0) return <div>No activity found.</div>

  return (
    <div className="space-y-4">
      <div className="grid gap-4 ">
        {datas.map((item) => (
          <ActivityCard key={item._id} data={item} />
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

export default memo(ActivityCardList)
