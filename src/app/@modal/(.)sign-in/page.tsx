import CloseModal from '@/components/CloseModal'
import SignIn from '@/components/SignIn'
import { useRouter } from 'next/router'
import React from 'react'

export default function page() {


  return (
    <div className='fixed inset-0 bg-foreground/80 z-50' >
      <div className='container flex items-center h-full max-w-lg mx-auto'>
        <div className='relative w-full h-fit bg-background py-20 px-2 rounded-lg'>
          <div className='absolute top-4 right-4'>
            <CloseModal />
          </div>
          <SignIn />
        </div>
      </div>
    </div>
  )
}
