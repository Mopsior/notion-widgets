import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactElement } from "react";

export const Navigationitem = ({ href, children, icon, variant = 'primary', className }: { href: string; children: string; icon: ReactElement, variant?: 'primary' | 'ghost', className?: string }) => {
    return (
        <Link href={href}>
            <div className={cn("w-full grid grid-cols-[16px_auto] gap-x-2 py-2 hover:bg-background hover:rounded-lg transition-all", {
                'px-4 hover:bg-background hover:rounded-lg hover:shadow': variant === 'primary',
                'px-0': variant === 'ghost',
            }, className)}>
                <div className="flex items-center justify-center">
                    {icon}
                </div>
                <p>{children}</p>
            </div>
        </Link>
    )
}