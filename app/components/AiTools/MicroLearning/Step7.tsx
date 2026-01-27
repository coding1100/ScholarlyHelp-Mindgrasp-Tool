"use client";

import { useState } from "react";

interface Step7Props {
    isOpen: boolean;
    onClose: () => void;
    onStartLesson: (minutes: number) => void;
}

export default function Step7({ isOpen, onClose, onStartLesson }: Step7Props) {
    const [selectedDuration, setSelectedDuration] = useState<number>(10);

    if (!isOpen) return null;

    const handleStart = () => {
        onStartLesson(selectedDuration);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-[#2C2C2C]/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-md bg-[#F0F0F0] rounded-3xl p-8 md:p-10 shadow-2xl">
                {/* Title */}
                <p className="text-2xl font-semibold text-[#333333] text-center mb-3">
                    Ready to Learn?
                </p>

                {/* Subtitle */}
                <p className="text-[#666666] text-sm text-center mb-6">
                    Choose your lesson duration:
                </p>

                {/* Duration Buttons */}
                <div className="flex gap-4 justify-center mb-3">
                    {[5, 10, 15].map((minutes) => {
                        const isSelected = selectedDuration === minutes;
                        return (
                            <button
                                key={minutes}
                                type="button"
                                onClick={() => setSelectedDuration(minutes)}
                                className={[
                                    "px-6 py-3 rounded-2xl font-bold text-[#222222] transition-all duration-200",
                                    isSelected
                                        ? "bg-white border-2 border-[#6C757D] shadow-md"
                                        : "bg-white border border-[#D7D7D7] hover:border-[#BEBEBE]",
                                ].join(" ")}
                            >
                                {minutes} min
                            </button>
                        );
                    })}
                </div>

                {/* Separator */}
                <div className="text-center mb-3">
                    <span className="text-[#666666] text-sm">or</span>
                </div>

                {/* Start Lesson Button */}
                <button
                    type="button"
                    onClick={handleStart}
                    className="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] cursor-pointer"
                >
                    Start {selectedDuration}-Minute Lesson
                </button>
            </div>
        </div>
    );
}
