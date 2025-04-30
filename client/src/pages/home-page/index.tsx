import Left from './Left'
import Right from './Right'
import StoryCard from '@/features/story/components/StoryCard'
import StoryCardButton from '@/features/story/components/StoryCardButton'
import WrapperComponent from '@/components/layout/WrapperComponent'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useStoryStore } from '@/features/story/stores/story.store'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import PostCardInfiniteScroll from '@/features/post/components/PostCardInfiniteScroll'
import { postGetAllApi } from '@/services/post.api'
import { useAuthStore } from '@/features/authentication/stores/auth.store'
import { storyGetAllApi } from '@/services/story.api'

const HomePage = () => {
  const { user } = useAuthStore()

  const { datas: stories } = useStoryStore()
  const getStoriesResult = useQuery({
    queryKey: ['stories'],
    queryFn: async () => await storyGetAllApi(),
    enabled: !!user,
  })

  const postGetAllResult = useInfiniteQuery({
    queryKey: ['posts'],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      return await postGetAllApi(`_page=${pageParam}`)
    },
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (
        lastPage.data.paginations.total_pages < 2 ||
        lastPage.data.results.length < lastPage.data.paginations.limit ||
        lastPage.data.paginations.current_page ===
          lastPage.data.paginations.total_pages
      ) {
        return null
      }
      return lastPageParam + 1
    },
  })
  return (
    <WrapperComponent className="flex items-start gap-6">
      <Left />
      <section className="flex-1 max-w-xl mx-auto space-y-6 overflow-hidden">
        {/* stories */}
        {user && (
          <Swiper
            spaceBetween={8}
            slidesPerView={3}
            breakpoints={{
              640: {
                slidesPerView: 3,
              },
              768: {
                slidesPerView: 4,
              },
              1024: {
                slidesPerView: 5,
              },
              1280: {
                slidesPerView: 6,
              },
            }}
          >
            <SwiperSlide>
              <StoryCardButton />
            </SwiperSlide>
            {stories.map((item) => (
              <SwiperSlide key={item._id}>
                <StoryCard data={item} />
              </SwiperSlide>
            ))}
            {getStoriesResult.data?.data.results.map((item) => (
              <SwiperSlide key={item._id}>
                <StoryCard data={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* posts */}
        <PostCardInfiniteScroll
          loadMore={async () => {
            await postGetAllResult.fetchNextPage()
          }}
          hasMore={postGetAllResult.hasNextPage}
          datas={
            postGetAllResult.data?.pages.flatMap((item) => item.data.results) ||
            []
          }
          isLoading={postGetAllResult.isLoading}
          isForm
        />
      </section>
      <Right />
    </WrapperComponent>
  )
}

export default HomePage
