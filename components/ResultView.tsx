
import React from 'react';

interface ResultViewProps {
  imageUrl: string | null;
  isGenerating: boolean;
  statusMessage: string;
  onRedo: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ imageUrl, isGenerating, statusMessage, onRedo }) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-slate-200">2. Collectible Result</h2>
      <div className="relative aspect-square rounded-2xl bg-slate-800/30 border border-slate-700 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <>
            <img src={imageUrl} alt="Generated Figurine" className="w-full h-full object-cover animate-in fade-in duration-700" />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button 
                onClick={onRedo}
                className="bg-slate-800/80 hover:bg-slate-700 backdrop-blur-md text-white p-3 rounded-full shadow-lg transition-all hover:scale-110 border border-slate-600"
                title="Regenerar Figura"
              >
                <i className="fas fa-redo-alt"></i>
              </button>
              <a 
                href={imageUrl} 
                download="figurine-result.png"
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
                title="Download Image"
              >
                <i className="fas fa-download"></i>
              </a>
            </div>
          </>
        ) : isGenerating ? (
          <div className="flex flex-col items-center gap-6 p-8 text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fas fa-wand-magic-sparkles text-indigo-400 animate-pulse"></i>
              </div>
            </div>
            <div>
              <p className="text-xl font-medium text-white mb-2">{statusMessage}</p>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">
                Sculpting, painting, and setting up your custom 1/7 scale figurine...
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
              <i className="fas fa-image text-slate-600 text-2xl"></i>
            </div>
            <p className="text-slate-500 italic">Generated figurine will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultView;
