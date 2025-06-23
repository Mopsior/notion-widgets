import { Separator } from "@radix-ui/react-separator"
import Link from "next/link"
import { MotionImage } from "../motion-components"

export const TemplateCard = ({ name, description, icon, code, index }: { name: string, description: string, icon: string, code: string, index: number }) => {
    return (
        <Link href={`/app/new/${code}`}>
            <div className={`md:w-[400px] w-full h-fit border rounded-notion shadow-notion hover:bg-muted/30 animate-slide-up transition-transform`} style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="p-4 h-40">
                    <div className="w-full h-full relative">
                        <MotionImage
                            src={icon}
                            alt={`${name} widget preview`}
                            fill={true}
                            layoutId={`${code}-image`}
                            className="h-full"
                        />
                    </div>
                </div>
                <Separator className="h-[1px] w-full bg-border" />
                <div className="p-6 py-4">
                    <h3 className="text-lg font-normal">{name}</h3>
                    <p className="text-muted-foreground text-sm">{description}</p>
                </div>
            </div>
        </Link>
    )
}