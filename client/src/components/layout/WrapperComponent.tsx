import React, { memo } from 'react'

const WrapperComponent = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={`max-w-7xl w-full mx-auto px-3 ${className}`}>
      {children}
    </div>
  )
}

export default memo(WrapperComponent)
