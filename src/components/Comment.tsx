import { MessageSquare } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Textarea } from './ui/textarea'
import { twMerge } from 'tailwind-merge'
import { Button } from './ui/button'
import { Set } from '@prisma/client'
import { ChangeEvent, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteComment, editComment } from '@/lib/api'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogCancel, AlertDialogAction } from './ui/alert-dialog'

type Props = {
  set: Set
}





export default function Comment({set}: Props) {
  const [isEditingComment, setIsEditingComment] = useState<boolean>(false)
  const [textAreaComment, setTextAreaComment] = useState<string>('')

  const queryClient = useQueryClient()
  
  const mutationEditComment = useMutation({
    mutationFn: (obj: Set) => editComment(obj),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['sets']})
  })

  const mutationdeleteComment = useMutation({
    mutationFn: (setId:string) => deleteComment(setId),
    onSuccess:  () => queryClient.invalidateQueries({queryKey: ['sets']})
  })



  

  function handleEdit() {
    if(!isEditingComment) {
      setIsEditingComment(true)
    } else {
      setIsEditingComment(false)
      const newCommentSetObject = {
        ...set,
        comment: textAreaComment
      }
      mutationEditComment.mutate(newCommentSetObject)
    }
  }

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setTextAreaComment(e.target.value)
  }

  function handleDelete(set: Set) {
    setIsEditingComment(false)
    mutationdeleteComment.mutate(set.setId)
  }

  function handleCommentSubmission(set: Set) {

  }

  return (
    <AlertDialog>
      <AlertDialogTrigger onClick={() => setTextAreaComment(set.comment || '')}>
          <MessageSquare className={twMerge(set.comment && 'text-primary')}/>
      </AlertDialogTrigger>
      <AlertDialogContent>{
          set.comment
          ? (
              <>
                  <h3 className='text-2xl font-semibold mb-2'>Edit Comment</h3>
                  <Textarea className='resize-none' disabled={!isEditingComment} value={textAreaComment} onChange={e => handleChange(e)}/>
                  <div className='flex space-x-2 justify-center items-center'>
                    <Button  asChild className='' size={'lg'} onClick={handleEdit}>
                      {isEditingComment
                      ? <AlertDialogCancel>Update</AlertDialogCancel>
                      : <span className='cursor-pointer'>Edit</span>
                      }
                    </Button>
                    <Button asChild className='' size={'lg'}>
                      {isEditingComment
                      ? <AlertDialogAction onClick={() => handleDelete(set)} className='cursor-pointer'>Delete</AlertDialogAction> 
                      : <AlertDialogCancel>Done</AlertDialogCancel>}
                    </Button>
                    {isEditingComment && (
                      <Button asChild className='' onClick={() => setIsEditingComment(false)} size={'lg'}>
                        <AlertDialogCancel>
                          Cancel
                        </AlertDialogCancel>
                      </Button>
                    )}
                  </div>
              </>
          )
          : (
              <>
                  <h3 className='text-2xl font-semibold mb-2'>Save Comment</h3>
                  <Textarea placeholder='Type your comment here...' onChange={e => handleChange(e)}/>
                  <div className='flex space-x-2 items-center justify-center'>
                    <Button asChild className='' size={'lg'}>
                      <AlertDialogAction onClick={() => handleCommentSubmission(set)}>Save</AlertDialogAction>
                    </Button>
                    <Button asChild className='' size={'lg'}>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                    </Button>
                  </div>
              </> 
          )
          
          }
      </AlertDialogContent>
    </AlertDialog>
  )
}
