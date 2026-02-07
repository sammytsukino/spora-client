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
      <div className={`border-2 transition-colors duration-200 ${
        isFocused ? 'border-[var(--spora-accent-secondary)]' : 'border-[var(--spora-primary)]'
      }`}>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="w-full h-32 sm:h-40 md:h-48 p-4 font-supply-mono text-sm bg-[var(--spora-primary)] text-[var(--spora-text-secondary)] resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--spora-accent-secondary)] focus-visible:ring-offset-2 placeholder:text-neutral-500 transition-colors duration-200"
        />
        <div className="px-4 py-2 bg-[var(--spora-primary)] text-[var(--spora-text-secondary)] font-supply-mono text-xs flex justify-between items-center border-t-2 border-[var(--spora-primary)]">
          <span>CHARACTER COUNT</span>
          <span className={value.length >= maxLength ? 'text-red-400' : ''}>{value.length} / {maxLength}</span>
        </div>
      </div>
    </div>
  );
}
