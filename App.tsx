
import React, { useState } from 'react';
import { UploadedImage, GenerationResult, AppStatus, SceneItem, AspectRatio, ImageSize, SubjectConfig, RetouchConfig, EnhancementConfig, BackgroundConfig } from './types';
import { generateCinematicImage } from './services/geminiService';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { PromptInput } from './components/PromptInput';
import { ResultView } from './components/ResultView';
import { ItemRefiner } from './components/ItemRefiner';
import { SettingsPanel } from './components/SettingsPanel';
import { SubjectLab } from './components/SubjectLab';
import { PostProductionPanel } from './components/PostProductionPanel';
import { EnhancementPanel } from './components/EnhancementPanel';
import { BackgroundLab } from './components/BackgroundLab';

const DEFAULT_PROMPT = `Use the uploaded images strictly as references for the subjects. Preserve their identities, facial features, expressions, poses, skin tones, hairstyles, clothing patterns, and proportions exactly. 

A romantic, cinematic scene of the couple holding hands while walking through a lush garden walkway. The couple is captured from behind, mid-stride, walking forward confidently. Both gently turn their heads back toward the camera, making soft eye contact, while their bodies remain facing forward. The garden walkway is lined with manicured greenery, flowering plants, and elegant stone or tiled paths. Warm natural lighting, soft sunlight filtering through leaves, creating a dreamy glow. The atmosphere feels peaceful, intimate, and timeless. 

High realism, cinematic depth of field, natural skin tones, luxury lifestyle photography style, ultra-detailed, 4K quality, professional lens.`;

const App: React.FC = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [bgImages, setBgImages] = useState<UploadedImage[]>([]);
  const [sceneItems, setSceneItems] = useState<SceneItem[]>([
    { id: '1', label: 'Santa hat', action: 'add' }
  ]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("3:4");
  const [imageSize, setImageSize] = useState<ImageSize>("1K");
  const [subjectConfig, setSubjectConfig] = useState<SubjectConfig>({
    angle: "Default",
    faceRefinement: true,
    skinDetail: true,
    lightingMatch: true,
    backgroundFidelity: true,
    sessionIntegrity: true
  });
  const [backgroundConfig, setBackgroundConfig] = useState<BackgroundConfig>({
    removeBackground: false,
    neutralizeBackground: false
  });
  const [retouchConfig, setRetouchConfig] = useState<RetouchConfig>({
    grade: "Natural",
    intensity: "Medium",
    backgroundHarmonization: true,
    eyeEnhancement: true
  });
  const [enhancementConfig, setEnhancementConfig] = useState<EnhancementConfig>({
    upscale: true,
    removeArtifacts: true,
    hyperrealism: true
  });
  
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkApiKeyAndGenerate = async () => {
    if (images.length === 0) {
      setError("Please upload at least one subject reference image.");
      return;
    }

    try {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        setStatus(AppStatus.NEEDS_KEY);
        return;
      }
      handleGenerate();
    } catch (err) {
      handleGenerate();
    }
  };

  const handleOpenKeySelection = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    handleGenerate();
  };

  const handleGenerate = async (isEnhance: boolean = false) => {
    if (isEnhance) setStatus(AppStatus.UPSCALING);
    else setStatus(AppStatus.GENERATING);
    
    setError(null);

    let dynamicPrompt = prompt;

    if (sceneItems.length > 0) {
      const refinements = sceneItems.map(item => {
        switch(item.action) {
          case 'add': return `ADD: ${item.label}`;
          case 'remove': return `REMOVE/ERASE: ${item.label}`;
          case 'modify': return `MODIFY/EDIT: ${item.label}`;
          case 'generate_similar': return `GENERATE A CREATIVE VARIATION OF: ${item.label} (Make it look similar but with an artistic twist)`;
          default: return `PRESERVE: ${item.label}`;
        }
      }).join(', ');
      dynamicPrompt += `\n\nSPECIFIC REFINEMENTS TO APPLY: ${refinements}. Ensure these changes look natural and professional.`;
    }

    if (bgImages.length > 0 && !backgroundConfig.removeBackground && !backgroundConfig.neutralizeBackground) {
      dynamicPrompt += `\n\nCRITICAL: Use the additional environment reference images provided specifically to define the background scenery.`;
    }

    try {
      const sourceImages = isEnhance && result 
        ? [{ id: 'enhanced-base', data: result.imageUrl, mimeType: 'image/png' }] 
        : [...images, ...bgImages];

      const generationResult = await generateCinematicImage(sourceImages, dynamicPrompt, {
        aspectRatio,
        imageSize,
        subject: subjectConfig,
        background: backgroundConfig,
        retouch: retouchConfig,
        enhancement: enhancementConfig
      }, isEnhance);

      setResult(generationResult);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      if (err.message === "PRO_KEY_REQUIRED") {
        setStatus(AppStatus.NEEDS_KEY);
      } else {
        setError(err.message);
        setStatus(AppStatus.ERROR);
      }
    }
  };

  const handleEnhance = () => {
    if (!result) return;
    handleGenerate(true);
  };

  const useResultAsReference = () => {
    if (result) {
      const newRef: UploadedImage = {
        id: `gen-${Date.now()}`,
        data: result.imageUrl,
        mimeType: 'image/png'
      };
      setImages([newRef]);
      setResult(null);
      setStatus(AppStatus.IDLE);
    }
  };

  const reset = () => {
    setStatus(AppStatus.IDLE);
    setResult(null);
    setError(null);
    setImages([]);
    setBgImages([]);
    setAspectRatio("3:4");
    setImageSize("1K");
    setSubjectConfig({
      angle: "Default",
      faceRefinement: true,
      skinDetail: true,
      lightingMatch: true,
      backgroundFidelity: true,
      sessionIntegrity: true
    });
    setBackgroundConfig({
      removeBackground: false,
      neutralizeBackground: false
    });
    setRetouchConfig({
      grade: "Natural",
      intensity: "Medium",
      backgroundHarmonization: true,
      eyeEnhancement: true
    });
    setSceneItems([{ id: '1', label: 'Santa hat', action: 'add' }]);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex flex-col items-center pb-20">
      <Header />

      <main className="w-full max-w-7xl px-4 md:px-8 mt-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <section className="lg:col-span-5 space-y-6">
            {/* 1. Subjects */}
            <div className="glass-panel p-6 rounded-2xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <i className="fa-solid fa-user-group text-rose-500"></i>
                1. Subject References
              </h2>
              <ImageUploader 
                onUpload={(newImgs) => setImages(prev => [...prev, ...newImgs])} 
                images={images} 
                onRemove={(id) => setImages(prev => prev.filter(img => img.id !== id))} 
                label="Add Person"
              />
            </div>

            {/* 2. Subject Lab */}
            <div className="glass-panel p-6 rounded-2xl bg-rose-500/5 border-rose-500/20">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <i className="fa-solid fa-camera-retro text-rose-400"></i>
                2. Subject Lab & Angles
              </h2>
              <SubjectLab config={subjectConfig} onChange={setSubjectConfig} />
            </div>

            {/* 3. Retouching & Grading */}
            <div className="glass-panel p-6 rounded-2xl bg-indigo-500/5 border-indigo-500/20">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <i className="fa-solid fa-wand-sparkles text-indigo-400"></i>
                3. Retouch & Color Grading
              </h2>
              <PostProductionPanel config={retouchConfig} onChange={setRetouchConfig} />
            </div>

            {/* 4. Enhancement & Background Lab */}
            <div className="glass-panel p-6 rounded-2xl bg-amber-500/5 border-amber-500/20 space-y-6">
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <i className="fa-solid fa-arrow-up-right-dots text-amber-400"></i>
                4. Pro Enhancement Lab
              </h2>
              <BackgroundLab config={backgroundConfig} onChange={setBackgroundConfig} />
              <div className="pt-4 border-t border-white/5">
                <EnhancementPanel config={enhancementConfig} onChange={setEnhancementConfig} />
              </div>
            </div>

            {/* 5. Scene References */}
            <div className="glass-panel p-6 rounded-2xl bg-emerald-500/5 border-emerald-500/20">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <i className="fa-solid fa-mountain-sun text-emerald-400"></i>
                5. Scene References
              </h2>
              <ImageUploader 
                onUpload={(newImgs) => setBgImages(prev => [...prev, ...newImgs])} 
                images={bgImages} 
                onRemove={(id) => setBgImages(prev => prev.filter(img => img.id !== id))} 
                label="Add Scene"
              />
            </div>

            {/* 6. Studio Config */}
            <div className="glass-panel p-6 rounded-2xl bg-white/[0.02] border-white/5">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <i className="fa-solid fa-sliders text-gray-400"></i>
                6. Studio Config
              </h2>
              <SettingsPanel aspectRatio={aspectRatio} imageSize={imageSize} onAspectRatioChange={setAspectRatio} onImageSizeChange={setImageSize} />
            </div>

            {/* 7. Item Refinement */}
            <div className="glass-panel p-6 rounded-2xl bg-amber-500/5 border-amber-500/20">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <i className="fa-solid fa-list-check text-amber-500"></i>
                7. Creative Adjustments
              </h2>
              <ItemRefiner 
                items={sceneItems}
                onAdd={(label) => setSceneItems(prev => [...prev, { id: Date.now().toString(), label, action: 'add' }])}
                onRemove={(id) => setSceneItems(prev => prev.filter(item => item.id !== id))}
                onUpdateAction={(id, action) => setSceneItems(prev => prev.map(item => item.id === id ? { ...item, action } : item))}
              />
            </div>

            {/* 8. Narrative Prompt */}
            <div className="glass-panel p-6 rounded-2xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <i className="fa-solid fa-paragraph text-gray-400"></i>
                8. Scene Narrative
              </h2>
              <PromptInput value={prompt} onChange={setPrompt} disabled={status === AppStatus.GENERATING} />
            </div>

            {status === AppStatus.NEEDS_KEY ? (
              <div className="glass-panel p-6 rounded-2xl border-rose-500/40 bg-rose-500/5 space-y-4">
                <div className="flex items-center gap-3 text-rose-400">
                  <i className="fa-solid fa-key text-xl"></i>
                  <h3 className="font-bold">Pro Account Required</h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">Advanced extraction and 4K upscaling requires an authenticated API key.</p>
                <button onClick={handleOpenKeySelection} className="w-full py-4 bg-rose-600 hover:bg-rose-500 rounded-xl font-bold transition-all shadow-lg">
                  Select API Key
                </button>
              </div>
            ) : (
              <button
                onClick={checkApiKeyAndGenerate}
                disabled={status === AppStatus.GENERATING || status === AppStatus.UPSCALING || images.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 flex items-center justify-center gap-3
                  ${(status === AppStatus.GENERATING || status === AppStatus.UPSCALING)
                    ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
                    : (status === AppStatus.SUCCESS ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 shadow-lg')}
                `}
              >
                {status === AppStatus.GENERATING || status === AppStatus.UPSCALING ? (
                  <>
                    <i className="fa-solid fa-circle-notch animate-spin"></i>
                    {status === AppStatus.UPSCALING ? 'Enhancing Resolution...' : 'Synthesizing Session...'}
                  </>
                ) : (
                  <>
                    <i className={status === AppStatus.SUCCESS ? "fa-solid fa-arrows-rotate" : "fa-solid fa-wand-sparkles"}></i>
                    {status === AppStatus.SUCCESS ? 'Rework Masterpiece' : 'Generate Masterpiece'}
                  </>
                )}
              </button>
            )}

            {error && (
              <div className="bg-rose-900/30 border border-rose-500/50 p-4 rounded-xl text-rose-200 text-sm flex items-start gap-3">
                <i className="fa-solid fa-circle-exclamation mt-1"></i>
                <p>{error}</p>
              </div>
            )}
          </section>

          <section className="lg:col-span-7 lg:sticky lg:top-24">
            <ResultView 
              status={status} 
              result={result} 
              onReset={reset} 
              onUseAsReference={useResultAsReference} 
              onEnhance={handleEnhance} 
            />
          </section>
        </div>
      </main>
      
      <footer className="mt-16 text-gray-500 text-[10px] uppercase font-bold tracking-[0.2em] max-w-2xl text-center px-4 pb-12">
        <p>Vivid Engine 3.2 • Background Extraction Module • 4K Super Resolution</p>
      </footer>
    </div>
  );
};

export default App;
