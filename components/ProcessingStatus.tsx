
import React from 'react';
import { ProcessingStatus } from '../types';

interface ProcessingStatusProps {
  status: ProcessingStatus;
}

const ProcessingStatusComp: React.FC<ProcessingStatusProps> = ({ status }) => {
  const steps = [
    { key: ProcessingStatus.UPLOADING, label: 'Reading Document' },
    { key: ProcessingStatus.ANALYZING, label: 'AI Analysis' },
    { key: ProcessingStatus.GENERATING, label: 'Building Excel' },
    { key: ProcessingStatus.COMPLETED, label: 'Done' }
  ];

  const currentIndex = steps.findIndex(s => s.key === status);

  if (status === ProcessingStatus.IDLE) return null;

  return (
    <div className="w-full max-w-xl mx-auto mt-12 bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-8">
        <h4 className="text-lg font-bold text-slate-800">Processing Document</h4>
        <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full animate-pulse">
          {status === ProcessingStatus.COMPLETED ? '100%' : 'Converting...'}
        </span>
      </div>

      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-700 ease-out"
            style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="relative flex justify-between">
          {steps.map((step, idx) => (
            <div key={step.key} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-10
                  ${idx <= currentIndex ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border-2 border-slate-200 text-slate-300'}
                `}
              >
                {idx < currentIndex || status === ProcessingStatus.COMPLETED ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-xs font-bold">{idx + 1}</span>
                )}
              </div>
              <span className={`mt-3 text-xs font-semibold tracking-tight transition-colors duration-300
                ${idx <= currentIndex ? 'text-indigo-700' : 'text-slate-400'}
              `}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {status === ProcessingStatus.ANALYZING && (
        <p className="mt-8 text-sm text-slate-500 text-center animate-bounce">
          Our AI is identifying tables, headers, and cell relationships...
        </p>
      )}
      
      {status === ProcessingStatus.ERROR && (
        <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center space-x-3 text-red-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">Something went wrong. Please try another file.</span>
        </div>
      )}
    </div>
  );
};

export default ProcessingStatusComp;
