import { ads } from '@/constants/data.constant'
import BlogCard from '@/features/common/components/BlogCard'

const Right = () => {
  return (
    <section className="hidden xl:block max-w-xs w-full space-y-4">
      {/* blogs */}
      {ads.map((item) => (
        <BlogCard key={item._id} data={item} />
      ))}
    </section>
  )
}

export default Right
