import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { WidgetElement } from "@/config/available-widgets"
import { Control } from "react-hook-form"
import { Switch } from "../ui/switch"
import { cn } from "@/lib/utils"
import { NumberInput } from "../number-input"
import { Label } from "../ui/label"
import { Checkbox } from "../ui/checkbox"

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
                        {field.type !== 'checkbox' && (
                            <div>
                                <FormLabel className="font-sans text-lg font-normal">{field.label} {field.optional && <span className="text-muted-foreground/70">(optional)</span>}</FormLabel>
                                {field.description && <FormLabel className="text-sm text-muted-foreground">{field.description}</FormLabel>}
                            </div>
                        )}
                        <FormControl>
                            {field.type === 'checkbox' ? (
                                // <Switch
                                //     checked={!!value}
                                //     onCheckedChange={controllerField.onChange}
                                //     className="w-10 h-[1.5rem]"
                                // />
                                <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950 cursor-pointer">
                                    <Checkbox
                                        id={field.codeName}
                                        checked={!!value}
                                        onCheckedChange={controllerField.onChange}
                                        className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                                    />
                                    <div className="grid gap-1.5 font-normal">
                                        <p className="text-sm leading-none font-medium">
                                            {field.label}
                                        </p>
                                        { field.description && <p className="text-muted-foreground text-sm">
                                            You can enable or disable notifications at any time.
                                        </p> }
                                    </div>
                                </Label>
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
