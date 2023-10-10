"use client"
import {zodResolver} from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form"
import { Button } from "./ui/button"
import {LeaveMessageSchema, leaveMessageSchema} from '@/lib/types'

export default function ContactPageForm() {

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        reset,
        setError
    } = useForm<LeaveMessageSchema>({resolver: zodResolver(leaveMessageSchema)})

    const onSubmit = async (data: LeaveMessageSchema) => {
        console.log(data)

        const response= await fetch('api/leavemessage',{
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const responseData = await response.json()
        if(!response.ok) {
          alert("Submitting form failed!")
          return
        }

        if(responseData.errors) {

          const errors = responseData.errors

          if(errors.name) {
            setError('name',{type:'Server Error', message: 'Something went wrong validating name in the server'})
          } else if(errors.email) {
              setError('email',{type:'Server Error', message: 'Something went wrong validating email in the server'})
          } else if(errors.message) {
            setError('message',{type:'Server Error', message: 'Something went wrong validating message in the server'})
          } else {
            alert("Something went wrong validating in the server")
          }
        }

        if(Object.keys(errors).length === 0 && response.ok) {
          reset()
        }
    }

  return (
    <form target='_blank' onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-3/4 mx-auto gap-4 items-center justify-center mb-10 md:mb-0">
        <input
        type="text"
        className="border px-4 h-9 outline-none focus:border-primary rounded-sm bg-transparent w-full"
        placeholder="Name"
        {...register("name")}
        />
        {errors.name && (
          <div className="w-full">
            <p className="text-primary text-left text-sm">{`${errors.name.message}`}</p>
          </div>
        )}

        <input
        type="text"
        className="border px-4 h-9 outline-none focus:border-primary rounded-sm bg-transparent w-full"
        placeholder="Email"
        {...register("email")}
        />
        {errors.email && (
          <div className="w-full">
            <p className="text-primary text-left text-sm">{`${errors.email.message}`}</p>
          </div>
        )}

        <textarea
        className="border h-32 p-4 outline-none focus:border-primary w-full rounded-sm bg-transparent"
        placeholder="Message"
        {...register("message")}
        ></textarea>
        {errors.message && (
          <div className="w-full">
            <p className="text-primary text-left text-sm">{`${errors.message.message}`}</p>
          </div>
        )}

        <Button
        type="submit"
        disabled={isSubmitting}
        size={"lg"}
        className="bg-primary"
        >SUBMIT</Button>
    </form>
  )
}
