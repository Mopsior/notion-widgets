'use client'

import { MotionLoaderCircle } from "./motion-components"

export const Loading = () => {
    return (
        <MotionLoaderCircle
            className="animate-spin"
            initial={{ x: 15, opacity: 50 }}
            animate={{ x: 0, opacity: 100 }}
        />
    )
}