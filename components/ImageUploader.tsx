
import React from 'react';
import { UploadedImage } from '../types';

interface ImageUploaderProps {
  onUpload: (images: UploadedImage[]) => void;
  images: UploadedImage[];
  onRemove: (id: string) => void;
  label?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, images, onRemove, label = "Add Photo" }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload([{
          id: Math.random().toString(36).substring(2, 11),
          data: reader.result as string,
          mimeType: file.type
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {images.map(img => (
          <div key={img.id} className="relative group w-24 h-24">
            <img 
              src={img.data} 
              alt="Uploaded reference" 
              className="w-full h-full object-cover rounded-lg border border-white/10"
            />
            <button
              onClick={() => onRemove(img.id)}
              className="absolute -top-2 -right-2 bg-rose-600 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
            >
              <i className="fa-solid fa-xmark text-xs"></i>
            </button>
          </div>
        ))}
        
        {images.length < 10 && (
          <label className="w-24 h-24 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/10 hover:border-indigo-500/50 hover:bg-white/5 cursor-pointer transition-all active:scale-95">
            <i className="fa-solid fa-plus text-gray-500 mb-1"></i>
            <span className="text-[10px] text-gray-500 uppercase font-bold text-center px-1">{label}</span>
            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" multiple />
          </label>
        )}
      </div>
    </div>
  );
};
