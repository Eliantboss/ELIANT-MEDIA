
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { UploadedImage, GenerationResult, GenerationConfig } from "../types";

export const generateCinematicImage = async (
  images: UploadedImage[],
  prompt: string,
  config: GenerationConfig,
  isEnhancement: boolean = false
): Promise<GenerationResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const parts: any[] = images.map(img => ({
    inlineData: {
      data: img.data.split(',')[1],
      mimeType: img.mimeType
    }
  }));

  let detailedInstructions = prompt;
  
  if (isEnhancement) {
    detailedInstructions = `ACT AS A HIGH-END PHOTO RETOUCHER AND UPSCALER. 
    Use the provided image as a strict base.
    
    TASKS:
    ${config.enhancement?.upscale ? '- INCREASE RESOLUTION: Re-render this scene at the highest possible pixel density (4K), adding micro-details that were missing in lower resolutions.' : ''}
    ${config.enhancement?.removeArtifacts ? '- ARTIFACT REMOVAL: Detect and erase any AI-generated noise, blurry edges, or unnatural warping. Clean up the geometry of the subjects and background.' : ''}
    ${config.enhancement?.hyperrealism ? '- HYPERREALISM: Enhance the surface textures. Make eyes look liquid and reflective, skin show fine pores, and fabrics show individual threads. Ensure the lighting is physically accurate.' : ''}
    
    STRICT RULE: Do not change the composition, poses, or colors of the subjects. Only improve the quality, clarity, and realism.`;
  } else {
    // Background Overrides
    if (config.background?.removeBackground) {
      detailedInstructions = `STRICT SUBJECT CUTOUT: Ignore the environment description in the prompt. Place the subject(s) on a completely empty, pure white professional studio background. The focus is entirely on the subject without any surrounding elements.`;
    } else if (config.background?.neutralizeBackground) {
      detailedInstructions += `\n\nBACKGROUND NEUTRALIZATION: Simplify the environment significantly. Use a minimalist studio backdrop with very soft gradients or a clean, non-distracting architectural surface. The background should be purely supportive and not attract any attention away from the subject.`;
    }

    if (config.subject) {
      const s = config.subject;
      detailedInstructions += `\n\nADVANCED STUDIO PROTOCOL:`;
      if (s.angle !== "Default") detailedInstructions += `\n- PERSPECTIVE: Compose using a ${s.angle} angle.`;
      if (s.faceRefinement) detailedInstructions += `\n- FACE FIDELITY: Maintain 1:1 facial geometry.`;
      if (s.skinDetail) detailedInstructions += `\n- TEXTURE: Hyper-detailed skin with natural pores.`;
      if (s.lightingMatch) detailedInstructions += `\n- LIGHTING: Subjects must be lit by the environment's global illumination.`;
      if (!config.background?.removeBackground && s.backgroundFidelity) detailedInstructions += `\n- BACKGROUND QUALITY: Sharp, professional architectural and natural rendering.`;
      if (s.sessionIntegrity) detailedInstructions += `\n- SESSION INTEGRITY: No morphing between subject and background layers.`;
    }

    if (config.retouch) {
      const r = config.retouch;
      detailedInstructions += `\n\nPOST-PRODUCTION LAB:`;
      detailedInstructions += `\n- COLOR GRADE: Apply "${r.grade}" aesthetic.`;
      detailedInstructions += `\n- RETOUCHING: Apply "${r.intensity}" high-grade polishing.`;
      if (r.backgroundHarmonization && !config.background?.removeBackground) detailedInstructions += `\n- BACKGROUND ADJUSTMENT: Harmonize subjects with the background's color space and shadow tint.`;
    }
  }
  
  detailedInstructions += `\n\nULTIMATE GOAL: Produce a high-end RAW studio session photograph. Total photographic realism.`;

  parts.push({ text: detailedInstructions });

  try {
    const modelName = (config.imageSize === '2K' || config.imageSize === '4K' || isEnhancement) 
      ? 'gemini-3-pro-image-preview' 
      : 'gemini-2.5-flash-image';

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: config.aspectRatio,
          imageSize: isEnhancement ? '4K' : config.imageSize
        }
      }
    });

    let imageUrl = '';
    let textResponse = '';

    const candidates = response.candidates;
    if (candidates && candidates[0] && candidates[0].content && candidates[0].content.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        } else if (part.text) {
          textResponse += part.text;
        }
      }
    }

    if (!imageUrl) throw new Error("No image was generated.");

    return { imageUrl, textResponse, originalConfig: config };
  } catch (error: any) {
    if (error.message?.includes("Requested entity was not found")) throw new Error("PRO_KEY_REQUIRED");
    throw new Error(error.message || "Failed to generate image.");
  }
};
