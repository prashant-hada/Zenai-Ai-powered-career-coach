import CustomLoader from '@/components/CustomLoader'
import React, { Suspense } from 'react'

function DashboardLayout({children}:{children:React.ReactNode}) {
  return (
    <div className='px-5'>
    <div className="flex justify-start items-center mb-5 ">
        <h1 className='text-6xl font-bold gradient-title'>Industry Insights</h1>
    </div>
    <div>
        <Suspense fallback={<CustomLoader />}>
            {children}
        </Suspense>
    </div>
    </div>
  )
}

export default DashboardLayout