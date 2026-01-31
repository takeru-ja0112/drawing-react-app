import { supabase } from "@/lib/supabase";

export async function getArts() {
    const { data, error } =
        await supabase
            .from("history_drawings")
            .select("*")
            .order("created_at", {
                ascending: false,
            });

    if (error) {
        console.error(
            "Error fetching arts:",
            error,
        );
        return [];
    }

    return data;
}
