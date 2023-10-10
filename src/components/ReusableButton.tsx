"use client"
import React, { ReactNode } from 'react'
import { Button } from './ui/button'

type ReusableButtonProps<T> = {
    cb : T
    children: ReactNode
}

export default function ReusableButton<T>({cb, children}: ReusableButtonProps<T>) {
  return (
    <Button onClick={() => cb}>{children}</Button>
  )
}
