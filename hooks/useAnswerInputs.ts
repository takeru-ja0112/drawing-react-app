import { supabase } from "@/lib/supabase"
import { useEffect , useState } from "react"

interface UseAnswerDataType {
    answerInputs: string | null;
    result: "" | "CORRECT" | "MISTAKE";
}

export default function useAnswerInputs(roomId: string) {
    const [ answerData , setAnswerData ] = useState<UseAnswerDataType | null>(null)

    useEffect(()=>{
        const fetchAnswerInput = async () => {
            const { data , error } = await supabase
                .from('answer_inputs')
                .select("*")
                .eq('room_id' , roomId)
                .single()

            if(error){
                return setAnswerData(null)
            }

            if(data){
                setAnswerData({ answerInputs: data.text, result: data.result })
            }
        }
        fetchAnswerInput()


        const subscription = supabase
            .channel('public:answer_inputs')
            .on(
                'postgres_changes',
                { event:'INSERT' , schema:'public' , table:'answer_inputs' , filter: `room_id=eq.${roomId}` },
                (payload) => {
                    const newInputs = payload.new.text
                    setAnswerData({ answerInputs: newInputs, result: payload.new.result })
                }
            )
            .on(
                'postgres_changes',
                { event:'UPDATE' , schema:'public' , table:'answer_inputs' , filter: `room_id=eq.${roomId}` },
                (payload) => {
                    const newInputs = payload.new.text
                    setAnswerData({ answerInputs: newInputs, result: payload.new.result })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        }
    },[roomId])

    return { 
        answerInputs: answerData ? answerData.answerInputs : null,
        result: answerData ? answerData.result : "",
     }
}