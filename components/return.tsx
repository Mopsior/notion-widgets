import { cn } from "@/lib/utils";
import { Undo2 } from "lucide-react";

export const Return = ({ onClick, variant = 'primary' }: { onClick?: () => void, variant?: "primary" | "secondary" }) => {
    return (
        <button
            className={cn("flex flex-row items-center gap-x-2 cursor-pointer ml-2 hover:bg-muted p-2 rounded-lg transition-colors w-fit", {
                'hover:bg-muted': variant === 'primary',
                'hover:bg-background hover:shadow': variant === 'secondary',
            })}
            onClick={onClick}
        >
            <Undo2 size={16} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Return</p>
        </button>
    )
}