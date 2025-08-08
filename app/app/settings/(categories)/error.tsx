'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function ErrorPage({
    error,
    reset
}: {
    error: Error & { digest?: string }
  reset: () => void
}) {
    return (
        <div className="flex flex-col items-center justify-center h-full px-5 text-center gap-y-8">
            <div>
                <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
                <p className="text-lg text-gray-600">Please try again later.</p>
            </div>
            <Card className="gap-y-2 py-4 mx-auto md:max-w-3/5 max-w-full text-left">
                { error.name && (<>
                    <CardHeader className="!pb-0">
                        <CardTitle className="text-xl">{error.name}</CardTitle>
                    </CardHeader>
                    <Separator />
                </>)}
                <CardContent className="mt-2 overflow-x-auto">
                    <code>
                        <pre>{error.message}</pre>
                    </code>
                </CardContent>
            </Card>
            <Button
                variant={'default'}
                className="font-normal px-16 py-5"
                onClick={() => reset()}
            >Try again</Button>
        </div>
    )
}