import { cn } from "@/lib/utils";
import { FlaskConical } from "lucide-react";

export const Branding = ({ theme = 'primary', slashColor = 'muted', className }: { theme?: 'primary' | 'muted', slashColor?: 'muted' | 'foreground', className?: string } ) => (
    <div className={cn("gap-3 flex items-center", className)}>
        <FlaskConical
            size={16}
            className={cn({
                'text-foreground': theme === 'primary',
                'text-muted-foreground': theme === 'muted',
            })}
        />
        <p className={cn("text-sm font-medium relative before:absolute before:content-[''] before:w-[2px] before:h-5 before:-left-2 before:top-0 before:rotate-12 before:rounded", {
            'before:bg-muted': slashColor === 'muted',
            'before:bg-foreground before:w-[1px] before:-left-1.5': slashColor === 'foreground',
            'text-muted-foreground': theme === 'muted'
        })}>widget.science</p>
    </div>
)