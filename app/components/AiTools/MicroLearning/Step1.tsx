"use client";

interface Step1Props {
    onContinue?: () => void;
}

export default function Step1({ onContinue }: Step1Props) {
    return (
        <div className="h-[calc(100vh-8vh)] overflow-y-auto flex items-center justify-center p-4">
            {/* Main Content Card */}
            <div className="w-full max-w-2xl">
                <div className="bg-[#F0F0F0] rounded-3xl p-12 md:p-16 shadow-2xl">
                    {/* Icon - Three Books Stacked */}
                    <div className="flex justify-center mb-4">
                        <div className="relative w-16 h-16">
                            {/* Bottom Book (Light Blue) */}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-9 h-12 bg-blue-300 rounded-lg shadow-lg rotate-[-5deg]"></div>
                            {/* Middle Book (Red/Pink) */}
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-9 h-12 bg-pink-400 rounded-lg shadow-lg rotate-[2deg] z-10"></div>
                            {/* Top Book (Green) */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-9 h-12 bg-green-400 rounded-lg shadow-lg rotate-[5deg] z-20"></div>
                        </div>
                    </div>

                    {/* Title */}
                    <p className="text-xl font-semibold text-[#333333] text-center mb-3">
                        Welcome to Micro-Learning!
                    </p>

                    {/* Description */}
                    <p className="text-[#555555] text-sm text-center max-w-lg mx-auto mb-5 leading-relaxed">
                        I'll help you learn bite-sized lessons that fit into your busy schedule. Let's set up your personalized learning plan.
                    </p>

                    {/* Get Started Button */}
                    <div className="flex justify-center">
                        <button
                            onClick={onContinue}
                            className="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] cursor-pointer"
                        >
                            Get Started →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
