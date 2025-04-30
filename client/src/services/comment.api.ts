import axiosInstance from '@/configs/axios.config'
import { ResponseSuccessListType } from '@/utils/type'
import { CommentType } from '@/features/comment/types/comment.type'

const baseUrl = `v1/comment/`

export async function commentGetPostIdApi(id: string, query = '') {
  const url = baseUrl + `get-post/` + id + '?' + query
  const resp = (
    await axiosInstance.get<ResponseSuccessListType<CommentType>>(url)
  ).data
  return resp
}
export async function commentGetCommentIdApi(id: string, query = '') {
  const url = baseUrl + `get-comment/` + id + '?' + query
  const resp = (
    await axiosInstance.get<ResponseSuccessListType<CommentType>>(url)
  ).data
  return resp
}
