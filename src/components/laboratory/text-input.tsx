import { useState } from 'react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export default function TextInput({ 
  value, 
  onChange, 
  placeholder = "Enter your text here...",
  maxLength = 500 
}: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full">
      <div className={`border-2 transition-colors ${
        isFocused ? 'border-lime-300' : 'border-[#262626]'
      }`}>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="w-full h-48 p-4 font-supply-mono text-sm bg-[#262626] text-stone-200 resize-none focus:outline-none placeholder:text-neutral-500"
        />
        <div className="px-4 py-2 bg-[#262626] text-lime-300 font-supply-mono text-xs flex justify-between items-center">
          <span>CHARACTER COUNT</span>
          <span>{value.length} / {maxLength}</span>
        </div>
      </div>
    </div>
  );
}
