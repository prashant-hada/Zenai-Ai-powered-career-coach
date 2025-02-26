import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import CoverLetterGenerator from '../_components/CoverLetterGenerator'

const NewCoverLetter = () => {
  return (
    <div className='container mx-auto space-y-1 py-6'>
        <Link href={'/interview'} >
            <Button variant={'link'} className='gap-2 pl-0'>
                <ArrowLeft className='h-4 w-4' />
                Back To Interview Preparation
            </Button>
            </Link>
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-6xl font-bold gradient-title">
            Create Cover Letter
          </h1>
        </div>
        <div className="">
          <CoverLetterGenerator />
        </div>
      </div>
  )
}

export default NewCoverLetter