import Modal from '@/components/organisms/Modal';
import Button from '@/components/atoms/Button';

export default function ChallengeModal({ onChallenge , onModify , onFinish }: { onChallenge: () => void; onModify: () => void; onFinish: () => void; }) {
    return (
        <Modal isOpen={true}>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">ちゃいます！</h2>
                <h2 className="text-2xl font-bold mb-4 text-center">新しいお題に挑戦しますか？</h2>
                <Button
                    onClick={onChallenge}
                    value="挑戦する"
                    className="w-full mt-4"
                />
                <Button
                    onClick={onModify}
                    value="修正してもらう"
                    className="w-full mt-4"
                />
                <Button
                    onClick={onFinish}
                    value="終了する"
                    className="w-full mt-4"
                />
            </div>
        </Modal>
    )
}