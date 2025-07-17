import { Label } from "@/components/ui/label"
import { RadioGroupItem } from "@/components/ui/radio-group"

export const RadioLabel = ({ label, icon, value }: { label: string, icon: string, value: string}) => (
    <Label className="has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950 border border-input w-fit rounded-lg px-2 py-1 gap-0 transition-colors hover:bg-accent/50 cursor-pointer text-sm">
        <span className="border border-input px-1.5 leading-4 mr-1 rounded-full text-[10px]">{icon}</span>
        <p>{label}</p>
        <RadioGroupItem value={value} />
    </Label>
) 