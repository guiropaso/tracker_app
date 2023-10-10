"use client"
import { useTheme } from 'next-themes'
import React, {useState} from 'react'


export default function Button() {
    const {theme, setTheme} = useTheme()
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Toggle</button>
  )
}
