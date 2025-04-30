import { FC, memo } from 'react'
import ReactPaginate, { ReactPaginateProps } from 'react-paginate'
import style from './style.module.css'
import { GrFormNext, GrFormPrevious } from 'react-icons/gr'

const Paginate: FC<ReactPaginateProps> = ({ forcePage, ...props }) => {
  return (
    <ReactPaginate
      breakLabel="..."
      previousLabel={<GrFormPrevious />}
      nextLabel={<GrFormNext />}
      pageRangeDisplayed={5}
      renderOnZeroPageCount={null}
      containerClassName={style.containerClassName}
      activeLinkClassName={style.activeLinkClassName}
      pageLinkClassName={style.pageLinkClassName}
      previousLinkClassName={style.pageLinkClassName}
      nextLinkClassName={style.pageLinkClassName}
      disabledLinkClassName={style.disabledLinkClassName}
      {...(forcePage && { forcePage: forcePage > 0 ? forcePage : 0 })}
      {...props}
    />
  )
}

export default memo(Paginate)
