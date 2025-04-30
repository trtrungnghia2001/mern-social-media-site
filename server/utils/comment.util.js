import { QUERY_PARAMETER } from '#server/constants/query.constant'
import commentModel from '#server/models/comment.model'
import { Types } from 'mongoose'

export async function customCommentData({ req, filter }) {
  const _page = parseInt(req.query._page) || QUERY_PARAMETER._PAGE
  const _limit = parseInt(req.query._limit) || QUERY_PARAMETER._LIMIT
  const _skip = parseInt(req.query._skip) || QUERY_PARAMETER._SKIP
  const _tracking_id = req.query._tracking_id

  const comments = await commentModel.aggregate([
    ...filter,
    // populate
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user',
    },
    {
      $lookup: {
        from: 'posts',
        localField: 'post',
        foreignField: '_id',
        as: 'post',
      },
    },
    {
      $unwind: '$post',
    },
    {
      $lookup: {
        from: 'comments',
        localField: 'comment',
        foreignField: '_id',
        as: 'comment',
      },
    },
    {
      $unwind: {
        path: '$comment',
        preserveNullAndEmptyArrays: true,
      },
    },
    // like
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'comment',
        as: 'isLiked',
        pipeline: [{ $match: { user: new Types.ObjectId(_tracking_id) } }],
      },
    },
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'comment',
        as: 'total_likes',
      },
    },
    {
      $addFields: {
        isLiked: { $gt: [{ $size: '$isLiked' }, 0] },
        total_likes: { $size: '$total_likes' },
      },
    },
    // comment
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'comment',
        as: 'total_replies',
      },
    },
    {
      $addFields: {
        total_replies: { $size: '$total_replies' },
      },
    },

    // paginate
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $skip: (_page - 1) * _limit + _skip,
    },
    {
      $limit: _limit,
    },
  ])

  const total_rows =
    (
      await commentModel.aggregate([
        ...filter,
        {
          $count: 'count',
        },
      ])
    )?.[0]?.count || 0

  const total_pages = Math.ceil(total_rows / _limit)

  return { comments, total_rows, total_pages, _page, _limit, _skip }
}
