import { AiOutlineComment } from 'react-icons/ai'
import { HiOutlineUserGroup } from 'react-icons/hi'
import { IoIosNotificationsOutline } from 'react-icons/io'
import { LiaBirthdayCakeSolid } from 'react-icons/lia'
import {
  IoAlbumsOutline,
  IoSaveOutline,
  IoStopwatchOutline,
} from 'react-icons/io5'
import {
  MdOutlineAmpStories,
  MdOutlineArticle,
  MdOutlineGroup,
  MdOutlineHome,
  MdPassword,
} from 'react-icons/md'
import { FaRegCommentAlt } from 'react-icons/fa'
import { RiUserLine, RiUserSettingsLine } from 'react-icons/ri'
import { useAuthStore } from '@/features/authentication/stores/auth.store'

export const header_links = {
  list1: [
    {
      icon: <MdOutlineHome />,
      name: 'Home',
      path: '/',
    },
    {
      icon: <MdOutlineGroup />,
      name: 'Friends',
      path: '/',
    },
    {
      icon: <MdOutlineAmpStories />,
      name: 'Stories',
      path: '/',
    },
  ],
  list2: [
    {
      icon: <HiOutlineUserGroup />,
      name: 'Groups',
      path: '/',
    },
    {
      icon: <AiOutlineComment />,
      name: 'Messages',
      path: '/messages',
    },
    {
      icon: <IoIosNotificationsOutline />,
      name: 'Notifications',
      path: '/',
    },
  ],
}

export const nav_links = [
  {
    icon: <MdOutlineArticle />,
    name: 'My Post',
    path: '/post',
  },
  {
    icon: <IoStopwatchOutline />,
    name: 'Activity',
    path: '/activity',
  },
  {
    icon: <IoAlbumsOutline />,
    name: 'Albums',
    path: '/albums',
  },
  {
    icon: <IoSaveOutline />,
    name: 'Saved',
    path: '/saved',
  },
  {
    icon: <MdOutlineAmpStories />,
    name: 'Stories',
    path: '/stories',
  },
  {
    icon: <LiaBirthdayCakeSolid />,
    name: 'Birthdays',
    path: '/birthdays',
  },
  {
    icon: <MdOutlineGroup />,
    name: 'Friends',
    path: '/friends',
  },
  {
    icon: <HiOutlineUserGroup />,
    name: 'Groups',
    path: '/groups',
  },
  {
    icon: <AiOutlineComment />,
    name: 'Messages',
    path: '/messages',
  },
  {
    icon: <IoIosNotificationsOutline />,
    name: 'Notifications',
    path: '/notifications',
  },
]

export const auth_nav_links = [
  {
    name: 'Update Profile',
    path: '/update-profile',
    icon: <RiUserSettingsLine />,
  },
  {
    name: 'Change Password',
    path: '/change-password',
    icon: <MdPassword />,
  },
  {
    icon: <MdOutlineArticle />,
    name: 'My Post',
    path: '/post',
  },
  {
    icon: <IoStopwatchOutline />,
    name: 'Activity',
    path: '/activity',
  },
  {
    icon: <FaRegCommentAlt />,
    name: 'Comment',
    path: '/comment',
  },
  {
    icon: <IoSaveOutline />,
    name: 'Saved',
    path: '/saved',
  },
  {
    icon: <MdOutlineAmpStories />,
    name: 'Stories',
    path: '/stories',
  },
  {
    icon: <IoIosNotificationsOutline />,
    name: 'Notifications',
    path: '/notifications',
  },
]

export const user_menu_links = [
  {
    name: 'My Profile',
    path: '/profile/' + useAuthStore.getState().user?._id,
    icon: <RiUserLine />,
  },
  {
    name: 'Update Profile',
    path: '/me/update-profile',
    icon: <RiUserSettingsLine />,
  },
  {
    name: 'Change Password',
    path: '/me/change-password',
    icon: <MdPassword />,
  },
  {
    icon: <IoIosNotificationsOutline />,
    name: 'Notifications',
    path: '/me/notifications',
  },
]

export const support_links = [
  {
    name: 'Help Center',
    path: 'https://support.example.com',
    icon: <MdOutlineArticle />,
  },
  {
    name: 'Contact Us',
    path: 'https://contact.example.com',
    icon: <RiUserLine />,
  },
  {
    name: 'Privacy Policy',
    path: 'https://privacy.example.com',
    icon: <MdOutlineArticle />,
  },
  {
    name: 'Terms & Conditions',
    path: 'https://terms.example.com',
    icon: <MdOutlineArticle />,
  },
  {
    name: 'About Us',
    path: 'https://about.example.com',
    icon: <MdOutlineArticle />,
  },
]
