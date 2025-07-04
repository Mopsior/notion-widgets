'use client'

import { EmojiPicker } from "@/components/emoji-picker"
import { Loading } from "@/components/loading-spinner"
import { MotionButton } from "@/components/motion-components"
import { NumberInput } from "@/components/number-input"
import { Accordion, AccordionContent, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { AccordionItem } from "@radix-ui/react-accordion"
import { useState } from "react"
import { useForm } from "react-hook-form"
import React from "react"
import type { UseFormReturn } from "react-hook-form"

import { z } from "zod"

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    icon: z.string().optional(),
    goal: z.number().min(1, "Goal must be a positive number"),
})

const defaultName = 'My Goal'

export const GoalCounterForm = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: defaultName,
            icon: undefined,
            goal: 30,
        }
    })

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log(data)
    }

    const nameValue = form.watch('name') || defaultName;
    return (
        <div className="w-full px-5 absolute bottom-5 md:w-2/3 lg:w-1/3 left-1/2 -translate-x-1/2">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="form">
                            <AccordionTrigger className="border-input border border-b-0 rounded-b-none px-4 bg-secondary cursor-pointer">
                                Customize
                            </AccordionTrigger>
                            <AccordionContent className="pb-0">
                                <Card className="p-0 border rounded-none">
                                    <CardContent className="p-0">
                                        <InputField
                                            name="name"
                                            label="Choose a name"
                                            form={form}
                                        >
                                            <Input placeholder="Enter goal name" />
                                        </InputField>
                                        <Separator className="w-full" />
                                        <InputField
                                            name="icon"
                                            label="Choose an icon"
                                            className="flex w-full space-y-0 gap-x-4"
                                            form={form}
                                        >
                                            {({ value, onChange }) => (
                                                <EmojiPicker
                                                    value={value}
                                                    onChange={onChange}
                                                    alternativeEmojiText={nameValue}
                                                />
                                            )}
                                        </InputField>
                                        <Separator className="w-full" />
                                        <InputField
                                            name="goal"
                                            label="Set your goal"
                                            form={form}
                                        >
                                            {({ value, onChange }) => (
                                                <NumberInput
                                                    placeholder="0"
                                                    value={value}
                                                    onChange={onChange}
                                                    min={0}
                                                />
                                            )}
                                        </InputField>
                                    </CardContent>
                                </Card>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <MotionButton
                        variant={'notion'}
                        size={'notion'}
                        disabled={isLoading}
                        type="submit"
                        className=" shadow-notion w-full rounded-t-none"
                    >
                        {isLoading && <Loading />}
                        Use Template
                    </MotionButton>
                </form>
            </Form>
        </div>
    )
}


const InputField = ({
    form,
    name,
    children,
    label,
    className
}: {
    form: UseFormReturn<z.infer<typeof formSchema>>,
    name: keyof z.infer<typeof formSchema>,
    children: React.ReactNode | ((field: any) => React.ReactNode),
    label?: string,
    className?: string
}) => (
    <div className="py-4 px-6">
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn(className)}>
                    {label && <FormLabel className="text-sm font-normal gap-0">{label}</FormLabel>}
                    <FormControl>
                        {typeof children === 'function'
                            ? children(field)
                            : React.cloneElement(children as React.ReactElement, { ...field })}
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    </div>
)