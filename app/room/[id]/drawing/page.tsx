import DrawPage from "@/components/pages/DrawPage";
import { getTheme } from './action';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const res = await getTheme(id);
    const theme = res.success && res.data ? res.data : 'お題が設定されていません';
    return <DrawPage roomId={id} theme={theme} />;
}