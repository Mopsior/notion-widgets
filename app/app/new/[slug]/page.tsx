import { widgetsList } from "@/config/available-widgets"
import { notFound } from "next/navigation"
import { Return } from "@/components/return"
import Link from "next/link"
import { MotionImage } from "@/components/motion-components"
import { CreateTemplateForm } from "@/components/app-setup/create-template-form"

export default async function SpecificNewWidgetPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    
    const widget = widgetsList.find(widget => widget.code === slug)
    
    if (!widget) {
        notFound()
    }
    
    return (
        <div className="md:px-10 px-5 pt-5 pb-15 w-full">
            <div>
                <Link href="/app/new">
                    <Return />
                </Link>
            </div>
            <div className="flex flex-col items-center md:mt-20 mt-12 text-center md:pb-20 pb-12">
                <div className="h-72 relative w-full">
                    <MotionImage
                        src={widget.icon}
                        alt={`${widget.name} showcase`}
                        layoutId={`${slug}-image`}
                        fill
                    />
                </div>
                <h2 className="text-xl mt-10 tracking-tight">{widget.name}</h2>
                <p className="max-w-[80ch] text-muted-foreground">{widget.description}</p>
            </div>
            <CreateTemplateForm
                widget={widget}
            />
        </div>
    )
}