import React from 'react'

const AppLayout = async ({children}:{children:React.ReactNode}) => {
  return (
    <div className='container mx-auto mt-20 mb-12'>{children}</div>
  )
}

export default AppLayout