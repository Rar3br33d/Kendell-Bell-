
import React from 'react';

interface NumberBallProps {
  num: number;
  delay?: number;
}

const NumberBall: React.FC<NumberBallProps> = ({ num, delay = 0 }) => {
  return (
    <div
      className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-600 text-black font-bold text-xl md:text-2xl shadow-lg animate-bounce"
      style={{ animationDelay: `${delay}s`, animationDuration: '2s' }}
    >
      {num}
    </div>
  );
};

export default NumberBall;
