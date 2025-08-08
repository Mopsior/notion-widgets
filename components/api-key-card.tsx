'use client'

import { useQueryClient } from "@tanstack/react-query"
import { Ellipsis, KeyRound, Trash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { deleteAPIKey } from "@/actions/settings/delete-api-key"
import { useState } from "react"
import { catchError } from "@/lib/catch-error"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export interface APIKeyCardProps {
    id: string
    start: string | null
    createdAt: Date
    lastRequest: Date | null
}

export const APIKeyCard = ({
    id,
    start,
    createdAt,
    lastRequest
}: APIKeyCardProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const queryClient = useQueryClient()

    const handleDelete = async () => {
        setIsLoading(true)
        const [deleteError] = await catchError(deleteAPIKey(id))
        if (deleteError) {
            toast.error('Failed to delete API key', { description: deleteError.message })
            console.error(deleteError)
            setIsLoading(false)
            return
        }

        queryClient.invalidateQueries({ queryKey: ['api-keys'] })
        setIsLoading(false)
    }

    return (
        <div className={cn("p-4 gap-6 flex flex-row border rounded-xl w-fit hover:border-muted-foreground transition", {
            'opacity-70 animate-pulse': isLoading
        })}>
            <div className="flex items-center">
                <KeyRound className="text-muted-foreground size-12" />
            </div>
            <div>   
                <p className="font-semibold fadeout-text w-fit">{start}**********</p>
                <p className="text-sm text-muted-foreground">Allows to access every widget</p>
                <p className="text-sm text-muted-foreground">Created at {new Date(createdAt).toLocaleString()}</p>
            </div>
            <div className="flex items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger className="hover:bg-muted p-1 rounded cursor-pointer" disabled={isLoading}>
                        <Ellipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {lastRequest && <DropdownMenuLabel className="font-normal text-muted-foreground text-xs">Last used at: {new Date(lastRequest).toLocaleString()}</DropdownMenuLabel>}
                        <DropdownMenuItem
                            className="cursor-pointer"
                            variant="destructive"
                            disabled={isLoading}
                            onClick={handleDelete}
                        ><Trash />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}