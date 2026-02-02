import { useState } from 'react';
import TextInput from './text-input';
import MainButton from '@/components/ui/main-button';

interface FloraGeneratorProps {
  onGenerate: (text: string) => void;
}

export default function FloraGenerator({ onGenerate }: FloraGeneratorProps) {
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (inputText.trim().length < 10) {
      alert('Please enter at least 10 characters');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      onGenerate(inputText);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <label className="font-jetbrains-mono text-sm uppercase tracking-wider">
          Input Text
        </label>
        <TextInput
          value={inputText}
          onChange={setInputText}
          placeholder="Write something meaningful. Your words will become a unique flora..."
          maxLength={500}
        />
      </div>

      <div className="flex justify-center">
        <MainButton
          variant="navbar"
          size="lg"
          onClick={handleGenerate}
          disabled={isGenerating || inputText.trim().length < 10}
        >
          {isGenerating ? 'GENERATING...' : 'GENERATE FLORA'}
        </MainButton>
      </div>

      <div className="font-jetbrains-mono text-xs text-neutral-500 text-center space-y-1">
        <p>• Your text will be analyzed for sentiment, rhythm, and structure</p>
        <p>• Each element influences the generated flora's morphology</p>
        <p>• The result is unique to your input</p>
      </div>
    </div>
  );
}
