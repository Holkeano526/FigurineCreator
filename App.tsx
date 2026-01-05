
import React, { useState } from 'react';
import Header from './components/Header';
import ImageInput from './components/ImageInput';
import ResultView from './components/ResultView';
import { generateFigurineImage } from './services/geminiService';
import { GenerationState } from './types';

const STATUS_MESSAGES = [
  "Analyzing character anatomy...",
  "Digitizing source artwork...",
  "Initializing Zbrush workspace...",
  "Sculpting 1/7 scale high-poly mesh...",
  "Rendering acrylic base transparency...",
  "Generating 2D box art illustrations...",
  "Applying photorealistic materials...",
  "Simulating studio lighting setup...",
  "Finalizing render pass..."
];

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<{file: File, preview: string} | null>(null);
  const [instructions, setInstructions] = useState<string>("");
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    error: null,
    resultImageUrl: null,
    statusMessage: "Standby"
  });

  const handleImageSelect = (file: File) => {
    const preview = URL.createObjectURL(file);
    setSelectedImage({ file, preview });
    setState(prev => ({ 
      ...prev, 
      error: null, 
      resultImageUrl: null,
      statusMessage: "Ready to process"
    }));
  };

  const handleReset = () => {
    if (selectedImage?.preview) {
      URL.revokeObjectURL(selectedImage.preview);
    }
    setSelectedImage(null);
    setInstructions("");
    setState({
      isGenerating: false,
      error: null,
      resultImageUrl: null,
      statusMessage: "Standby"
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;

    setState(prev => ({ 
      ...prev, 
      isGenerating: true, 
      error: null, 
      resultImageUrl: null,
      statusMessage: STATUS_MESSAGES[0] 
    }));

    let currentMsgIndex = 0;
    const statusInterval = setInterval(() => {
      currentMsgIndex = (currentMsgIndex + 1) % STATUS_MESSAGES.length;
      setState(prev => ({
        ...prev,
        statusMessage: STATUS_MESSAGES[currentMsgIndex]
      }));
    }, 3000);

    try {
      const base64 = await fileToBase64(selectedImage.file);
      const result = await generateFigurineImage(base64, selectedImage.file.type, instructions);
      
      setState(prev => ({
        ...prev,
        isGenerating: false,
        resultImageUrl: result,
        statusMessage: "Prototypes Finalized"
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: err.message || "An unexpected error occurred during the creative process."
      }));
    } finally {
      clearInterval(statusInterval);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto w-full p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Workflow Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="glass-panel rounded-3xl p-6 md:p-8 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Project Setup</h2>
                  <p className="text-slate-400 text-sm">Upload reference and add custom details.</p>
                </div>
                <button 
                  onClick={handleReset}
                  className="p-2 text-slate-500 hover:text-white transition-colors text-xs flex items-center gap-2 font-bold uppercase tracking-widest"
                  title="Clear Project"
                >
                  <i className="fas fa-redo-alt"></i>
                  Reset
                </button>
              </div>

              <div className="space-y-6">
                <ImageInput 
                  onImageSelect={handleImageSelect} 
                  selectedImage={selectedImage?.preview || null} 
                />

                <div className="flex flex-col gap-2">
                  <label htmlFor="instructions" className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <i className="fas fa-comment-alt text-indigo-400"></i>
                    Additional Instructions
                  </label>
                  <textarea 
                    id="instructions"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="E.g. Dynamic action pose, battle damage on armor, specialized base lighting..."
                    className="w-full h-24 bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none placeholder:text-slate-600"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleGenerate}
                    disabled={!selectedImage || state.isGenerating}
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-lg
                      ${!selectedImage || state.isGenerating
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-500/20'}`}
                  >
                    {state.isGenerating ? (
                      <>
                        <i className="fas fa-microchip animate-pulse"></i>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-cube"></i>
                        Begin 1/7 Prototype
                      </>
                    )}
                  </button>
                  
                  {state.error && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3 text-red-400 text-sm animate-in slide-in-from-top-2">
                      <i className="fas fa-exclamation-circle mt-1"></i>
                      <p>{state.error}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Technical Specs Card */}
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <i className="fas fa-layer-group text-indigo-500"></i>
                Technical Specifications
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
                  <span className="block text-[10px] text-slate-500 uppercase font-bold">Scale</span>
                  <span className="text-sm text-slate-200">1:7 Scale Ratio</span>
                </div>
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
                  <span className="block text-[10px] text-slate-500 uppercase font-bold">Base</span>
                  <span className="text-sm text-slate-200">Clear Acrylic</span>
                </div>
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
                  <span className="block text-[10px] text-slate-500 uppercase font-bold">Environment</span>
                  <span className="text-sm text-slate-200">Studio Desk</span>
                </div>
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
                  <span className="block text-[10px] text-slate-500 uppercase font-bold">Context</span>
                  <span className="text-sm text-slate-200">Zbrush / Bandai</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization Column */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-3xl p-6 md:p-8 h-full shadow-2xl flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-10">
                <i className="fas fa-vr-cardboard text-9xl"></i>
              </div>
              <ResultView 
                imageUrl={state.resultImageUrl} 
                isGenerating={state.isGenerating} 
                statusMessage={state.statusMessage}
                onRedo={handleGenerate}
              />
            </div>
          </div>

        </div>
      </main>

      <footer className="py-8 px-4 border-t border-slate-800/50 text-center text-slate-500 text-xs">
        <div className="flex items-center justify-center gap-6 mb-4 opacity-50">
          <i className="fas fa-draw-polygon"></i>
          <i className="fas fa-bezier-curve"></i>
          <i className="fas fa-vector-square"></i>
        </div>
        <p>© 2025 Figurine Studio AI. Experimental High-Fidelity Prototyping Engine.</p>
        <p className="mt-1">Powered by Gemini Vision Intelligence.</p>
      </footer>
    </div>
  );
};

export default App;
