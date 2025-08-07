'use client'

import { Plus } from "lucide-react"
import { FieldsGoalCounterType } from "./goal-counter"
import { incrementField } from "@/actions/goal-counter/increment-field"
import { catchError } from "@/lib/catch-error"
import { toast } from "sonner"
import { useState } from "react"
import { Loading } from "@/components/loading-spinner"
import { useParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"

export const AddButton = ({
    field,
    isRefetching
}: {
    field: FieldsGoalCounterType,
    isRefetching: boolean
}) => {
    const { apiToken } = useParams<{ widgetId: string, apiToken: string }>()
    const [isLoading, setIsLoading] = useState(false)

    const queryClient = useQueryClient()

    const handleClick = async () => {
        setIsLoading(true)
        const [error] = await catchError(incrementField({ fieldId: field.id, apiToken }))
        if (error) {
            console.error(error)
            toast.error('Failed to increment field value', {
                description: error.message || 'An unexpected error occurred while incrementing the field value.'
            })
            setIsLoading(false)
        }

        queryClient.invalidateQueries({ queryKey: ['goal-counter-widget'] })
        setIsLoading(false)
    }

    return (
        <button
            className="border border-border size-5 touch-hitbox flex items-center justify-center rounded cursor-pointer disabled:text-muted-foreground disabled:cursor-auto overflow-hidden"
            disabled={!field.goal || field.value >= field.goal || isLoading || isRefetching}
            onClick={handleClick}
        >
            {isLoading
                ? <Loading size={12} direction="bottom" />
                : <Plus size={16} />
            }
        </button>
    )
}