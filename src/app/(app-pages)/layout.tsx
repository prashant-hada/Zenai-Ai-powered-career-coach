import CustomLoader from '@/components/CustomLoader'
import React, { Suspense } from 'react'

function ResumeLayout({children}:{children:React.ReactNode}) {
  return (
    <div className='px-5'>
    <div>
        <Suspense fallback={<CustomLoader />}>
            {children}
        </Suspense>
    </div>
    </div>
  )
}

export default ResumeLayout