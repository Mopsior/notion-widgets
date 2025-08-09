'use client'

import { createAPIKey } from "@/actions/settings/create-api-key"
import { Loading } from "@/components/loading-spinner"
import { MotionButton } from "@/components/motion-components"
import { Return } from "@/components/return"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { catchError } from "@/lib/catch-error"
import { useQueryClient } from "@tanstack/react-query"
import { AlertCircleIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CreateAPIKeyPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<{ message: string, code: string} | null>(null)
    const router = useRouter()
    const queryClient = useQueryClient()

    const handleCreate = async () => {
        if (isLoading) return
        setIsLoading(true)
        setError(null)
        const [error] = await catchError(createAPIKey())
        if (error) {
            console.log(error)
            setError({ message: error.message, code: error.name })
            setIsLoading(false)
            return
        }

        queryClient.invalidateQueries({ queryKey: ['api-keys'] })
        router.push(`/app/settings/api-keys/`)
    }

    return (
        <div className="px-5 md:px-15 w-full h-full">
            <div className="fixed">
                <Link href={'/app/settings/api-keys'}>
                    <Return variant="primary" />
                </Link>
            </div>
            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                <Card className="gap-4 w-96">
                    <CardHeader>
                        <CardTitle>Create API key</CardTitle>
                        <CardDescription>
                            Generate a new API key to access your widgets. 
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        These keys are used in widget URLs to authenticate requests and allows to access your whole account and all widgets. Keep them secret and secure.
                    </CardContent>
                    <CardFooter className="w-full">
                        <MotionButton
                            className="w-full flex gap-2"
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCreate}
                            disabled={isLoading}
                        >{isLoading && <Loading direction="right" />} Create API key</MotionButton>
                    </CardFooter>
                </Card>
                {error && (
                    <Alert className="w-96 shadow" variant={'destructive'}>
                        <AlertCircleIcon />
                        <AlertTitle>Unable to create API key</AlertTitle>
                        <AlertDescription>
                            <p>{error.message}</p>
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    )
}