'use client'

import { getWidgetData } from "@/actions/goal-counter/fetch-data"
import { EmbedError } from "@/components/embed-error"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { WidgetGoalCounter } from "@/components/widgets/goal-counter/goal-counter"
import { Loading } from "@/components/loading-spinner"

const fetchData = async (widgetId: string, apiToken: string) => {
    return await getWidgetData(widgetId, apiToken)
}

export default function GoalCounterWidgetEmbed() {
    const { widgetId, apiToken } = useParams<{ widgetId: string, apiToken: string }>()

    const { data, error, isLoading, isRefetching } = useQuery({
        queryKey: ['goal-counter-widget'],
        queryFn: () => fetchData(widgetId, apiToken),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <Loading animate={false} />
            </div>
        )
    }

    if (error || !data) {
        console.log(error)
        return <EmbedError title={error?.name || "Error Fetching Widget Data"} description={error?.message || "An unexpected error occurred while fetching the widget data."} />
    }

    return (
        <div className="flex items-center justify-center h-screen w-full">
            <WidgetGoalCounter
                record={data.widgetRecord[0]}
                fields={data.fields}
                isRefetching={isRefetching}
            />
        </div>
    )
}