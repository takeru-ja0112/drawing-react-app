"use client";

import { TbLoaderQuarter } from "react-icons/tb";

export default function Loading({ className }: { className?: string }) {
    return (
        <div
            className="flex items-center justify-center h-full"
        >
            <TbLoaderQuarter className={`animate-spin ${className}`} />
        </div>
    );
}