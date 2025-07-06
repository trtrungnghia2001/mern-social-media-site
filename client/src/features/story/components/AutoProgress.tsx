import clsx from 'clsx'
import React, { FC, HTMLAttributes, memo, useEffect, useState } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  duration: number
  onSuccess?: () => void
}

const AutoProgress: FC<Props> = ({
  duration,
  onSuccess,
  className,
  ...props
}) => {
  const [value, setValue] = useState(0)
  const [timeSuccess, setTimeSuccess] = useState(false)

  useEffect(() => {
    const step = 100 / (duration / 30) // mỗi 30ms tăng bao nhiêu %
    const interval = setInterval(() => {
      setValue((prev) => {
        const next = prev + step
        if (next >= 100) {
          clearInterval(interval)
          setTimeSuccess(true)
        }
        return Math.min(next, 100)
      })
    }, 30)

    return () => {
      clearInterval(interval)
    }
  }, [duration, timeSuccess])

  useEffect(() => {
    if (timeSuccess) {
      onSuccess?.()
      setValue(0)
      setTimeSuccess(false)
    }
  }, [onSuccess, timeSuccess])

  return (
    <div
      className={clsx([
        `h-1 bg-gray-200 rounded-full overflow-hidden`,
        className,
      ])}
      {...props}
    >
      <div
        className="bg-white h-full rounded-full"
        style={{
          width: value + '%',
        }}
      ></div>
    </div>
  )
}

export default memo(AutoProgress)
