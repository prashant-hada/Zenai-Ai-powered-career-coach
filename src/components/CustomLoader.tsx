import React from 'react'
import {PropagateLoader} from 'react-spinners'

const CustomLoader = ({message}:{message?:string}) => {
  return (
    <div className='flex flex-col justify-center items-start mx-auto space-y-4'>
        <PropagateLoader className='mt-5' size={20} color='gray' loading={true} />
        <p>
            { (!message || message==='')?'Loading...':message}
        </p>
    </div>
  )
}

export default CustomLoader