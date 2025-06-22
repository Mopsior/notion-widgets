'use client'
import { Github } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loading } from "./loading-spinner"
import { MotionButton } from "./motion-components"

export const Login = () => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleClick = async () => {
        await authClient.signIn.social({
            provider: 'github',
            callbackURL: '/app',
            // newUserCallbackURL: `${window.location.origin}/app/onboarding`,
        }, {
            onRequest: () => setIsLoading(true),
            onSuccess: () => {router.push('/app')},
            onError: (error) => {
                console.error('Login error:', error)
                toast.error('Failed to log in. Please try again.', {
                    description: error.error.message || 'An unexpected error occurred.',
                });
                setIsLoading(false)
            }
        })
    }

    return (<>
        <MotionButton className="w-full" type="submit" onClick={handleClick} disabled={isLoading}>
            { isLoading ? <Loading /> :  <Github size={48} /> }
            Log in with Github
        </MotionButton>
    </>)
}
