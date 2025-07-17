import { Input } from "@/components/ui/input"
import { InputField } from "./input-field"
import React from "react"
import { UseFormReturn, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { formSchema } from "./goal-counter"
import { PlusCircle, Settings2, X } from "lucide-react"
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { FormMessage } from "@/components/ui/form"
import { NumberInput } from "@/components/number-input"

interface FieldsArrayProps {
    form: UseFormReturn<z.infer<typeof formSchema>>
}

export const FieldsArray: React.FC<FieldsArrayProps> = ({ form }) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'fields',
    })

    return (
        <div className="py-4 px-6 w-full">
            <Drawer>
                <DrawerTrigger asChild>
                    <Button className="w-full bg-background shadow-none border border-blue-600 text-primary hover:bg-blue-50 hover">
                        <Settings2 />
                        Manage Fields
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="w-full md:w-2/3 lg:w-1/3 md:mx-auto">
                    <DrawerHeader className="pb-0">
                        <DrawerTitle>Manage Fields</DrawerTitle>
                        <DrawerDescription className="text-sm text-muted-foreground mb-4">Fields are counters used to track your progress. Add fields to your component. You need at least one to work properly</DrawerDescription>
                    </DrawerHeader>
                    <div className={cn("px-10 flex flex-col gap-6", {
                        'pb-4 pt-2': fields.length > 0
                    })}>
                        {fields.map((field, idx) => (
                            <Card key={field.id} className="py-4 relative">
                                <CardContent className="grid grid-cols-2 gap-4">
                                    <InputField
                                        name={`fields.${idx}.name`}
                                        label={`Field Title`}
                                        form={form}
                                        containerClassName="py-0 px-0"
                                    >
                                        <Input placeholder="Title" />
                                    </InputField>
                                    <InputField
                                        name={`fields.${idx}.goal`}
                                        label={`Goal`}
                                        form={form}
                                        containerClassName="py-0 px-0"
                                    >
                                        {({ value, onChange }) => (
                                            <NumberInput
                                                value={value}
                                                onChange={onChange}
                                                placeholder="Goal"
                                                min={1}
                                                max={32000}
                                                className="w-full"
                                                name={`fields.${idx}.goal`}
                                            />
                                        )}
                                    </InputField>
                                    <button
                                        type="button"
                                        className="text-background bg-destructive rounded-md absolute -top-2 -right-2 cursor-pointer p-2"
                                        onClick={() => remove(idx)}
                                        aria-label="Remove field"
                                    >
                                        <X size={14} />
                                    </button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <DrawerFooter className="px-10 pb-7 pt-0">
                        <Tooltip >
                            <TooltipTrigger asChild>
                                <span className="w-full flex">
                                    <button
                                        type="button"
                                        className={cn(
                                            "w-full bg-background shadow-none border border-blue-600 text-primary hover:bg-blue-50 hover rounded-notion flex h-12 items-center justify-center mt-2 transition-colors", {
                                            'bg-muted text-muted-foreground cursor-not-allowed border-muted-/30': fields.length >= 4,
                                            'text-primary cursor-pointer hover:bg-primary/10': fields.length < 4
                                        }
                                        )}
                                        onClick={() => append({ name: '', goal: 1 })}
                                        disabled={fields.length >= 4}
                                    >
                                        <PlusCircle size={16} className="mr-2" />
                                        Add Field
                                    </button>
                                </span>
                            </TooltipTrigger>
                            {fields.length >= 4 && (
                                <TooltipContent side="top" align="center">
                                    Maximum of 4 fields allowed
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    )
}
