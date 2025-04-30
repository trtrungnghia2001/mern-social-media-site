import upload from '#server/configs/multer.config'
import { QUERY_PARAMETER } from '#server/constants/query.constant'
import {
  handleResponse,
  handleResponseList,
} from '#server/helpers/responses.helper'
import { authProtectedRouter } from '#server/middlewares/auth.middleware'
import messageModel from '#server/models/message.model'
import { uploadImageToCloudinary } from '#server/utils/storage.util'
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { customUserData } from '#server/utils/user.util'
import { Types } from 'mongoose'
import {
  getReceiverSocketId,
  io,
  userSocketMap,
} from '#server/configs/socket.config'

const messageRouter = express.Router()

messageRouter.get('/get-user', authProtectedRouter, async (req, res, next) => {
  try {
    const _q = req.query._q || QUERY_PARAMETER._Q
    const _online = req.query._online

    const user = req.user
    const objIds = Object.keys(userSocketMap).map(
      (item) => new Types.ObjectId(item),
    )

    const filter =
      _online === 'true'
        ? [
            {
              $match: {
                $and: [
                  {
                    _id: {
                      $ne: new Types.ObjectId(user._id),
                    },
                  },
                  {
                    name: {
                      $regex: _q,
                      $options: 'i',
                    },
                  },
                  {
                    _id: {
                      $in: objIds,
                    },
                  },
                ],
              },
            },
          ]
        : [
            {
              $match: {
                $and: [
                  {
                    _id: {
                      $ne: new Types.ObjectId(user._id),
                    },
                  },
                  {
                    name: {
                      $regex: _q,
                      $options: 'i',
                    },
                  },
                ],
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
messageRouter.get(
  '/chat-user/:id',
  authProtectedRouter,
  async (req, res, next) => {
    try {
      const _page = parseInt(req.query._page) || QUERY_PARAMETER._PAGE
      const _limit = parseInt(req.query._limit) || QUERY_PARAMETER._LIMIT
      const _skip = parseInt(req.query._skip) || QUERY_PARAMETER._SKIP
      const user = req.user

      const filter = {
        $or: [
          { sender: user._id, receiver: req.params.id },
          { sender: req.params.id, receiver: user._id },
        ],
      }

      const messages = await messageModel
        .find(filter)
        .sort({ createdAt: 1 })
        // .skip((_page - 1) * _limit + _skip)
        // .limit(_limit)
        .populate(['sender', 'receiver'])

      const total_rows = await messageModel.countDocuments(filter)
      const total_pages = Math.ceil(total_rows / _limit)

      return handleResponseList(res, {
        status: StatusCodes.OK,
        message: 'Messages retrieved successfully',
        results: messages,
        pagination: {
          page: _page,
          limit: _limit,
          skip: _skip,
          total_rows,
          total_pages,
        },
      })
    } catch (error) {
      next(error)
    }
  },
)
messageRouter.post(
  '/create',
  authProtectedRouter,
  upload.single('file'),
  async (req, res, next) => {
    try {
      const body = req.body
      const user = req.user
      const file = req.file

      let file_url = body.file_url

      if (file) {
        file_url = (await uploadImageToCloudinary(file)).url
      }

      const newData = await messageModel
        .create({
          ...body,
          file_url: file_url,
          sender: user._id,
        })
        .then((doc) => {
          const receiverSocketId = getReceiverSocketId(doc.receiver._id)
          if (receiverSocketId) {
            // console.log({ receiverSocketId })

            io.to(receiverSocketId).emit('newMessage', doc)
          }
          return doc
        })

      return handleResponse(res, {
        status: StatusCodes.CREATED,
        message: 'Message created successfully',
        data: newData,
      })
    } catch (error) {
      next(error)
    }
  },
)
export default messageRouter
