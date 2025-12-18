
import React, { useState } from 'react';
import { SceneItem } from '../types';

interface ItemRefinerProps {
  items: SceneItem[];
  onAdd: (label: string) => void;
  onRemove: (id: string) => void;
  onUpdateAction: (id: string, action: SceneItem['action']) => void;
}

export const ItemRefiner: React.FC<ItemRefinerProps> = ({ items, onAdd, onRemove, onUpdateAction }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="e.g. Add Sunglasses, Change hat to Crown..."
          className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50"
        />
        <button 
          type="submit"
          className="bg-amber-600/20 text-amber-400 border border-amber-500/30 px-3 rounded-lg hover:bg-amber-600/30 transition-all"
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full pl-3 pr-1 py-1 group animate-in zoom-in-95 duration-200"
          >
            <span className="text-xs font-medium text-gray-300">{item.label}</span>
            <select
              value={item.action}
              onChange={(e) => onUpdateAction(item.id, e.target.value as SceneItem['action'])}
              className="bg-transparent text-[10px] text-amber-500 font-bold uppercase cursor-pointer outline-none border-none focus:ring-0"
            >
              <option value="add">Add</option>
              <option value="modify">Edit</option>
              <option value="generate_similar">Similar</option>
              <option value="remove">Remove</option>
              <option value="preserve">Keep</option>
            </select>
            <button 
              onClick={() => onRemove(item.id)}
              className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-rose-500/20 text-gray-500 hover:text-rose-500 transition-all"
            >
              <i className="fa-solid fa-xmark text-[10px]"></i>
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest italic py-2">No specific refinements added</p>
        )}
      </div>
    </div>
  );
};
