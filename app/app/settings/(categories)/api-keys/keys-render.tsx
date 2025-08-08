'use client'

import { fetchAPIKeys } from "@/actions/settings/fetch-api-keys"
import { APIKeyCard, APIKeyCardProps } from "@/components/api-key-card"
import { Loading } from "@/components/loading-spinner"
import { useQuery } from "@tanstack/react-query"

const fetchData = async () => {
    return await fetchAPIKeys()
}

export const KeysRender = () => {
    const { data, error, isLoading } = useQuery({
        queryKey: ['api-keys'],
        queryFn: () => fetchData(),
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    })

    if (error) throw error

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-1/2 md:h-4/5 w-full">
                <Loading animate={false} />
            </div>
        )
    }

    if (!data) {
        return (
            <></>
        )
    }

    return (
        <div className="flex flex-col items-center md:justify-start md:flex-row flex-wrap w-full gap-4 md:px-15">
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