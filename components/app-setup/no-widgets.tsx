import { Plus } from "lucide-react"
import { MotionButton, MotionImage } from "../motion-components"
import Link from "next/link"

export const NoWidgetScreen = () => {
    return (
        <div className="w-full h-screen flex items-center justify-center flex-col font-sans gap-y-6">
            <div className="space-y-2 px-4">
                <h1 className="text-foreground md:text-5xl text-3xl font-bold font-sans text-center">Ready to start?</h1>
                <p className="text-muted-foreground text-center md:text-xl text-sm font-normal ">Add new widget and instantly paste into Notion</p>
            </div>
            <Link href="/app/new">
                <AddWidgetButton />
            </Link>
            <MotionImage
                src="/workout-widget.svg"
                alt="Workout widget preview" 
                width={273}
                height={205}
                className="absolute top-30 md:right-30 rotate-3 opacity-60 md:scale-100 scale-75"
                whileHover={{ opacity: 1, scale: 1.05}}
                whileTap={{ scale: 0.95 }}
            />
        </div>
    )
}

const AddWidgetButton = (props: React.ComponentPropsWithoutRef<typeof MotionButton>) => {
    'use client'
    return (
        <MotionButton
            size={'notion'}
            whileTap={{ scale: 0.95 }}
            {...props}
        >
            <Plus size={32} />
            Add new widget
        </MotionButton>
    )
}