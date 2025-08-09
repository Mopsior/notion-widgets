'use client'

import { EmojiPicker } from "@/components/emoji-picker"
import { Loading } from "@/components/loading-spinner"
import { MotionButton } from "@/components/motion-components"
import { Accordion, AccordionContent, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { AccordionItem } from "@radix-ui/react-accordion"
import { useState } from "react"
import { FieldErrors, useForm } from "react-hook-form"
import React from "react"

import { z } from "zod"
import { useRouter } from "next/navigation"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { toast } from "sonner"
import { InputField } from "./input-field"
import { FieldsArray } from "./fields-array"
import { RadioGroup } from "@/components/ui/radio-group"
import { RadioLabel } from "./radio-label"
import { catchError } from "@/lib/catch-error"
import { createWidget } from "@/actions/goal-counter/create-widget"

export const formSchema = z.object({
    title: z.string().min(1, "Title is required").max(20, "Title must be less than 20 characters"),
    icon: z.string().optional(),
    timeOfLife: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
    fields: z.array(z.object({
        name: z.string().max(30, "Field name must be less than 30 characters").optional(),
        goal: z.number({ message: 'Goal is required' }).min(1, "Goal must be a positive number").max(32000, "Goal is too big"),
    })).max(4, "You can add up to 4 fields only").min(1, "You need at least one field to create a widget")
})

const defaultName = 'My Goal'

export const GoalCounterForm = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: defaultName,
            icon: undefined,
            timeOfLife: 'monday',
            fields: [
                {
                    name: 'Push-ups',
                    goal: 15
                }
            ]
        }
    })

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        console.log(data)
        const [error, response] = await catchError(createWidget(data))
        if (error) {
            handleError(error, router)
            setIsLoading(false)
            return
        }

        router.push(`/app/new/generate-url?widgetType=goal-counter&widgetID=${response.data.id}`)
    }

    const handleInvalid = (errors: FieldErrors<z.infer<typeof formSchema>>) => {
        // Find the first error message in the errors object (flat search)
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        const findFirstMessage = (obj: any): string | null => {
            if (!obj) return null
            if (typeof obj.message === 'string') return obj.message
            for (const value of Object.values(obj)) {
                if (value && typeof value === 'object') {
                    const msg = findFirstMessage(value)
                    if (msg) return msg
                }
            }
            return null
        }
        const msg = findFirstMessage(errors)
        if (msg) toast.error(msg)
    }

    const titleValue = form.watch('title') || defaultName
    return (
        <div className="w-full fixed bottom-5 md:w-2/3 lg:w-1/3 left-1/2 -translate-x-1/2">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit, handleInvalid)}>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="form">
                            <AccordionTrigger className="border-input border border-b-0 rounded-b-none px-4 bg-secondary cursor-pointer">
                                Customize
                            </AccordionTrigger>
                            <AccordionContent className="pb-0">
                                <Card className="p-0 border rounded-none">
                                    <CardContent className="p-0">
                                        <InputField
                                            name="title"
                                            label="Choose a name"
                                            form={form}
                                        >
                                            <Input placeholder="Enter goal name" />
                                        </InputField>
                                        <Separator className="w-full" orientation="horizontal" />
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
                                                    alternativeEmojiText={titleValue}
                                                />
                                            )}
                                        </InputField>
                                        <Separator className="w-full" orientation="horizontal" />
                                        <InputField
                                            name="timeOfLife"
                                            label="Repeats every week on..."
                                            form={form}
                                        >
                                            <RadioGroup
                                                value={form.watch("timeOfLife")}
                                                onValueChange={(value) => form.setValue("timeOfLife", value as typeof formSchema.shape.timeOfLife._type)}
                                                className="flex justify-center flex-wrap mt-1"
                                            >
                                                <RadioLabel value="monday" icon="1" label="Monday" />
                                                <RadioLabel value="tuesday" icon="2" label="Tuesday" />
                                                <RadioLabel value="wednesday" icon="3" label="Wednesday" />
                                                <RadioLabel value="thursday" icon="4" label="Thursday" />
                                                <RadioLabel value="friday" icon="5" label="Friday" />
                                                <RadioLabel value="saturday" icon="6" label="Saturday" />
                                                <RadioLabel value="sunday" icon="7" label="Sunday" />
                                            </RadioGroup>
                                        </InputField>
                                        <Separator className="w-full" orientation="horizontal" />
                                        <FieldsArray form={form} />
                                    </CardContent>
                                </Card>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <MotionButton
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

const handleError = (error: Error, router: AppRouterInstance) => {
    console.error(error)
    switch (error.name) {
        case 'auth/not-authenticated':
            toast.error('Not authenticated', {
                description: 'I don\'t know how did you get here, but please log in bro',
                action: {
                    label: 'Log in',
                    onClick: () => router.push('/login')
                }
            })
            break
        case 'create-widget/template-dont-exists':
            toast.error('Template does not exist', {
                description: 'The requested template could not be found.'
            })
            break
        case 'create-widget/type-not-supported':
            toast.error('Widget type not supported', {
                description: 'The requested widget type is not supported.'
            })
            break
        case 'create-widget/validation-error':
            toast.error('Validation error', {
                description: 'Please check the form fields and try again.'
            })
            break
        case 'create-widget/error-db':
            toast.error('Database error', {
                description: 'There was an error while creating the widget in the database.'
            })
            break
        default:
            toast.error('Error while creating widget', {
                description: error.name
            })
            break
    }
}