import { Path, UseFormReturn } from "react-hook-form"
import z from "zod"
import { formSchema } from "./goal-counter"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { cloneElement } from "react"
import { cn } from "@/lib/utils"


interface InputFieldProps {
    form: UseFormReturn<z.infer<typeof formSchema>>
    name: Path<z.infer<typeof formSchema>>
    children: React.ReactNode | ((field: any) => React.ReactNode)
    label?: string
    className?: string,
    containerClassName?: string
}

export const InputField: React.FC<InputFieldProps> = ({
    form,
    name,
    children,
    label,
    className,
    containerClassName
}) => {
    return (
        <div className={cn("py-4 px-6", containerClassName)}>
            <FormField
                control={form.control}
                name={name}
                render={({ field }) => (
                    <FormItem className={className}>
                        {label && <FormLabel className="text-sm font-normal gap-0 text-muted-foreground">{label}</FormLabel>}
                        <FormControl>
                            {typeof children === 'function'
                                ? children(field)
                                : cloneElement(children as React.ReactElement, { ...field })}
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}