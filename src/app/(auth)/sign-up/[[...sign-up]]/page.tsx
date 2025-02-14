import {SignUp } from '@clerk/nextjs'
import React from 'react'

const Page = () => {
  return <SignUp forceRedirectUrl={process.env.SIGN_IN_REDIRECT_URL} />
}

export default Page