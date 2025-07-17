import Link from "next/link";
import { ReactElement } from "react";

export const Navigationitem = ({ href, children, icon }: { href: string; children: string; icon: ReactElement }) => {
    return (
        <Link href={href}>
            <div className="w-full grid grid-cols-[16px_auto] gap-x-2 px-4 py-2 hover:bg-background hover:rounded-lg transition-all hover:shadow">
                <div className="flex items-center justify-center">
                    {icon}
                </div>
                <p>{children}</p>
            </div>
        </Link>
    )
}