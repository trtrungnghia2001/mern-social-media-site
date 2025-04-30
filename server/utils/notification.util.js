import notificationModel from '#server/models/notification.model'

export async function notificationCreate({
  sender,
  receiver,
  post,
  comment,
  content,
  type,
}) {
  // save database
  // let check
  // check = await notificationModel.findOne({
  //   sender: sender,
  //   receiver: receiver,
  //   post: post,
  //   comment: comment,
  //   type: type,
  // })
  const newNotification = await notificationModel.create({
    sender: sender,
    receiver: receiver,
    post: post,
    comment: comment,
    content: content,
    type: type,
  })

  return newNotification
}
