
import React, { useRef } from 'react';

interface ImageInputProps {
  onImageSelect: (file: File) => void;
  selectedImage: string | null;
}

const ImageInput: React.FC<ImageInputProps> = ({ onImageSelect, selectedImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-slate-200">1. Upload Character Reference</h2>
      <div 
        onClick={handleClick}
        className={`relative aspect-square md:aspect-video rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden
          ${selectedImage 
            ? 'border-indigo-500 bg-slate-800/50' 
            : 'border-slate-700 bg-slate-800/20 hover:border-slate-500 hover:bg-slate-800/40'}`}
      >
        {selectedImage ? (
          <>
            <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-medium text-sm">
                Change Image
              </span>
            </div>
          </>
        ) : (
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-cloud-upload-alt text-slate-400 text-2xl"></i>
            </div>
            <p className="text-slate-300 font-medium">Click or drag to upload</p>
            <p className="text-slate-500 text-sm mt-1">Portrait or character photo recommended</p>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleChange} 
          className="hidden" 
          accept="image/*"
        />
      </div>
    </div>
  );
};

export default ImageInput;
