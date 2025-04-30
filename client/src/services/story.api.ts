import axiosInstance from '@/configs/axios.config'
import { ResponseSuccessListType } from '@/utils/type'
import { StoryType } from '@/features/story/types/story.type'

const baseUrl = `v1/story/`

export async function storyGetAllApi(query = '') {
  const url = baseUrl + `get-all?` + query
  const resp = (
    await axiosInstance.get<ResponseSuccessListType<StoryType>>(url)
  ).data
  return resp
}
