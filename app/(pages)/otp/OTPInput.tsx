"use client";
import React, { useRef } from "react";

interface OTPInputProps {
  length?: number;
  onChange: (otp: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ length = 6, onChange }) => {
  const inputs = Array.from({ length });
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const val = e.target.value.replace(/\D/g, ""); // Only numbers
    if (val.length > 1) return;
    e.target.value = val;
    onChange(inputRefs.current.map((input) => input?.value || "").join(""));
    if (val && idx < length - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace" && !inputRefs.current[idx]?.value && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-4 justify-center">
      {inputs.map((_, idx) => (
        <input
          key={idx}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="w-12 h-16 border-2 border-gray-300 rounded-lg text-center text-2xl focus:outline-none focus:border-blue-500 transition-all"
          ref={(el) => {
            inputRefs.current[idx] = el;
          }}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
        />
      ))}
    </div>
  );
};

export default OTPInput;
