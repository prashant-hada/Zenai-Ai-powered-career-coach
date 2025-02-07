import React from 'react'

const AppLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='container mx-auto mt-24 mb-20'>{children}</div>
  )
}

export default AppLayout