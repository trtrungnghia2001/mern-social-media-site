import { Button } from '@/components/ui/button'
import { IMAGE_NOTFOUND } from '@/constants/image.constant'
import { postGetUserIdApi, postGetUserIdPhotoApi } from '@/services/post.api'
import { userGetIdApi } from '@/services/user.api'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { FaBirthdayCake } from 'react-icons/fa'
import {
  MdDateRange,
  MdEmail,
  MdLocationOn,
  MdOutlineWork,
} from 'react-icons/md'
import { CgArrowsExchangeV } from 'react-icons/cg'
import { GiGraduateCap } from 'react-icons/gi'
import { Link, useParams } from 'react-router-dom'
import PostCardInfiniteScroll from '@/features/post/components/PostCardInfiniteScroll'
import ButtonFollow from '@/features/common/components/ButtonFollow'
import { UserType } from '@/features/authentication/types/user.type'
import { useAuthStore } from '@/features/authentication/stores/auth.store'

const ProfileIdPage = () => {
  const { id } = useParams()
  const { user } = useAuthStore()
  const getUserGetIdResult = useQuery({
    queryKey: ['profile', id],
    queryFn: async () => await userGetIdApi(id as string),
    enabled: !!id,
  })
  const getPostGetUserIdPhotoResult = useQuery({
    queryKey: ['profile', id, 'photo'],
    queryFn: async () => await postGetUserIdPhotoApi(id as string, '_limit=9'),
    enabled: !!id,
  })
  const getPostGetUserIdResult = useInfiniteQuery({
    queryKey: ['profile', 'posts', id],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      return await postGetUserIdApi(id as string, `_page=${pageParam}`)
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
    enabled: !!id,
  })

  // custom data
  const userData = getUserGetIdResult.data?.data
  const introData = useMemo(() => {
    if (!userData) return []
    return [
      { label: 'Email', value: userData.email, icon: <MdEmail /> },
      { label: 'Address', value: userData.address, icon: <MdLocationOn /> },
      {
        label: 'Birthday',
        value: userData.birthday && new Date(userData.birthday).toDateString(),
        icon: <FaBirthdayCake />,
      },
      { label: 'Gender', value: userData.gender, icon: <CgArrowsExchangeV /> },
      {
        label: 'Education',
        value: userData.education,
        icon: <GiGraduateCap />,
      },
      {
        label: 'Work',
        value: userData.work,
        icon: <MdOutlineWork />,
      },
      {
        label: 'Join',
        value:
          userData.createdAt && new Date(userData.createdAt).toDateString(),
        icon: <MdDateRange />,
      },
    ]
  }, [userData])
  return (
    <div>
      {/* top */}
      <div className="bg-bgColorBox">
        {/* banner */}
        <div className="bg-gray-100 max-h-[300px] max-w-[1096px] w-full aspect-video mx-auto rounded-lg overflow-hidden">
          {userData?.banner && (
            <img src={userData?.banner} alt={userData?.banner} loading="lazy" />
          )}
        </div>
        <div className="max-w-[1032px] w-full mx-auto flex flex-col items-center relative">
          {/* avatar */}
          <div className="absolute top-0 -translate-y-[50%] p-1 w-max rounded-full overflow-hidden bg-bgColorBox">
            <div className="w-44 aspect-square overflow-hidden rounded-full">
              <img
                src={userData?.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
                alt={userData?.avatar || IMAGE_NOTFOUND.AVATAR_NOTFOUND}
                loading="lazy"
              />
            </div>
          </div>
          <div className="mt-20 space-y-4 py-4">
            {/* info */}
            <div className=" text-center">
              <h3>
                <span className="font-bold">{userData?.name}</span>
                {userData?.nickName && <span>({userData?.nickName})</span>}
              </h3>
              <p>{userData?.total_follower} follower</p>
            </div>
            {/* actions */}
            {userData?._id !== user?._id && (
              <div className="text-center space-x-4">
                <ButtonFollow user={userData as UserType} />
                <Link to={`/messages/` + userData?._id}>
                  <Button size={'sm'}>Message</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* main */}
      <div className="mt-6 max-w-[1032px] w-full mx-auto flex flex-col md:flex-row items-start gap-6">
        {/* left */}
        <div className="md:max-w-xs w-full space-y-4">
          {/* intro */}
          <div className="bg-bgColorBox p-3 rounded-lg">
            <h4 className="mb-2">Intro</h4>
            <div
              className="whitespace-break-spaces text-center border-b pb-2"
              dangerouslySetInnerHTML={{ __html: userData?.bio || '' }}
            ></div>
            <ul className="mt-4 space-y-2">
              {introData.map(({ label, value, icon }) => (
                <li key={label} className="flex items-center gap-4">
                  <span className="text-base">{icon}</span>
                  <p className="flex-1">
                    <span className="font-medium">{label}: </span>
                    {value}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          {/* photo */}
          <div className="bg-bgColorBox p-3 rounded-lg">
            <h4 className="mb-2">Photo</h4>
            <ul className="grid gap-2 grid-cols-3">
              {getPostGetUserIdPhotoResult.data?.data.results.map((item) => (
                <li
                  key={item._id}
                  className="w-full aspect-square overflow-hidden rounded"
                >
                  <img src={item.file_url} alt={item.file_url} loading="lazy" />
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* right */}
        <div className="flex-1 w-full">
          {/* posts */}
          <PostCardInfiniteScroll
            isLoading={getPostGetUserIdResult.isLoading}
            loadMore={async () => {
              await getPostGetUserIdResult.fetchNextPage()
            }}
            hasMore={getPostGetUserIdResult.hasNextPage}
            datas={
              getPostGetUserIdResult.data?.pages?.flatMap(
                (item) => item.data.results,
              ) || []
            }
            isForm={id === user?._id}
          />
        </div>
      </div>
    </div>
  )
}

export default ProfileIdPage
