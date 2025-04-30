import React, { memo, useCallback, useEffect, useState } from 'react'
import clsx from 'clsx'
import { FaAngleUp } from 'react-icons/fa'

const ButtonToTopComponent = () => {
  const handleToTop = useCallback(() => {
    window.scrollTo({ top: 0 })
  }, [])
  const [show, setShow] = useState(false)
  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return (
    <button
      className={clsx(
        `fixed bottom-4 right-4 bg-gray-900 text-white p-2 rounded shadow`,
        show ? 'block' : 'hidden',
      )}
      onClick={handleToTop}
    >
      <FaAngleUp size={16} />
    </button>
  )
}

export default memo(ButtonToTopComponent)
