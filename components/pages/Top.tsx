"use client";

import Button from "@/components/atoms/Button";
import Link from "next/link";

export default function HomePage() {
    return (
        <div>
            <h1>Home Page</h1>
            <Button>
                ルームを作成
            </Button>

            <Button>
                入室
            </Button>

            <Link href="/drawing">
                <Button>
                    Click Me
                </Button>
            </Link>
        </div>
    );
}