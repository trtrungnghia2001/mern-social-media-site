import axios from 'axios'
import ENV_CONFIG from '@/configs/env.config'

export async function refreshTokenApi() {
  const url = ENV_CONFIG.URL_SERVER + 'auth/refresh-token'
  const refreshToken = await axios.post(
    url,
    {},
    {
      withCredentials: true,
    },
  )
  return refreshToken
}
