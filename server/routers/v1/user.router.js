import { QUERY_PARAMETER } from '#server/constants/query.constant'
import {
  handleResponse,
  handleResponseList,
} from '#server/helpers/responses.helper'
import { customUserData } from '#server/utils/user.util'
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { Types } from 'mongoose'

const userRouter = express.Router()

userRouter.get(`/get-id/:id`, async (req, res, next) => {
  try {
    const { id } = req.params

    const filter = [
      {
        $match: {
          _id: new Types.ObjectId(id),
        },
      },
    ]

    const { users } = await customUserData({ req, filter })

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: 'User data fetched successfully',
      data: users?.[0],
    })
  } catch (error) {
    next(error)
  }
})
userRouter.get(`/get-all`, async (req, res, next) => {
  try {
    const _q = req.query._q || QUERY_PARAMETER._Q

    const filter = [
      {
        $match: {
          name: {
            $regex: _q,
            $options: 'i',
          },
        },
      },
    ]

    const getDatas = await customUserData({ req, filter })

    return handleResponseList(res, {
      status: StatusCodes.OK,
      message: 'Users fetched successfully',
      results: getDatas.users,
      paginations: {
        total_rows: getDatas.total_rows,
        total_pages: getDatas.total_pages,
        current_page: getDatas._page,
        limit: getDatas._limit,
        skip: getDatas._skip,
      },
    })
  } catch (error) {
    next(error)
  }
})

export default userRouter
