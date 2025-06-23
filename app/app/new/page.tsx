import { Return } from "@/components/return"
import { TemplateCard } from "@/components/app-setup/template-card"
import Link from "next/link" 
import { widgetsList } from "@/config/available-widgets"
import { cn } from "@/lib/utils"

export default function AppNewWidgetPage() {
    return (
        <div className="md:px-10 pt-5 pb-15">
            <Link href="/app">
                <Return />
            </Link>
            <div className="flex flex-col justify-center w-fit mx-auto">
                <h1 className="text-center text-2xl font-semibold">Add new widget</h1>
                <p className="text-center text-base text-muted-foreground">Select template for widget from list below</p>
                <div className={cn("mt-10 grid lg:grid-cols-2 grid-cols-1 gap-6", {
                    'flex justify-center': Object.keys(widgetsList).length <= 1
                })}>
                    {Object.entries(widgetsList).map(([key, element], index) => (
                        <TemplateCard
                            key={key}
                            index={index}
                            name={element.name}
                            description={element.description}
                            code={element.code}
                            icon={element.icon}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}