'use client'

import { useState } from "react"
import { MotionButton } from "../motion-components"
import { Loading } from "../loading-spinner"
import { createWidget } from "@/actions/create-widget"
import { catchError } from "@/lib/catch-error"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export const UseTemplateButton = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter()

    const handleClick = async () => {
        setIsLoading(true)
        const [error, response] = await catchError(createWidget())
        if (error) {
            console.error(error)
            switch (error.name) {
                case 'auth/not-authenticated':
                    toast.error('Not authenticated', {
                        description: 'I don\'t know how did you get here, but please log in bro',
                        action: {
                            label: 'Log in',
                            onClick: () => router.push('/login')
                        }
                    })
                    break
                default:
                    toast.error('Error while creating widget')
                    break
            }
            return setIsLoading(false)
        }

        
    }

    return (
        <MotionButton
            variant={'notion'}
            size={'notion'}
            className="fixed w-3/5 bottom-5 left-1/2 -translate-x-1/2"
            onClick={handleClick}
            disabled={isLoading}
        >
            { isLoading && <Loading /> }
            Use Template
        </MotionButton>
    )
}