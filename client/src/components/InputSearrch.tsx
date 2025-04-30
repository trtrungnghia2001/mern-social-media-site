import clsx from 'clsx'
import React, { ComponentProps, FC, memo, useState } from 'react'
import { IoMdSearch } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

const InputSearrch: FC<ComponentProps<'input'>> = ({ className, ...props }) => {
  const [value, setValue] = useState('')
  const navigate = useNavigate()
  return (
    <div
      className={clsx([
        'flex items-center border rounded-full text-13 pr-4',
        className,
      ])}
    >
      <input
        placeholder="Search..."
        type="text"
        className="bg-transparent py-1 border-none outline-none flex-1 pl-4"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            navigate(`/search?_q=${value}`)
            setValue('')
          }
        }}
        {...props}
      />
      <IoMdSearch />
    </div>
  )
}

export default memo(InputSearrch)
