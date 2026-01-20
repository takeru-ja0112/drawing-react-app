import Modal from '@/components/organisms/Modal';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import { setUsernameSchema, validateUsername } from '@/lib/user';

export default function SetUserModal({
    isSetUserModal,
    user,
    nameError,
    loading,
    className,
    setUser,
    setNameError,
    setIsSetUserModal,
}
    :
    {
        isSetUserModal: boolean,
        user: string,
        nameError: string,
        loading: boolean,
        className?: string,
        setUser: React.Dispatch<React.SetStateAction<string>>,
        setNameError: React.Dispatch<React.SetStateAction<string>>,
        setIsSetUserModal: React.Dispatch<React.SetStateAction<boolean>>
    }) {
    return (
        <>
            <Modal
                isOpen={isSetUserModal}
                className={className}
            >
                <p className="font-semibold mb-2 text-gray-700">ユーザー名の入力</p>
                <Input
                    value={user}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setUsernameSchema({ name: e.target.value, setNameError, setUser });
                    }}
                    className={`w-full ${nameError ? 'border-red-500 border-2' : ''}`}
                    placeholder='ユーザー名を入力してください'
                />
                {nameError && (
                    <div className="mt-2">
                        <p className="text-red-500 font-semibold text-sm">{nameError}</p>
                    </div>
                )}
                <div className='flex justify-end mt-4'>
                    <Button
                        value='設定'
                        onClick={() => {
                            if (user && validateUsername(user)) {
                                setIsSetUserModal(false);
                            } else {
                                setNameError('ユーザー名は10文字以内です。');
                            }
                        }}
                        disabled={loading}
                    />
                </div>
            </Modal>
        </>
    );
}