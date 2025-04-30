export const handleError = (err, req, res, next) => {
  const status = err.status || 500
  const message = err.message

  return res.status(status).json({
    status: status,
    message: message,
  })
}

export const handleResponse = (res, { data, message, status }) => {
  return res.status(status).json({
    status: status || 200,
    message,
    data,
  })
}

export const handleResponseList = (
  res,
  {
    results,
    query,
    paginations,
    filter_options,
    sort_options,
    message,
    status,
  },
) => {
  return res.status(status).json({
    status: status || 200,
    message,
    data: {
      query,
      results,
      paginations,
      filter_options,
      sort_options,
    },
  })
}
