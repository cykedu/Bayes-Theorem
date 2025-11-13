import React, { useState } from 'react';
import { type BallColor } from './types';
import InfoPanel from './components/InfoPanel';
import Box from './components/Box';

const ConfigurationPanel: React.FC<{
  boxConfigs: {
    box1: { red: number; blue: number };
    box2: { red: number; blue: number };
  };
  onConfigChange: (box: 'box1' | 'box2', color: 'red' | 'blue', value: string) => void;
}> = ({ boxConfigs, onConfigChange }) => {

  const inputClasses = "w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition";

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-semibold mb-4 text-center">Configuration</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Box 1 Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Box 1</h3>
          <div>
            <label htmlFor="box1-red" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              Red Balls
            </label>
            <input
              id="box1-red"
              type="number"
              min="0"
              value={boxConfigs.box1.red}
              onChange={(e) => onConfigChange('box1', 'red', e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="box1-blue" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              Blue Balls
            </label>
            <input
              id="box1-blue"
              type="number"
              min="0"
              value={boxConfigs.box1.blue}
              onChange={(e) => onConfigChange('box1', 'blue', e.target.value)}
              className={inputClasses}
            />
          </div>
        </div>
        {/* Box 2 Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Box 2</h3>
          <div>
            <label htmlFor="box2-red" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              Red Balls
            </label>
            <input
              id="box2-red"
              type="number"
              min="0"
              value={boxConfigs.box2.red}
              onChange={(e) => onConfigChange('box2', 'red', e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="box2-blue" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              Blue Balls
            </label>
            <input
              id="box2-blue"
              type="number"
              min="0"
              value={boxConfigs.box2.blue}
              onChange={(e) => onConfigChange('box2', 'blue', e.target.value)}
              className={inputClasses}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const TheoremExplanation = () => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-semibold mb-3 text-center">What is Bayes' Theorem?</h2>
        <div className="space-y-3 text-slate-600 dark:text-slate-300">
            <p>
                Bayes' Theorem is a way to update our beliefs when we get new information. In the context of this app:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
                <li>
                    <strong>Prior Belief:</strong> Initially, we assume there's a 50/50 chance we're picking from Box 1 or Box 2.
                </li>
                <li>
                    <strong>Evidence:</strong> We then "observe" a ball and see its color (e.g., red). This is our new evidence.
                </li>
                <li>
                    <strong>Posterior Belief:</strong> Bayes' Theorem helps us calculate the updated probability that the ball came from a specific box, <em>given</em> the color we saw.
                </li>
            </ul>
             <p className="pt-2">
                As you change the number of balls or the observed color, you can see how the evidence changes the final probabilities!
            </p>
        </div>
    </div>
);


const App: React.FC = () => {
  const [evidenceColor, setEvidenceColor] = useState<BallColor | null>(null);
  const [boxConfigs, setBoxConfigs] = useState({
    box1: { red: 3, blue: 7 },
    box2: { red: 6, blue: 4 },
  });

  const handleSetEvidence = (color: BallColor) => {
    setEvidenceColor(color);
  };

  const handleReset = () => {
    setEvidenceColor(null);
  };

  const handleConfigChange = (box: 'box1' | 'box2', color: 'red' | 'blue', value: string) => {
    const count = parseInt(value, 10);
    // Allow empty input for better UX, but treat it as 0 for calculations. Default to 0 if NaN.
    const newCount = isNaN(count) ? 0 : count;

    if (count >= 0) {
       setBoxConfigs(prev => ({
        ...prev,
        [box]: {
          ...prev[box],
          [color]: value === '' ? '' : newCount // Keep input blank if user deletes number
        }
      }));
    }
  };

  const getNumericConfig = () => ({
      box1: {
          red: Number(boxConfigs.box1.red) || 0,
          blue: Number(boxConfigs.box1.blue) || 0,
      },
      box2: {
          red: Number(boxConfigs.box2.red) || 0,
          blue: Number(boxConfigs.box2.blue) || 0,
      }
  })

  const numericConfigs = getNumericConfig();

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <header className="text-center mb-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-sky-600 dark:text-sky-400">Bayes' Theorem</h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">An Interactive Learning Experience</p>
      </header>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-8">
          <ConfigurationPanel boxConfigs={boxConfigs} onConfigChange={handleConfigChange} />
          <TheoremExplanation />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <Box
              title="Box 1"
              redCount={numericConfigs.box1.red}
              blueCount={numericConfigs.box1.blue}
              evidenceColor={evidenceColor}
            />
            <Box
              title="Box 2"
              redCount={numericConfigs.box2.red}
              blueCount={numericConfigs.box2.blue}
              evidenceColor={evidenceColor}
            />
          </div>
        </div>

        <InfoPanel
          box1Config={numericConfigs.box1}
          box2Config={numericConfigs.box2}
          evidenceColor={evidenceColor}
          onSetEvidence={handleSetEvidence}
          onReset={handleReset}
        />
      </div>

      <footer className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>Built for educational purposes. Observe a ball to see how the probability of each box being the source changes.</p>
      </footer>
    </div>
  );
};

export default App;