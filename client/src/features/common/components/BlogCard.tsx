import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IMAGE_NOTFOUND } from '@/constants/image.constant'
import { PostType } from '@/features/post/types/post.type'
import React, { memo } from 'react'
import { HiDotsHorizontal } from 'react-icons/hi'

const BlogCard = ({ data }: { data: PostType }) => {
  return (
    <div className="p-3 rounded-lg bg-bgColorBox space-y-1">
      {/* header */}
      <div className="flex items-center justify-between mb-3">
        <h6>Ads</h6>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <HiDotsHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Copy link</DropdownMenuItem>
            <DropdownMenuItem>Report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* main */}
      <div className="space-y-2">
        <div>
          <img src={data.file_url} alt={data.file_url} loading="lazy" />
        </div>
        {/* user */}
        <div className="flex items-center gap-2">
          <div className="aspect-square w-6 rounded-full overflow-hidden">
            <img
              src={data.user?.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
              alt={data.user?.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
              loading="lazy"
            />
          </div>
          <div>
            <h6>{data.user?.name}</h6>
          </div>
        </div>
        {/* content */}
        <div
          className="break-words line-clamp-3 text-13"
          dangerouslySetInnerHTML={{ __html: data.content }}
        ></div>
      </div>
    </div>
  )
}

export default memo(BlogCard)
