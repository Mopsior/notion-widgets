'use client'

import { createAPIKey } from "@/actions/settings/create-api-key"
import { verifyAPIKey } from "@/actions/settings/verify-api-key"
import { APIKeyCard } from "@/components/api-key-card"
import { MotionButton } from "@/components/motion-components"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { catchError } from "@/lib/catch-error"
import { cn } from "@/lib/utils"
import { AlertCircleIcon, Copy, Plus, Search } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

const regex = /https:\/\/[^\/]+\/embed\/[^\/]+\/[^\/]+\/([a-zA-Z0-9]+)/

export default function GenerateURLPage() {
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [generationError, setGenerationError] = useState<{ message: string, code: string } | null>(null)
    const [generatedKey, setGeneratedKey] = useState<{ key: string, id: string, date: Date } | null>(null)
    const [finalURL, setFinalURL] = useState<string | null>(process.env.NEXT_PUBLIC_DOMAIN || null)
    const [validationError, setValidationError] = useState<{ message: string, code: string } | null>(null)
    const widgetType = searchParams.get("widgetType")
    const widgetID = searchParams.get("widgetID")
    if (!widgetType) throw new Error("Widget type is required")
    if (!widgetID) throw new Error("Widget ID is required")

    const generateURL = (generatedKey: string) => {
        setFinalURL(`${process.env.NEXT_PUBLIC_DOMAIN}/embed/${widgetType}/${widgetID}/${generatedKey}`)
    }

    const handleCreation = async () => {
        setIsLoading(true)
        setGenerationError(null)
        const [creationError, generatedKey] = await catchError(createAPIKey())
        if (creationError) {
            console.error('Server-side error', creationError)
            setGenerationError({ message: creationError.message, code: creationError.name })
            return
        }
        setGeneratedKey({ key: generatedKey.key, id: generatedKey.id, date: new Date() })
        generateURL(generatedKey.key)
        setIsLoading(false)
    }

    const handleCopy = async () => {
        if (finalURL) {
            const [copyError] = await catchError(navigator.clipboard.writeText(finalURL))
            if (copyError) {
                console.error('Can\'t copy to clipboard. URL:', finalURL)
                toast.error('Failed to copy URL to clipboard', {
                    description: 'Please try again.'
                })
                return
            }
            toast.success('URL copied to clipboard!')
        }
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setValidationError(null)
        setGeneratedKey(null)

        const formData = new FormData(e.target as HTMLFormElement)
        const inputValue = formData.get('key') as string
        console.log(inputValue)
        if (!inputValue || inputValue.trim().length === 0) {
            setValidationError({ message: 'Invalid API key', code: 'auth/invalid-api-key' })
            setIsLoading(false)
            return
        }

        const match = inputValue.match(regex)
        const extractedKey = match ? match[1] : null
        if (!extractedKey) {
            setValidationError({ message: 'Invalid widget URL', code: 'auth/invalid-widget-url' })
            setIsLoading(false)
            return
        }

        const [apiValidationError, apiValidiationResponse] = await catchError(verifyAPIKey(extractedKey))
        if (apiValidationError) {
            console.error('Server-side error', apiValidationError)
            setValidationError({ message: apiValidationError.message, code: apiValidationError.name })
            setIsLoading(false)
            return
        }
        if (!apiValidiationResponse.key) {
            setValidationError({ message: 'Invalid API key', code: 'auth/invalid-api-key' })
            setIsLoading(false)
            return
        }

        setGeneratedKey({
            key: extractedKey.slice(0, 5),
            id: apiValidiationResponse.key.id,
            date: apiValidiationResponse.key.createdAt
        })
        generateURL(extractedKey)
        setIsLoading(false)
    }

    return (
        <div className="flex flex-col justify-center mx-auto mt-18 w-fit px-8 pb-8 overflow-y-clip">
            <h1 className="text-center text-2xl font-semibold">Generate widget URL</h1>
            <p className="text-center text-base text-muted-foreground">Generate URL to use widget in Notion</p>
            <div className="mt-10 space-y-8 w-80">
                <div className="relative space-y-4">
                    <div className="text-primary md:absolute md:top-0 md:-left-14 text-lg border-2 border-primary size-8 text-center leading-7 rounded-full bg-blue-300/10">1</div>
                    <div>
                        <h3 className="text-xl mt-2 md:mt-0">Create API key</h3>
                        <p className="text-muted-foreground">Create an API key to use for this widget</p>
                    </div>
                    {!generatedKey
                        ? (<div className="space-y-2">
                            <button
                                disabled={isLoading}
                                className={cn("size-24 rounded border-2 border-dashed flex items-center justify-center cursor-pointer", {
                                    'cursor-not-allowed animate-pulse': isLoading
                                })}
                                onClick={handleCreation}
                            ><Plus className="text-muted-foreground" size={36} /></button>
                            <p className="text-muted-foreground text-center">or</p>
                            <div>
                                <h3 className="text-xl mt-2 md:mt-0">Use existing API key</h3>
                                <p className="text-muted-foreground">Import key from other widget URL</p>
                            </div>
                            <form className="flex gap-2" onSubmit={handleSearch}>
                                <Input
                                    className="shadow-none"
                                    placeholder={`${process.env.NEXT_PUBLIC_DOMAIN}/embed/goal-counter/1234-5678-1234-5678/abcdefghijklmnoprstuwxyz...`}
                                    name="key"
                                    disabled={isLoading}
                                />
                                <MotionButton
                                    variant='outline'
                                    className="text-foreground shadow-none"
                                    type="submit"
                                    whileTap={{ scale: 0.95 }}
                                    disabled={isLoading}
                                ><Search /></MotionButton>
                            </form>
                            {validationError && <Alert variant={'destructive'} className={cn("mt-2", { hidden: !validationError })}>
                                <AlertCircleIcon />
                                <AlertTitle>Can&apos;t validate this key</AlertTitle>
                                <AlertDescription>
                                    <p>{validationError.message}</p>
                                </AlertDescription>
                            </Alert>}
                        </div>) : (
                            <APIKeyCard
                                createdAt={new Date()}
                                id={generatedKey.id}
                                start={generatedKey.key.substring(0, 5)}
                                lastRequest={new Date()}
                                disableMenu
                            />
                        )}

                    {generationError && (
                        <Alert variant={'destructive'}>
                            <AlertCircleIcon />
                            <AlertTitle>Unable to create API key</AlertTitle>
                            <AlertDescription>
                                <p>{generationError.message}</p>
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
                {generatedKey?.key && (<>
                    <motion.div
                        className="relative space-y-4"
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
                    >
                        <div className="text-primary md:absolute md:top-0 md:-left-14 text-lg border-2 border-primary size-8 text-center leading-7 rounded-full bg-blue-300/10">2</div>
                        <div>
                            <h3 className="text-xl mt-2 md:mt-0">Copy URL</h3>
                            <p className="text-muted-foreground">Copy generated URL</p>
                        </div>
                        <div className="flex gap-2">
                            <Input type="text" readOnly value={finalURL || ''} className="shadow-none" />
                            <MotionButton
                                variant='outline'
                                className="text-foreground shadow-none"
                                onClick={handleCopy}
                                whileTap={{ scale: 0.95 }}
                            ><Copy /></MotionButton>
                        </div>
                    </motion.div>
                    <motion.div
                        className="relative space-y-4"
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1], delay: 0.5, }}
                    >
                        <div className="text-primary md:absolute md:top-0 md:-left-14 text-lg border-2 border-primary size-8 text-center leading-7 rounded-full bg-blue-300/10">3</div>
                        <div>
                            <h3 className="text-xl mt-2 md:mt-0">Embed into Notion</h3>
                            <p className="text-muted-foreground">Paste into your favourite note-taking app. </p>
                            <p className="text-muted-foreground mt-1">In Notion you can use the <span className="font-sans bg-muted px-1 rounded">/embed</span> block to display the widget.</p>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1], delay: 1, }}
                        className="tall-ht:absolute tall-ht:bottom-10 w-80"
                    >
                        <Link href="/app">
                            <MotionButton
                                className="w-full"
                                whileTap={{ scale: 0.95 }}
                            >Everything&apos;s done!</MotionButton>
                        </Link>
                    </motion.div>
                </>)}
            </div>
        </div>
    )
}

