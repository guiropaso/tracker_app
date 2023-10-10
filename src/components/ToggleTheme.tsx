"use client"
import { useTheme } from 'next-themes'
import { Button } from './ui/button'
import { Sun, Moon } from 'lucide-react'


export default function ToggleTheme() {

    const {theme, setTheme} = useTheme()

  return (
    <>
        <Button
        variant='ghost'
        size='icon'
        aria-label='Toggle theme'
        className='mr-6'
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
            <Sun className='h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0'/>
            <Moon className='absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100'/>
        </Button>
    </>
  )
}
