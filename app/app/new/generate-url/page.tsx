'use client'

import { createAPIKey } from "@/actions/settings/create-api-key"
import { APIKeyCard } from "@/components/api-key-card"
import { MotionButton } from "@/components/motion-components"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { catchError } from "@/lib/catch-error"
import { cn } from "@/lib/utils"
import { AlertCircleIcon, Copy, Plus } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function GenerateURLPage() {
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [generationError, setGenerationError] = useState<{ message: string, code: string } | null>(null)
    const [generatedKey, setGeneratedKey] = useState<{ key: string, id: string } | null>(null)
    const [finalURL, setFinalURL] = useState<string | null>(process.env.NEXT_PUBLIC_DOMAIN || null)
    const widgetType = searchParams.get("widgetType")
    const widgetID = searchParams.get("widgetID")
    if (!widgetType) throw new Error("Widget type is required")
    if (!widgetID) throw new Error("Widget ID is required")

    const handleCreation = async () => {
        setIsLoading(true)
        setGenerationError(null)
        const [creationError, generatedKey] = await catchError(createAPIKey())
        if (creationError) {
            console.error('Server-side error', creationError)
            setGenerationError({ message: creationError.message, code: creationError.name })
            return
        }
        setFinalURL(`${process.env.NEXT_PUBLIC_DOMAIN}/embed/${widgetType}/${widgetID}/${generatedKey.key}`)
        setGeneratedKey({ key: generatedKey.key, id: generatedKey.id })
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
                        ? (
                            <button
                                disabled={isLoading}
                                className={cn("size-24 rounded border-2 border-dashed flex items-center justify-center cursor-pointer", {
                                    'cursor-not-allowed animate-pulse': isLoading
                                })}
                                onClick={handleCreation}
                            ><Plus className="text-muted-foreground" size={36} /></button>
                        ) : (
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

