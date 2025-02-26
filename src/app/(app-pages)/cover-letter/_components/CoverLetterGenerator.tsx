'use client'
import { Input } from '@/components/ui/input'
// import { coverletterSchema } from '@/schema/coverletterSchema'
// import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
// import { useForm } from 'react-hook-form'

const CoverLetterGenerator = () => {

    // const {register, handleSubmit, formState: {errors}, watch} =useForm({
    //     resolver:zodResolver(coverletterSchema),
    //     defaultValues:{
    //         companyName: '',
    //         jobTitle: '',
    //         description: '', 
    //     }
    // })
  return (
    <div className=''>
        <div>
            <h2></h2>
            <p></p>
        </div>

        <form>
            <div>
                <Input />
                <Input />
            </div>

        </form>
    </div>
  )
}

export default CoverLetterGenerator