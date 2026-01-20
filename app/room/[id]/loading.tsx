import { TbLoaderQuarter } from "react-icons/tb";

export default function Loading() {
    return (
        <div
            className="h-full flex items-center justify-center"
        >
            <TbLoaderQuarter className="animate-spin" />
        </div>
    );
}