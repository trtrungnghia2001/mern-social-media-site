import { QUERY_PARAMETER } from '#server/constants/query.constant'
import {
  handleResponse,
  handleResponseList,
} from '#server/helpers/responses.helper'
import { authProtectedRouter } from '#server/middlewares/auth.middleware'
import followModel from '#server/models/follow.model'
import likeModel from '#server/models/like.model'
import notificationModel from '#server/models/notification.model'
import express from 'express'
import { StatusCodes } from 'http-status-codes'

const commonRouter = express.Router()

// activity
commonRouter.get(
  '/activity/get-me',
  authProtectedRouter,
  async (req, res, next) => {
    try {
      const _page = parseInt(req.query._page) || QUERY_PARAMETER._PAGE
      const _limit = parseInt(req.query._limit) || QUERY_PARAMETER._LIMIT
      const _skip = parseInt(req.query._skip) || QUERY_PARAMETER._SKIP
      const user = req.user
      const filter = {
        user: user._id,
      }

      const getDatas = await likeModel
        .find(filter)
        .populate([
          {
            path: 'post',
          },
          {
            path: 'comment',
            populate: [`comment`, `post`, `user`],
          },
          {
            path: 'user',
          },
        ])
        .limit(_limit)
        .skip((_page - 1) * _limit + _skip)
        .sort({ createdAt: -1 })

      const total_rows = await likeModel.countDocuments(filter)
      const total_pages = Math.ceil(total_rows / _limit)

      return handleResponseList(res, {
        status: StatusCodes.OK,
        message: 'Activity fetched successfully',
        results: getDatas,
        paginations: {
          total_rows,
          total_pages,
          current_page: _page,
          limit: _limit,
          skip: _skip,
        },
      })
    } catch (error) {
      next(error)
    }
  },
)
commonRouter.delete(
  '/activity/unlike/:id',
  authProtectedRouter,
  async (req, res, next) => {
    try {
      const { id } = req.params

      const unLike = await likeModel.findByIdAndDelete(id, {
        new: true,
      })

      return handleResponse(res, {
        status: StatusCodes.OK,
        message: 'Unliked successfully',
        data: unLike,
      })
    } catch (error) {
      next(error)
    }
  },
)
// follow
commonRouter.post(
  `/follow/follow-unfollow`,
  authProtectedRouter,
  async (req, res, next) => {
    try {
      const body = req.body
      const user = req.user

      const filter = {
        follower: user._id,
        following: body.following,
      }

      const check = await followModel.findOne(filter)

      if (check) {
        const removeData = await followModel.findByIdAndDelete(check._id, {
          new: true,
        })
        return handleResponse(res, {
          status: StatusCodes.OK,
          message: 'Unfollowed successfully',
          data: removeData,
        })
      }

      const newData = await followModel.create(filter)

      return handleResponse(res, {
        status: StatusCodes.CREATED,
        message: 'Followed successfully',
        data: newData,
      })
    } catch (error) {
      next(error)
    }
  },
)

// notification
commonRouter.get(
  `/notification/get-me`,
  authProtectedRouter,
  async (req, res, next) => {
    try {
      const _page = parseInt(req.query._page) || QUERY_PARAMETER._PAGE
      const _limit = parseInt(req.query._limit) || QUERY_PARAMETER._LIMIT
      const _skip = parseInt(req.query._skip) || QUERY_PARAMETER._SKIP
      const user = req.user

      const filter = {
        receiver: user._id,
      }

      const getDatas = await notificationModel
        .find(filter)
        .limit(_limit)
        .skip((_page - 1) * _limit + _skip)
        .sort({ updatedAt: -1 })

      const total_rows = await notificationModel.countDocuments(filter)
      const total_pages = Math.ceil(total_rows / _limit)

      return handleResponseList(res, {
        status: StatusCodes.OK,
        message: 'Notification fetched successfully',
        results: getDatas,
        paginations: {
          total_rows,
          total_pages,
          current_page: _page,
          limit: _limit,
          skip: _skip,
        },
      })
    } catch (error) {
      next(error)
    }
  },
)
commonRouter.delete(
  '/notification/delete/:id',
  authProtectedRouter,
  async (req, res, next) => {
    try {
      const { id } = req.params

      const deleteData = await notificationModel.findByIdAndDelete(id, {
        new: true,
      })

      return handleResponse(res, {
        status: StatusCodes.OK,
        message: 'Notification deleted successfully',
        data: deleteData,
      })
    } catch (error) {
      next(error)
    }
  },
)
commonRouter.delete(
  '/notification/delete-me',
  authProtectedRouter,
  async (req, res, next) => {
    try {
      const user = req.user
      const deleteDatas = await notificationModel.deleteMany(
        {
          receiver: user._id,
        },
        {
          new: true,
        },
      )

      return handleResponse(res, {
        status: StatusCodes.OK,
        message: 'All notifications deleted successfully',
        data: deleteDatas,
      })
    } catch (error) {
      next(error)
    }
  },
)
export default commonRouter
