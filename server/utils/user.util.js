import { QUERY_PARAMETER } from '#server/constants/query.constant'
import userModel from '#server/models/user.model'
import { Types } from 'mongoose'

export async function customUserData({ req, filter }) {
  const _page = parseInt(req.query._page) || QUERY_PARAMETER._PAGE
  const _limit = parseInt(req.query._limit) || QUERY_PARAMETER._LIMIT
  const _skip = parseInt(req.query._skip) || QUERY_PARAMETER._SKIP
  const _tracking_id = req.query._tracking_id

  const users = await userModel.aggregate([
    ...filter,
    // follow
    {
      $lookup: {
        from: 'follows',
        localField: '_id',
        foreignField: 'following',
        as: 'isFollowing',
        pipeline: [{ $match: { follower: new Types.ObjectId(_tracking_id) } }],
      },
    },
    {
      $lookup: {
        from: 'follows',
        localField: '_id',
        foreignField: 'following',
        as: 'total_follower',
      },
    },
    {
      $addFields: {
        isFollowing: { $gt: [{ $size: '$isFollowing' }, 0] },
        total_follower: { $size: '$total_follower' },
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
      await userModel.aggregate([
        ...filter,
        {
          $count: 'count',
        },
      ])
    )?.[0]?.count || 0

  const total_pages = Math.ceil(total_rows / _limit)

  return { users, total_rows, total_pages, _page, _limit, _skip }
}
