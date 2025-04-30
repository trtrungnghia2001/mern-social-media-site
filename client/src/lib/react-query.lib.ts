import { queryClient } from '@/contexts/ReactQueryClientProvider'
import { PostType } from '@/features/post/types/post.type'
import { ResponseSuccessListType } from '@/utils/type'

type ReactQueryInfiniteType<T = unknown> = {
  pageParams: number[]
  pages: ResponseSuccessListType<T>[]
}

export function ReactQueryInfinitePostAdd(key: string[], value: PostType) {
  if (!queryClient.getQueryData(key)) return

  queryClient.setQueryData(
    key,
    ({ pages, pageParams }: ReactQueryInfiniteType<PostType>) => {
      const customPages =
        pages?.map((item, idx) => {
          if (idx === 0) {
            return {
              ...item,
              data: {
                ...item.data,
                results: [value, ...item.data.results],
              },
            }
          } else {
            return item
          }
        }) || []

      return {
        pageParams: pageParams,
        pages: customPages,
      }
    },
  )
}
export function ReactQueryInfinitePostEdit(key: string[], value: PostType) {
  if (!queryClient.getQueryData(key)) return

  queryClient.setQueryData(
    key,
    ({ pages, pageParams }: ReactQueryInfiniteType<PostType>) => {
      const customPages =
        pages?.map((item, idx) => {
          if (idx === 0) {
            return {
              ...item,
              data: {
                ...item.data,
                results: item.data.results.map((item) =>
                  item._id === value._id ? value : item,
                ),
              },
            }
          } else {
            return item
          }
        }) || []

      return {
        pageParams: pageParams,
        pages: customPages,
      }
    },
  )
}
export function ReactQueryInfinitePostRemove(key: string[], value: PostType) {
  if (!queryClient.getQueryData(key)) return

  queryClient.setQueryData(
    key,
    ({ pages, pageParams }: ReactQueryInfiniteType<PostType>) => {
      const customPages = pages.map((item) => {
        if (item.data.results.some((item) => item._id === value._id)) {
          return {
            ...item,
            data: {
              ...item.data,
              results: item.data.results.filter(
                (item) => item._id !== value._id,
              ),
            },
          }
        }
        return item
      })

      return {
        pageParams: pageParams,
        pages: customPages,
      }
    },
  )
}
