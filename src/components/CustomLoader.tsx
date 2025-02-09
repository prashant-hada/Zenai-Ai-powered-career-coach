'use client'
import React from 'react'
import {BarLoader} from 'react-spinners'

const CustomLoader = ({message, width, height, color}:{message?:string, width?:string, height?:number, color?:string}) => {
  return (
    <div className='flex flex-col justify-center items-center space-y-10'>
        <BarLoader className='mt-5' width={width?width:1000} height={height?height:8} color={`${color?color:"gray"}`}/>
        <p>
            { (!message || message==='')?'Loading...':message}
        </p>
    </div>
  )
}

export default CustomLoader