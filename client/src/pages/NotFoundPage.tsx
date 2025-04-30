import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="flex flex-col gap-4 text-center">
      <h1>Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/">
        <Button size={'sm'}>Go to Homepage</Button>
      </Link>
      <p>
        If you believe this is an error, please contact the site administrator.
      </p>
    </div>
  )
}

export default NotFoundPage
