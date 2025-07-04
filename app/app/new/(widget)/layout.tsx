import { Return } from "@/components/return";
import Link from "next/link";

export default async function NewWidgetPageLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="md:px-10 px-5 pt-5 pb-15 w-full">
            <div>
                <Link href="/app/new">
                    <Return />
                </Link>
            </div>
            {children}
        </div>
    )    
}