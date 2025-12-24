
import React, { useRef, useState } from 'react';
import { FileState } from '../types';

interface FileUploaderProps {
  onFileSelect: (file: FileState) => void;
  disabled?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onFileSelect({
          file,
          preview: e.target?.result as string,
          type: file.type
        });
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a PDF or image file.');
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`relative group border-2 border-dashed rounded-2xl p-12 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden
        ${isDragging ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-300 bg-white hover:border-indigo-400 hover:shadow-xl'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onClick={() => !disabled && fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,image/*"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        disabled={disabled}
      />
      
      <div className="p-4 bg-indigo-100 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>

      <h3 className="text-xl font-semibold text-slate-800 mb-2">Drop your document here</h3>
      <p className="text-slate-500 text-center max-w-sm mb-6">
        Support PDF, PNG, and JPG. Our AI will automatically detect tables and formatting.
      </p>
      
      <div className="flex items-center space-x-2 text-sm font-medium text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg group-hover:bg-indigo-100 transition-colors">
        <span>Select File</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>

      {/* Background patterns */}
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="40" />
        </svg>
      </div>
    </div>
  );
};

export default FileUploader;
