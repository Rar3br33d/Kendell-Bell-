
import React from 'react';
import { ZodiacSign } from '../types';

interface ZodiacCardProps {
  sign: ZodiacSign;
  isSelected: boolean;
  onSelect: (sign: ZodiacSign) => void;
}

const ZodiacCard: React.FC<ZodiacCardProps> = ({ sign, isSelected, onSelect }) => {
  const getElementColor = (element: string) => {
    switch (element) {
      case 'Fire': return 'text-orange-400';
      case 'Earth': return 'text-emerald-400';
      case 'Air': return 'text-sky-400';
      case 'Water': return 'text-indigo-400';
      default: return 'text-white';
    }
  };

  return (
    <button
      onClick={() => onSelect(sign)}
      className={`relative group p-6 rounded-3xl transition-all duration-300 mystic-card hover:scale-105 ${
        isSelected ? 'border-amber-400 ring-2 ring-amber-400/20 bg-white/10' : 'hover:bg-white/10'
      }`}
    >
      <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{sign.icon}</div>
      <h3 className="text-xl font-bold text-white mb-1">{sign.name}</h3>
      <p className="text-xs text-slate-400 mb-2">{sign.dateRange}</p>
      <span className={`text-[10px] uppercase tracking-widest font-bold ${getElementColor(sign.element)}`}>
        {sign.element}
      </span>
    </button>
  );
};

export default ZodiacCard;
