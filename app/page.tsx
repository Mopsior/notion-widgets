'use client'

import { addData } from "@/actions/add-data";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
    return (
        <Link href={"/login"}>
            Log in
        </Link>
    );
}
