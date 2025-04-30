import axiosInstance from '@/configs/axios.config'
import { ResponseSuccessListType } from '@/utils/type'
import { PostType } from '../features/post/types/post.type'

const baseUrl = `v1/post/`

export async function postGetAllApi(query = '') {
  const url = baseUrl + `get-all?` + query
  const resp = (await axiosInstance.get<ResponseSuccessListType<PostType>>(url))
    .data
  return resp
}
export async function postGetUserIdApi(id: string, query = '') {
  const url = baseUrl + `get-user/${id}?` + query
  const resp = (await axiosInstance.get<ResponseSuccessListType<PostType>>(url))
    .data
  return resp
}
export async function postGetUserIdPhotoApi(id: string, query = '') {
  const url = baseUrl + `get-user/${id}/photo?` + query
  const resp = (await axiosInstance.get<ResponseSuccessListType<PostType>>(url))
    .data
  return resp
}
