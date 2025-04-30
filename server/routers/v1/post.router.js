import upload from '#server/configs/multer.config'
import { NOTIFICATION_TYPE } from '#server/constants/notification.constant'
import { QUERY_PARAMETER } from '#server/constants/query.constant'
import {
  handleResponse,
  handleResponseList,
} from '#server/helpers/responses.helper'
import { authProtectedRouter } from '#server/middlewares/auth.middleware'
import likeModel from '#server/models/like.model'
import notificationModel from '#server/models/notification.model'
import postModel from '#server/models/post.model'
import saveModel from '#server/models/save.model'
import { notificationCreate } from '#server/utils/notification.util'
import { customPostData } from '#server/utils/post.util'
import {
  deleteImageToCloudinary,
  uploadImageToCloudinary,
} from '#server/utils/storage.util'
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { Types } from 'mongoose'

const postRouter = express.Router()

postRouter.get(`/get-all`, async (req, res, next) => {
  try {
    const _q = req.query._q || QUERY_PARAMETER._Q

    const filter = [
      {
        $match: {
          content: {
            $regex: _q,
            $options: 'i',
          },
        },
      },
    ]

    const getDatas = await customPostData({ req, filter })

    return handleResponseList(res, {
      status: StatusCodes.OK,
      message: 'Posts fetched successfully',
      results: getDatas.posts,
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
postRouter.get(`/get-user/:id`, async (req, res, next) => {
  try {
    const filter = [
      {
        $match: {
          user: new Types.ObjectId(req.params.id),
        },
      },
    ]

    const getDatas = await customPostData({ req, filter })

    return handleResponseList(res, {
      status: StatusCodes.OK,
      message: 'Posts fetched successfully',
      results: getDatas.posts,
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
postRouter.get(`/get-user/:id/photo`, async (req, res, next) => {
  try {
    const _page = parseInt(req.query._page) || QUERY_PARAMETER._PAGE
    const _limit = parseInt(req.query._limit) || QUERY_PARAMETER._LIMIT
    const _skip = parseInt(req.query._skip) || QUERY_PARAMETER._SKIP

    const { id } = req.params

    const filter = {
      file_url: {
        $ne: '',
      },
      user: id,
    }

    const getDatas = await postModel
      .find(filter)
      .populate([`user`])
      .limit(_limit)
      .skip((_page - 1) * _limit + _skip)
      .sort({
        createdAt: -1,
      })

    const total_rows = await postModel.countDocuments(filter)
    const total_pages = Math.ceil(total_rows / _limit)

    return handleResponseList(res, {
      status: StatusCodes.OK,
      message: 'Posts fetched successfully',
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
// auth
postRouter.get(`/get-me`, authProtectedRouter, async (req, res, next) => {
  try {
    const filter = [
      {
        $match: {
          user: new Types.ObjectId(req.user._id),
        },
      },
    ]

    const getDatas = await customPostData({ req, filter })

    return handleResponseList(res, {
      status: StatusCodes.OK,
      message: 'Posts fetched successfully',
      results: getDatas.posts,
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
postRouter.post(
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
      const newData = await postModel.create({
        ...body,
        user: user._id,
        file_url: file_url,
      })

      return handleResponse(res, {
        status: StatusCodes.CREATED,
        message: 'Post created successfully',
        data: newData,
      })
    } catch (error) {
      next(error)
    }
  },
)
postRouter.put(
  `/update/:id`,
  upload.single('file'),
  authProtectedRouter,
  async (req, res, next) => {
    try {
      const id = req.params.id
      const body = req.body
      const file = req.file

      let file_url = body.file_url
      if (file) {
        file_url = (await uploadImageToCloudinary(file)).url
      }

      const updateData = await postModel
        .findByIdAndUpdate(
          id,
          {
            ...body,
            file_url: file_url,
          },
          { new: true },
        )
        .populate(['user'])

      return handleResponse(res, {
        status: StatusCodes.OK,
        message: 'Post updated successfully',
        data: updateData,
      })
    } catch (error) {
      next(error)
    }
  },
)
postRouter.delete(
  `/delete/:id`,
  authProtectedRouter,
  async (req, res, next) => {
    try {
      const id = req.params.id
      const deleteData = await postModel
        .findByIdAndDelete(id, { new: true })
        .then(async (doc) => {
          doc.file_url && (await deleteImageToCloudinary(doc.file_url))
          return doc
        })

      return handleResponse(res, {
        status: StatusCodes.OK,
        message: 'Post deleted successfully',
        data: deleteData,
      })
    } catch (error) {
      next(error)
    }
  },
)

// save
postRouter.get(`/get-save`, authProtectedRouter, async (req, res, next) => {
  try {
    const filter = [
      {
        $lookup: {
          from: 'saves',
          localField: '_id',
          foreignField: 'post',
          as: 'saved',
        },
      },
      {
        $match: {
          'saved.user': new Types.ObjectId(req.user._id),
        },
      },
      {
        $project: {
          saved: 0,
        },
      },
    ]

    const getDatas = await customPostData({ req, filter })

    return handleResponseList(res, {
      status: StatusCodes.OK,
      message: 'Posts fetched successfully',
      results: getDatas.posts,
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
postRouter.post(`/save-unsave`, authProtectedRouter, async (req, res, next) => {
  try {
    const body = req.body
    const user = req.user

    const check = await saveModel.findOne({
      user: user._id,
      post: body.post,
    })

    if (check) {
      const removeData = await saveModel.findByIdAndDelete(check._id, {
        new: true,
      })
      return handleResponse(res, {
        status: StatusCodes.OK,
        message: 'Unsaved post successfully',
        data: removeData,
      })
    }
    const newData = await saveModel.create({
      user: user._id,
      post: body.post,
    })

    return handleResponse(res, {
      status: StatusCodes.CREATED,
      message: 'Saved post successfully',
      data: newData,
    })
  } catch (error) {
    next(error)
  }
})
// like
postRouter.post(`/like-unlike`, authProtectedRouter, async (req, res, next) => {
  try {
    const body = req.body
    const user = req.user

    const check = await likeModel.findOne({
      user: user._id,
      post: body.post,
    })

    if (check) {
      const removeData = await likeModel.findByIdAndDelete(check._id, {
        new: true,
      })
      return handleResponse(res, {
        status: StatusCodes.OK,
        message: 'Unliked post successfully',
        data: removeData,
      })
    }
    const newData = await likeModel.create({
      user: user._id,
      post: body.post,
    })

    // notification
    await notificationCreate({
      sender: user._id,
      receiver: newData.post.user._id,
      post: newData.post._id,
      type: NOTIFICATION_TYPE.LIKE_POST,
    })

    return handleResponse(res, {
      status: StatusCodes.CREATED,
      message: 'Liked post successfully',
      data: newData,
    })
  } catch (error) {
    next(error)
  }
})
export default postRouter
