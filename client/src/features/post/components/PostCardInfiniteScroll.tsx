import { PostType } from '../types/post.type'
import PostCard from './PostCard'
import InfiniteScroll from 'react-infinite-scroll-component'
import PostCardButton from './PostCardButton'
import { useAuthStore } from '@/features/authentication/stores/auth.store'

const PostCardInfiniteScroll = ({
  datas,
  loadMore,
  hasMore,
  isForm,
}: {
  datas: PostType[]
  loadMore: () => Promise<void>
  hasMore: boolean
  isForm?: boolean
}) => {
  const { user } = useAuthStore()
  return (
    <div className="space-y-4">
      {user && isForm && <PostCardButton />}
      <section className="space-y-4">
        {datas.length === 0 && (
          <div className="text-center">No Posts Found</div>
        )}
        <InfiniteScroll
          next={loadMore}
          hasMore={hasMore}
          dataLength={datas.length}
          loader={<div className="text-center">Loading...</div>}
          className="space-y-4"
        >
          {datas?.map((item) => (
            <PostCard key={item._id} data={item} />
          ))}
        </InfiniteScroll>
      </section>
    </div>
  )
}

export default PostCardInfiniteScroll
