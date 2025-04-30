import { ResponseSuccessType } from '@/utils/type'
import { UserType } from './user.type'
export type SignupType = {
  name: string
  email: string
  password: string
  confirm_password: string
}
export type SigninType = {
  email: string
  password: string
}
export type ForgotPasswordType = {
  email: string
}
export type ResetPasswordType = {
  password: string
  confirm_password: string
}
export type ChangePasswordType = {
  password: string
  confirm_password: string
}

export type AuthStoreType = {
  user: UserType | null
  isAuthenticated: boolean

  signup: (data: SignupType) => Promise<ResponseSuccessType>
  signin: (data: SigninType) => Promise<
    ResponseSuccessType<{
      user: UserType
    }>
  >
  signout: () => Promise<ResponseSuccessType>
  forgotPassword: (data: ForgotPasswordType) => Promise<ResponseSuccessType>
  resetPassword: (data: ResetPasswordType) => Promise<ResponseSuccessType>

  signinWithPassport: (social: string) => void
  signinWithPasspostSuccess: () => Promise<
    ResponseSuccessType<{
      user: UserType
    }>
  >

  getMe: () => Promise<ResponseSuccessType<UserType>>
  updataMe: (data: FormData) => Promise<ResponseSuccessType<UserType>>
  changePassword: (data: ChangePasswordType) => Promise<ResponseSuccessType>
}
