import React from 'react';
import BallComponent from './Ball';
import { BallColor } from '../types';

interface BoxProps {
  title: string;
  redCount: number;
  blueCount: number;
  evidenceColor: BallColor | null;
}

const Box: React.FC<BoxProps> = ({ title, redCount, blueCount, evidenceColor }) => {
  const balls: BallColor[] = [
      ...Array(redCount).fill('red'),
      ...Array(blueCount).fill('blue'),
  ].sort(() => Math.random() - 0.5);

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-semibold mb-2 text-center">{title}</h2>
      <div className="text-center text-sm text-slate-500 dark:text-slate-400 mb-3">
        <span className="font-semibold text-red-500">{redCount} Red</span>
        <span className="mx-2">&bull;</span>
        <span className="font-semibold text-blue-500">{blueCount} Blue</span>
      </div>
      <div className="flex-grow bg-white dark:bg-slate-800 border-4 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-6 min-h-[300px] shadow-inner">
        <div className="flex flex-wrap justify-center items-center gap-4">
          {balls.map((color, index) => (
            <BallComponent
              key={`${title}-${index}`}
              color={color}
              highlight={evidenceColor === color}
              dim={evidenceColor !== null && evidenceColor !== color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Box;
