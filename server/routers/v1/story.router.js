import upload from '#server/configs/multer.config'
import { QUERY_PARAMETER } from '#server/constants/query.constant'
import {
  handleResponse,
  handleResponseList,
} from '#server/helpers/responses.helper'
import { authProtectedRouter } from '#server/middlewares/auth.middleware'
import storyModel from '#server/models/story.model'
import { uploadImageToCloudinary } from '#server/utils/storage.util'
import express from 'express'
import { StatusCodes } from 'http-status-codes'

const storyRouter = express.Router()
storyRouter.get(`/get-all`, async (req, res, next) => {
  try {
    const _page = parseInt(req.query._page) || QUERY_PARAMETER._PAGE
    const _limit = parseInt(req.query._limit) || QUERY_PARAMETER._LIMIT
    const _skip = parseInt(req.query._skip) || QUERY_PARAMETER._SKIP

    const filter = {
      expiredAt: {
        $gte: Date.now(),
      },
    }

    const getDatas = await storyModel
      .find(filter)
      .populate([`user`])
      .limit(_limit)
      .skip((_page - 1) * _limit + _skip)
      .sort({ createdAt: -1 })

    const total_rows = await storyModel.countDocuments(filter)
    const total_pages = Math.ceil(total_rows / _limit)

    return handleResponseList(res, {
      status: StatusCodes.OK,
      message: 'Stories fetched successfully',
      results: getDatas,
      paginations: {
        total_rows,
        total_pages,
        current_page: 1,
        limit: _limit,
        skip: _skip,
      },
    })
  } catch (error) {
    next(error)
  }
})
// auth
storyRouter.get(`/get-me`, authProtectedRouter, async (req, res, next) => {
  try {
    const _page = parseInt(req.query._page) || QUERY_PARAMETER._PAGE
    const _limit = parseInt(req.query._limit) || QUERY_PARAMETER._LIMIT
    const _skip = parseInt(req.query._skip) || QUERY_PARAMETER._SKIP
    const user = req.user

    const filter = {
      user: user._id,
    }

    const getDatas = await storyModel
      .find(filter)
      .populate([`user`])
      .limit(_limit)
      .skip((_page - 1) * _limit + _skip)
      .sort({ createdAt: -1 })

    const total_rows = await storyModel.countDocuments(filter)
    const total_pages = Math.ceil(total_rows / _limit)

    return handleResponseList(res, {
      status: StatusCodes.OK,
      message: 'Stories fetched successfully',
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
})
storyRouter.post(
  `/create`,
  upload.single('file'),
  authProtectedRouter,
  async (req, res, next) => {
    try {
      const body = req.body
      const user = req.user
      const file = req.file

      let file_url = body.file_url
      if (file) {
        file_url = (await uploadImageToCloudinary(file)).url
      }
      const newData = await storyModel.create({
        ...body,
        user: user._id,
        file_url: file_url,
      })

      return handleResponse(res, {
        status: StatusCodes.CREATED,
        message: 'Story created successfully',
        data: newData,
      })
    } catch (error) {
      next(error)
    }
  },
)
storyRouter.delete(
  `/delete/:id`,
  authProtectedRouter,
  async (req, res, next) => {
    try {
      const id = req.params.id
      const deleteData = await storyModel.findByIdAndDelete(id, { new: true })

      return handleResponse(res, {
        status: StatusCodes.OK,
        message: 'Story deleted successfully',
        data: deleteData,
      })
    } catch (error) {
      next(error)
    }
  },
)

export default storyRouter
