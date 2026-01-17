import { TbLoaderQuarter } from "react-icons/tb";

export default function Loading() {
    return (
        <div
            className="flex items-center justify-center h-full"
        >
            <TbLoaderQuarter className="animate-spin" />
        </div>
    );
}