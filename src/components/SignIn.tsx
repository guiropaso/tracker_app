import Link from 'next/link'
import Logo from '../../public/Logo.png'
import Image from 'next/image'
import UserAuthForm from './UserAuthForm'

export default function SignIn() {
  return (
    <div className='container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]'>
        <div className='flex flex-col space-y-6 text-center'>
        <Image src={Logo} alt="logo" className='mx-auto'/>
        <h1 className='text-2xl font-semibold tracking-tight'>Welcome back</h1>
        <p className='text-sm max-w-xs mx-auto'>
            By continuing, you are setting up an account and agree to our User Agreement and Privacy Policy
        </p>
        <UserAuthForm  />

        <p className='px-8 text-center text-sm text-muted-foreground '>New user?{' '}
        <Link href='' className='hover:text-primary underline underline-offset-4'>Sign Up</Link>
        </p>
        </div>
    </div>
  )
}
