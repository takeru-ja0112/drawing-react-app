import { motion } from 'motion/react';
// RoomSettingTypeのimportは不要になるので削除
import { useState } from 'react';

type RoomSettingProps<T> = {
    className?: string;
    setRoomData: React.Dispatch<React.SetStateAction<T>>;
};

export default function RoomSetting<T>({
    className,
    setRoomData,
}: RoomSettingProps<T>) {
    const levels = ['easy', 'normal', 'hard'];
    const genres = ['ランダム','動物','料理','雑貨'];
    const [selectedLevel, setSelectedLevel] = useState<string>('normal');

    return (
        <div className={className}>
            {/* 難易度タブ */}
            <p className="font-semibold mb-2 text-gray-700">難易度</p>
            <div className="grid grid-cols-3 gap-2 mb-2">
                {levels.map((level) => (
                    <motion.label
                        key={level}
                        className="cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className={`px-1 py-2 font-black text-sm rounded-full hover:bg-amber-500 transition-colors duration-200 text-center whitespace-nowrap text-ellipsis overflow-hidden ${selectedLevel === level ? 'ring-4 ring-amber-300 bg-amber-500' : 'bg-yellow-400'}`}>
                            {level === 'easy' && 'かんたん'}
                            {level === 'normal' && 'ふつう'}
                            {level === 'hard' && 'むずかしい'}
                        </div>
                        <motion.input
                            type='radio'
                            name='level'
                            onChange={() => {
                                setSelectedLevel(level);
                                setRoomData(prev => ({ ...prev, level: level }));
                            }}
                            checked={selectedLevel === level}
                            key={level}
                            className="hidden"
                        />
                    </motion.label>

                ))}
            </div>
            <p className='text-sm text-yellow-700 font-bold h-10'>
                {selectedLevel === 'easy' && 'いちご、風船、太陽などのかんたんなお題が出るよ！'}
                {selectedLevel === 'normal' && 'ケーキ、フラミンゴ、トロフィーなどのお題が出るよ！'}
                {selectedLevel === 'hard' && 'とにかくむずかしいお題が出るよ！'}
            </p>

            {/* ジャンルセレクタ */}
            <p className="font-semibold mt-6 mb-2 text-gray-700">ジャンル</p>
            <div className="">
                <motion.select
                    name="genre"
                    id="genre"
                    onChange={(e) => setRoomData(prev => ({ ...prev, genre: e.target.value }))}
                    className="w-full col-span-3 p-4 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors cursor-pointer"
                >
                    {genres.map((genre) => (
                        <motion.option
                            key={genre}
                            value={genre}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors text-center"
                        >
                            {genre}
                        </motion.option>
                    ))}
                </motion.select>
                <p className='mt-2 text-xs text-gray-500'>※ジャンルはまだ拡張していません</p>
            </div>
        </div>
    );
}