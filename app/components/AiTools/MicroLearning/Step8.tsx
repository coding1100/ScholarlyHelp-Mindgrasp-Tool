"use client";

import { useState } from "react";

interface Step8Props {
    isOpen: boolean;
    onClose: () => void;
    onCreateFlashcards: (topic: string) => void;
}

export default function Step8({ isOpen, onClose, onCreateFlashcards }: Step8Props) {
    const [topic, setTopic] = useState("");

    if (!isOpen) return null;

    const trimmedTopic = topic.trim();
    const isDisabled = !trimmedTopic;

    const handleCreate = () => {
        if (isDisabled) return;
        onCreateFlashcards(trimmedTopic);
        setTopic("");
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
            <div className="relative w-full max-w-lg bg-[#F0F0F0] rounded-3xl p-8 md:p-10 shadow-2xl">
                {/* Title */}
                <h2 className="text-4xl md:text-5xl font-bold text-[#333333] text-center mb-3">
                    Create Flashcards
                </h2>

                {/* Subtitle */}
                <p className="text-[#666666] text-base md:text-lg text-center mb-8">
                    Generate flashcards for spaced repetition learning.
                </p>

                {/* Input and Button Row */}
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !isDisabled) handleCreate();
                        }}
                        placeholder="Enter topic (e.g., Python basics)"
                        className="flex-1 h-14 px-6 rounded-2xl bg-white border border-[#D7D7D7] text-[#222222] placeholder:text-[#9A9A9A] focus:outline-none focus:ring-2 focus:ring-[#6C757D]/25 focus:border-[#6C757D]/50"
                    />
                    <button
                        type="button"
                        onClick={handleCreate}
                        disabled={isDisabled}
                        className={[
                            "h-14 px-8 rounded-2xl font-bold shadow-lg transition-all duration-200 whitespace-nowrap",
                            isDisabled
                                ? "bg-[#B9BFC5] text-white cursor-not-allowed opacity-80"
                                : "bg-linear-to-r from-[#6C757D] to-[#868E96] text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
                        ].join(" ")}
                    >
                        Create Flashcards
                    </button>
                </div>
            </div>
        </div>
    );
}
