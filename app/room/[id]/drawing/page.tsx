import DrawPage from "@/components/pages/DrawPage";
import { getTheme , getFurigana} from './action';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const res = await getTheme(id);
    const resFurigana = await getFurigana(id);
    const theme = res.success && res.data ? res.data : 'お題が設定されていません';
    const furigana = resFurigana.success && resFurigana.data ? resFurigana.data : '';
    return <DrawPage roomId={id} theme={theme} furigana={furigana} />;
}