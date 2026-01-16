import React from 'react';
import { MoodType } from '../types';

interface MoodSelectorProps {
  selectedMood: number | null;
  onSelect: (mood: number) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onSelect }) => {
  const moods = [
    { value: MoodType.Angry, label: 'Angry', emoji: '😠', color: 'bg-red-100 border-red-300 text-red-600' },
    { value: MoodType.Sad, label: 'Sad', emoji: '🙁', color: 'bg-orange-100 border-orange-300 text-orange-600' },
    { value: MoodType.Neutral, label: 'Okay', emoji: '😐', color: 'bg-yellow-100 border-yellow-300 text-yellow-600' },
    { value: MoodType.Happy, label: 'Good', emoji: '🙂', color: 'bg-teal-100 border-teal-300 text-teal-600' },
    { value: MoodType.Ecstatic, label: 'Great', emoji: '🤩', color: 'bg-emerald-100 border-emerald-300 text-emerald-600' },
  ];

  return (
    <div className="flex justify-between items-center w-full gap-2">
      {moods.map((mood) => {
        const isSelected = selectedMood === mood.value;
        return (
          <button
            key={mood.value}
            type="button"
            onClick={() => onSelect(mood.value)}
            className={`
              relative group flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 ease-out
              ${isSelected ? `${mood.color} scale-110 shadow-lg` : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-slate-50'}
              w-full sm:w-20 h-20 sm:h-24
            `}
          >
            <span className={`text-3xl sm:text-4xl transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100'}`}>
              {mood.emoji}
            </span>
            <span className={`text-xs mt-2 font-medium ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
              {mood.label}
            </span>
            
            {isSelected && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-current rounded-full animate-ping opacity-75"></span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default MoodSelector;
