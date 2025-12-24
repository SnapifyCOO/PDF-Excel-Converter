
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import ProcessingStatusComp from './components/ProcessingStatus';
import { FileState, ProcessingStatus } from './types';
import { analyzeDocument } from './services/geminiService';
import { generateCsvFile } from './services/excelService';

const App: React.FC = () => {
  const [fileState, setFileState] = useState<FileState | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (selectedFile: FileState) => {
    setFileState(selectedFile);
    setError(null);
    setStatus(ProcessingStatus.UPLOADING);

    try {
      // Step 2: AI Analysis with High Fidelity Multi-Sheet Prompt
      setStatus(ProcessingStatus.ANALYZING);
      const conversionData = await analyzeDocument(selectedFile.preview, selectedFile.type);

      // Step 3: CSV Generation (Merging multi-sheet data into one file)
      setStatus(ProcessingStatus.GENERATING);
      generateCsvFile(conversionData, selectedFile.file.name);

      setStatus(ProcessingStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during conversion.');
      setStatus(ProcessingStatus.ERROR);
    }
  }, []);

  const reset = () => {
    setFileState(null);
    setStatus(ProcessingStatus.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            High-Fidelity <span className="text-indigo-600">CSV Conversion</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our AI analyzes your PDF to preserve visual formatting and logical structure, 
            generating a clean CSV file with all your data organized and ready for use.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {status === ProcessingStatus.IDLE || status === ProcessingStatus.ERROR ? (
            <div className="space-y-6">
              <FileUploader onFileSelect={handleFileSelect} disabled={status !== ProcessingStatus.IDLE && status !== ProcessingStatus.ERROR} />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <FeatureCard 
                  icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>}
                  title="Layout Aware"
                  description="Maintains the visual structure and spacing of the original document in plain text."
                />
                <FeatureCard 
                  icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                  title="CSV Export"
                  description="Standard comma-separated format for easy integration with any software."
                />
                <FeatureCard 
                  icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>}
                  title="Precise Extraction"
                  description="Ensures data integrity while mimicking the original font and header style."
                />
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 flex flex-col items-center">
                <div className="w-full mb-8 rounded-xl overflow-hidden border border-slate-200 aspect-[4/3] relative">
                  {fileState?.type === 'application/pdf' ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                      <svg className="w-24 h-24 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="absolute bottom-4 font-medium text-slate-400">PDF Document</span>
                    </div>
                  ) : (
                    <img src={fileState?.preview} alt="Preview" className="w-full h-full object-contain bg-slate-50" />
                  )}
                </div>

                <ProcessingStatusComp status={status} />

                {status === ProcessingStatus.COMPLETED && (
                  <div className="mt-8 space-y-4 text-center">
                    <div className="p-4 bg-green-50 border border-green-100 rounded-xl inline-flex items-center space-x-2 text-green-700 font-medium">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Conversion Complete! CSV file downloaded.</span>
                    </div>
                    <p className="text-slate-500 text-sm">Formatting and multi-section layouts have been preserved within the file.</p>
                    <button 
                      onClick={reset}
                      className="block w-full bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all transform hover:-translate-y-1 shadow-lg shadow-indigo-200"
                    >
                      Convert Another File
                    </button>
                  </div>
                )}
                
                {status === ProcessingStatus.ERROR && (
                  <button onClick={reset} className="mt-4 text-indigo-600 font-medium hover:underline">Try again</button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; 2024 PDF to CSV Pro. High-fidelity extraction active.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="p-6 bg-white rounded-2xl border border-slate-100 hover:shadow-md transition-shadow duration-300">
    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
      {icon}
    </div>
    <h4 className="font-bold text-slate-800 mb-2">{title}</h4>
    <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
  </div>
);

export default App;
