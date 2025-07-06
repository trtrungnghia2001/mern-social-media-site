import React, { FC, HTMLAttributes, memo } from 'react'

const WrapperComponent: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={`max-w-7xl w-full mx-auto px-3 ${className}`} {...props}>
      {children}
    </div>
  )
}

export default memo(WrapperComponent)
