import axiosInstance from '@/configs/axios.config'
import { ResponseSuccessListType, ResponseSuccessType } from '@/utils/type'
import { UserType } from '@/features/authentication/types/user.type'

const baseUrl = `v1/user/`

export async function userGetIdApi(id: string) {
  const url = baseUrl + `get-id/` + id
  const resp = (await axiosInstance.get<ResponseSuccessType<UserType>>(url))
    .data
  return resp
}
export async function userGetAllApi(query = '') {
  const url = baseUrl + `get-all?` + query
  const resp = (await axiosInstance.get<ResponseSuccessListType<UserType>>(url))
    .data
  return resp
}
