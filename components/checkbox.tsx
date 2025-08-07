'use client'

import { useState } from "react"
import { Label } from "./ui/label"
import { Checkbox as CheckboxPrimitive } from "./ui/checkbox"

/**
 * Example of a checkbox component
 */
export const Checkbox = () => {
    const [isChecked, setIsChecked] = useState(false)

    return (
        <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950 cursor-pointer">
            <CheckboxPrimitive
                checked={isChecked}
                onCheckedChange={(checked) => setIsChecked(!!checked)}
                className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
            />
            <div className="grid gap-1.5 font-normal">
                <p className="text-sm leading-none font-medium">
                    Enable Notifications
                </p>
                <p className="text-muted-foreground text-sm">
                    You can enable or disable notifications at any time.
                </p>
            </div>
        </Label>
    )
}