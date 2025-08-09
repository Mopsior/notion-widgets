'use client'

import { fetchAPIKeys } from "@/actions/settings/fetch-api-keys"
import { APIKeyCard, APIKeyCardProps } from "@/components/api-key-card"
import { Loading } from "@/components/loading-spinner"
import { MotionButton } from "@/components/motion-components"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { UserLock } from "lucide-react"
import Link from "next/link"

const fetchData = async () => {
    return await fetchAPIKeys()
}

export const KeysRender = () => {
    const { data, error, isLoading, isRefetching } = useQuery({
        queryKey: ['api-keys'],
        queryFn: () => fetchData(),
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    })

    if (error) throw error

    if (isLoading) {
        return (
            <div className="flex items-center justify-center mt-[25dvh] w-full">
                <Loading animate={false} />
            </div>
        )
    }

    if (!data || !data.keys || data.keys.length === 0) {
        return (
            <div className="text-center mt-60 w-full px-8 relative">
                <UserLock size={192} className="text-muted-foreground fadeout-from-top-to-bottom absolute -top-48 left-1/2 transform -translate-x-1/2" />
                <p className="text-xl">Create first API key</p>
                <p className="text-muted-foreground max-w-[50ch] mx-auto mt-1">API keys are used in widgets URL&apos;s to authenicate. Everyone of them allows to access your whole account and should keep it secret.</p>
                <Link href="/app/settings/api-keys/create">
                    <MotionButton
                        className="mt-4 px-8"
                        whileTap={{ scale: 0.95 }}
                    >
                        Create API key
                    </MotionButton>
                </Link>
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col items-center md:justify-start md:flex-row flex-wrap w-full gap-4 md:px-15", {
            '*:animatie-pulse *:opacity-80': isRefetching
        })}>
            {data.keys.map((el: APIKeyCardProps) => (
                <APIKeyCard
                    key={el.id}
                    id={el.id}
                    start={el.start}
                    createdAt={el.createdAt}
                    lastRequest={el.lastRequest}
                />
            ))}
        </div>
    )
}