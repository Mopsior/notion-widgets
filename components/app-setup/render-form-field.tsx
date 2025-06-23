import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { WidgetElement } from "@/config/available-widgets"
import { Control } from "react-hook-form"
import { Switch } from "../ui/switch"
import { cn } from "@/lib/utils"
import { NumberInput } from "../number-input"

export function RenderFormField({ field, name, control }: { field: WidgetElement["form"][number], name: string, control: Control }) {
    return (
        <FormField
            name={name}
            control={control}
            defaultValue={field.defaultValue}
            render={({ field: controllerField }) => {
                const value = controllerField.value !== undefined && controllerField.value !== null
                    ? controllerField.value
                    : field.defaultValue;
                return (
                    <FormItem className={cn({
                        'flex justify-between': field.type === 'checkbox',
                    })}>
                        <FormLabel className="font-sans text-lg font-normal">{field.label} {field.optional && <span className="text-muted-foreground/70">(optional)</span>}</FormLabel>
                        <FormControl>
                            {field.type === 'checkbox' ? (
                                <Switch
                                    checked={!!value}
                                    onCheckedChange={controllerField.onChange}
                                    className="w-10 h-[1.5rem]"
                                />
                            ) : field.type === 'number' ? (
                                <NumberInput
                                    placeholder={field.placeholder}
                                    value={value ?? ''}
                                    onChange={controllerField.onChange}
                                    min={0}
                                />
                            ) : (
                                <Input
                                    type={'text'}
                                    placeholder={field.placeholder}
                                    value={value ?? ''}
                                    onChange={controllerField.onChange}
                                    maxLength={field.max}
                                />
                            )}
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )
            }}
        />
    )
}
