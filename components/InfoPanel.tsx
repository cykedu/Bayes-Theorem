import React from 'react';
import { type BallColor } from '../types';

interface InfoPanelProps {
  box1Config: { red: number; blue: number };
  box2Config: { red: number; blue: number };
  evidenceColor: BallColor | null;
  onSetEvidence: (color: BallColor) => void;
  onReset: () => void;
}

const formatPercent = (value: number): string => {
    if (isNaN(value)) return '0.0%';
    return `${(value * 100).toFixed(1)}%`;
}

const CalculationCard: React.FC<{ title: string; children: React.ReactNode, isVisible?: boolean }> = ({ title, children, isVisible = true }) => {
    if (!isVisible) return null;
    return (
        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg shadow-sm transition-opacity duration-500">
            <h3 className="text-lg font-semibold mb-3 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-600 pb-2">{title}</h3>
            {children}
        </div>
    );
};

const ProbabilityRow: React.FC<{ label: string; value: number; fraction?: string }> = ({ label, value, fraction }) => (
    <div className="flex justify-between items-center text-base mb-2">
        <span className="font-medium text-slate-600 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: label }}></span>
        <div className="text-right">
            {fraction && <span className="font-mono text-slate-800 dark:text-slate-100">{fraction}</span>}
            <span className="ml-4 font-semibold text-sky-700 dark:text-sky-300 w-20 inline-block text-left">
                ({formatPercent(value)})
            </span>
        </div>
    </div>
);


const InfoPanel: React.FC<InfoPanelProps> = ({
  box1Config,
  box2Config,
  evidenceColor,
  onSetEvidence,
  onReset,
}) => {
  // 1. Priors
  const priorBox1 = 0.5;
  const priorBox2 = 0.5;

  // 2. Likelihoods
  const totalBox1 = box1Config.red + box1Config.blue;
  const totalBox2 = box2Config.red + box2Config.blue;

  const likelihoodRedBox1 = totalBox1 > 0 ? box1Config.red / totalBox1 : 0;
  const likelihoodBlueBox1 = totalBox1 > 0 ? box1Config.blue / totalBox1 : 0;
  const likelihoodRedBox2 = totalBox2 > 0 ? box2Config.red / totalBox2 : 0;
  const likelihoodBlueBox2 = totalBox2 > 0 ? box2Config.blue / totalBox2 : 0;

  // 3. Marginal Likelihood (Total Probability of Evidence)
  const pRed = (likelihoodRedBox1 * priorBox1) + (likelihoodRedBox2 * priorBox2);
  const pBlue = (likelihoodBlueBox1 * priorBox1) + (likelihoodBlueBox2 * priorBox2);
  
  // 4. Posteriors
  let posteriorBox1 = priorBox1;
  let posteriorBox2 = priorBox2;
  
  if (evidenceColor === 'red' && pRed > 0) {
    posteriorBox1 = (likelihoodRedBox1 * priorBox1) / pRed;
    posteriorBox2 = (likelihoodRedBox2 * priorBox2) / pRed;
  } else if (evidenceColor === 'blue' && pBlue > 0) {
    posteriorBox1 = (likelihoodBlueBox1 * priorBox1) / pBlue;
    posteriorBox2 = (likelihoodBlueBox2 * priorBox2) / pBlue;
  }
  
  const capEvidence = evidenceColor ? evidenceColor.charAt(0).toUpperCase() + evidenceColor.slice(1) : '';

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl flex flex-col space-y-4 h-full">
      <h2 className="text-2xl font-semibold text-center lg:text-left">Bayesian Calculator</h2>

      <CalculationCard title="1. Prior Probabilities">
         <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
           Initially, we assume it's equally likely we're picking from either box.
         </p>
         <ProbabilityRow label="P(Box 1)" value={priorBox1} fraction="1/2" />
         <ProbabilityRow label="P(Box 2)" value={priorBox2} fraction="1/2" />
      </CalculationCard>
      
      <CalculationCard title="2. Likelihoods">
         <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
           The probability of picking a certain color, given the box.
         </p>
         <ProbabilityRow label="P(Red | Box 1)" value={likelihoodRedBox1} fraction={`${box1Config.red}/${totalBox1}`} />
         <ProbabilityRow label="P(Red | Box 2)" value={likelihoodRedBox2} fraction={`${box2Config.red}/${totalBox2}`} />
         <ProbabilityRow label="P(Blue | Box 1)" value={likelihoodBlueBox1} fraction={`${box1Config.blue}/${totalBox1}`} />
         <ProbabilityRow label="P(Blue | Box 2)" value={likelihoodBlueBox2} fraction={`${box2Config.blue}/${totalBox2}`} />
      </CalculationCard>

      <CalculationCard title="3. Marginal Likelihood">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          The overall probability of observing each color across both boxes. This is the denominator in Bayes' formula.
        </p>
        <ProbabilityRow label="P(Red)" value={pRed} />
        <ProbabilityRow label="P(Blue)" value={pBlue} />
      </CalculationCard>

      <CalculationCard title={`4. Posterior Probabilities (After observing a ${capEvidence} ball)`} isVisible={!!evidenceColor}>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              After observing a <b>{evidenceColor}</b> ball, we update our beliefs about which box was chosen.
          </p>
          <div className="p-3 my-2 bg-sky-50 dark:bg-sky-900/50 rounded-lg text-sm">
            <p className="font-semibold">Bayes' Formula:</p>
            <p className="font-mono text-xs mt-1">P(Box | {capEvidence}) = [P({capEvidence} | Box) * P(Box)] / P({capEvidence})</p>
          </div>
          <ProbabilityRow label={`P(Box 1 | ${capEvidence})`} value={posteriorBox1} />
          <ProbabilityRow label={`P(Box 2 | ${capEvidence})`} value={posteriorBox2} />
      </CalculationCard>

       {!evidenceColor && (
        <div className="text-center p-4 bg-sky-50 dark:bg-sky-900/50 rounded-lg">
          <p className="text-sky-800 dark:text-sky-200 font-medium">Observe a ball to calculate the posterior probabilities!</p>
        </div>
      )}

      <div className="pt-4 mt-auto border-t border-slate-200 dark:border-slate-700">
        <p className="text-center text-sm font-semibold mb-2 text-slate-600 dark:text-slate-400">Provide Evidence:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
                onClick={() => onSetEvidence('red')}
                disabled={!!evidenceColor}
                className="w-full px-4 py-3 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600 transition-all duration-200 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
            >
                Observe a Red Ball
            </button>
            <button
                onClick={() => onSetEvidence('blue')}
                disabled={!!evidenceColor}
                className="w-full px-4 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
            >
                Observe a Blue Ball
            </button>
        </div>
        <button
            onClick={onReset}
            className="w-full mt-4 px-4 py-3 bg-slate-600 text-white font-bold rounded-lg shadow-md hover:bg-slate-700 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Reset
        </button>
      </div>
    </div>
  );
};

export default InfoPanel;
