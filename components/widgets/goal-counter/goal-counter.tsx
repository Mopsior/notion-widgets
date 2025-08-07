import { counter, counter_fields } from "@/db/schema"
import { isSingleEmoji } from "@/utils/is-single-emoji"
import { InferSelectModel } from "drizzle-orm"
import * as Progress from "@radix-ui/react-progress"
import { AddButton } from "./add-button"
import { cn } from "@/lib/utils"

export type GoalCounterType = InferSelectModel<typeof counter>
export type FieldsGoalCounterType = InferSelectModel<typeof counter_fields>

export const WidgetGoalCounter = ({
    record,
    fields,
    isRefetching
}: {
    record: GoalCounterType,
    fields: FieldsGoalCounterType[],
    isRefetching: boolean
}) => {
    return (
        <div className="bg-background rounded-notion border border-notion-border p-4 shadow-notion space-y-2">
            <p className="font-semibold text-lg flex gap-2">
                {isSingleEmoji(record.icon)
                ? <span>{record.icon}</span>
                : <span className="bg-muted rounded-full text-[12px] leading-1 size-7 items-center justify-center flex mt-[1px]">{record.icon}</span>
                }
                {record.title}
            </p>
            <div className="flex flex-col gap-2">
                {fields.map((field) => (
                    <div key={field.id}>
                        <p className="text-muted-foreground text-sm">{field.name}</p>
                        <div className="flex gap-2 mt-1">
                            <Progress.Root
                                max={field.goal}
                                value={field.value}
                                className={cn("w-[250px] bg-muted h-5 my-auto rounded relative overflow-hidden transform translate-z-0", {
                                    'opacity-80 animate-pulse': isRefetching
                                })}
                            >
                                <p className="absolute top-0 right-1 text-[12px] h-5 flex justify-center items-center text-muted-foreground">{field.goal}</p>
                                <Progress.Indicator
                                    className="text-[12px] bg-primary size-full transition-transform rounded z-20"
                                    style={{
                                        transform: field.value === 0
                                            ? 'translateX(-101%)'
                                            : `translateX(-${100 - (field.value / field.goal) * 100}%)`
                                    }}
                                ><p className="mr-1 text-background flex justify-end items-center h-full">{field.value}</p></Progress.Indicator>
                            </Progress.Root>
                            <AddButton
                                field={field}
                                isRefetching={isRefetching}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}