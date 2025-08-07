'use client'

import { LoaderCircle } from "lucide-react"
import { MotionLoaderCircle } from "./motion-components"

export const Loading = ({ 
    animate = true,
    direction = 'right',
    size,
}: {
    animate?: boolean,
    direction?: 'right' | 'bottom',
    size?: number
}) => {
    if (!animate) {
        return (
            <LoaderCircle className="animate-spin size-16 text-muted-foreground" />
        )
    }

    return (
        <MotionLoaderCircle
            size={size && size}
            initial={{
                x: direction === 'right' ? 15 : 0,
                y: direction === 'bottom' ? 15 : 0,
                opacity: 70,
            }}
            animate={{
                x: 0,
                y: 0,
                opacity: 100,
                rotate: [0, 360],
            }}
            transition={{
                 rotate: {
                    repeat: Infinity,
                    duration: 1,
                    ease: 'linear'
                },
            }}
        />
    )
}