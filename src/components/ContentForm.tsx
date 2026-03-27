'use client';

import React, { useState } from 'react';
import { ContentRecord, Formato } from '../types/content';
import { StarRating } from './StarRating';

interface ContentFormProps {
  initialData?: ContentRecord | null;
  onSave: (record: ContentRecord) => void;
  onCancel: () => void;
  readOnly?: boolean;
}

export function ContentForm({ initialData, onSave, onCancel, readOnly = false }: ContentFormProps) {
  const isEditing = !!initialData && !readOnly;
  
  const [formData, setFormData] = useState<Partial<ContentRecord>>(
    initialData || {
      conteudo: '',
      criador: '',
      plataforma: '',
      formato: 'Vídeo',
      formatoOutros: '',
      data: new Date().toISOString().split('T')[0], // today
      avaliacao: 0,
      resenha: '',
      obs: '',
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (readOnly) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormatChange = (format: Formato) => {
    if (readOnly) return;
    setFormData((prev) => ({ ...prev, formato: format }));
  };

  const handleRatingChange = (rating: number) => {
    if (readOnly) return;
    setFormData((prev) => ({ ...prev, avaliacao: rating }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;
    
    const newRecord: ContentRecord = {
      ...(formData as ContentRecord),
      id: initialData?.id || crypto.randomUUID(),
    };
    onSave(newRecord);
  };

  const inputStyle = `bg-transparent focus:border-[#1e3a8a] outline-none ${readOnly ? 'ink-text font-semibold resize-none' : 'text-gray-800'}`;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto notebook-paper shadow-xl text-sm sm:text-base selection:bg-blue-200">
      
      {/* HEADER */}
      <div className="border-b-[2px] border-[#1e3a8a] py-2 text-center px-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-wider" style={{ fontFamily: "var(--font-mono)", color: '#000' }}>
          Registro de Conteúdo
        </h1>
      </div>

      {/* ROW 1: Conteudo, Criador, Plataforma */}
      <div className="border-b-2 border-[#1e3a8a] p-2 sm:p-3 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4">
        <div className="sm:col-span-6 flex flex-col">
          <label className="font-semibold mb-1 text-[10px] sm:text-xs uppercase tracking-wide">Conteúdo:</label>
          <input 
            type="text" 
            name="conteudo"
            value={formData.conteudo || ''}
            onChange={handleChange}
            readOnly={readOnly}
            placeholder="Ex: Filmes pra quem acha a vida sem graça"
            className={`${inputStyle} w-full text-sm`}
            required
          />
        </div>
        <div className="sm:col-span-3 flex flex-col">
          <label className="font-semibold mb-1 text-[10px] sm:text-xs uppercase tracking-wide">Criador:</label>
          <input 
            type="text" 
            name="criador"
            value={formData.criador || ''}
            onChange={handleChange}
            readOnly={readOnly}
            placeholder="Ex: Cinevic"
            className={`${inputStyle} w-full text-sm`}
          />
        </div>
        <div className="sm:col-span-3 flex flex-col">
          <label className="font-semibold mb-1 text-[10px] sm:text-xs uppercase tracking-wide">Plataforma:</label>
          <input 
            type="text" 
            name="plataforma"
            value={formData.plataforma || ''}
            onChange={handleChange}
            readOnly={readOnly}
            placeholder="Ex: YouTube"
            className={`${inputStyle} w-full text-sm`}
          />
        </div>
      </div>

      {/* ROW 2: Formato and Data */}
      <div className="border-b-2 border-[#1e3a8a] p-2 sm:p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {(['Vídeo', 'Texto', 'Podcast', 'Outros'] as Formato[]).map((fmt) => (
            <div key={fmt} className="flex items-center gap-1 cursor-pointer" onClick={() => handleFormatChange(fmt)}>
              <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 border-[1.5px] border-[#1e3a8a] flex items-center justify-center ${formData.formato === fmt ? 'bg-transparent' : 'bg-transparent'}`}>
                {formData.formato === fmt && (
                  <div className="w-2 h-2 sm:w-2 bg-[#1e3a8a]" style={{ clipPath: 'polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%)' }} />
                )}
              </div>
              <span className="font-medium text-xs sm:text-sm">{fmt === 'Outros' ? '' : fmt}</span>
              {fmt === 'Outros' && (
                <input
                  type="text"
                  name="formatoOutros"
                  value={formData.formatoOutros || ''}
                  onChange={handleChange}
                  readOnly={readOnly || formData.formato !== 'Outros'}
                  className={`${inputStyle} w-20 sm:w-24 ml-1 text-sm`}
                  placeholder="Outros"
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <label className="font-semibold text-[10px] sm:text-xs uppercase tracking-wide">Data:</label>
          <input 
            type="date" 
            name="data"
            value={formData.data || ''}
            onChange={handleChange}
            readOnly={readOnly}
            className={`${inputStyle} pb-1 ink-text text-sm`}
            required
          />
        </div>
      </div>

      {/* ROW 3: Avaliação */}
      <div className="p-2 sm:p-3 pb-0 flex items-center gap-2">
        <label className="font-semibold text-xs sm:text-sm">Avaliação:</label>
        <StarRating 
          rating={formData.avaliacao || 0} 
          onRatingChange={handleRatingChange}
          readOnly={readOnly}
        />
      </div>

      {/* ROW 4: Resenha */}
      <div className="p-2 sm:p-3 flex flex-col flex-grow">
        <label className="font-semibold mb-1 text-[10px] sm:text-xs">Resenha:</label>
        <textarea 
          name="resenha"
          value={formData.resenha || ''}
          onChange={handleChange}
          readOnly={readOnly}
          className={`${inputStyle} w-full h-32 sm:h-48 bg-transparent outline-none leading-[28px] text-sm`}
          style={{ 
            backgroundImage: 'linear-gradient(#1e3a8a20 1px, transparent 1px)',
            backgroundSize: '100% 28px',
          }}
          placeholder={readOnly ? "" : "Escreva sua resenha ou reflexões aqui..."}
        />
      </div>

      {/* ROW 5: Obs */}
      <div className="border-t-2 border-[#1e3a8a] p-2 sm:p-3 bg-gray-50/50">
        <div className="flex items-start gap-2">
          <label className="font-semibold text-[10px] sm:text-xs mt-1">Obs.:</label>
          <textarea 
            name="obs"
            value={formData.obs || ''}
            onChange={handleChange}
            readOnly={readOnly}
            // rows={1} 
            style={{ 
              backgroundImage: 'linear-gradient(#1e3a8a20 1px, transparent 1px)',
              backgroundSize: '100% 28px',
            }}
            className={`${inputStyle} w-full h-16 bg-transparent resize-none leading-relaxed 
            text-sm`}
            placeholder={readOnly ? "" : "Alguma observação extra?"}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-3 flex justify-end gap-2 print:hidden">
        <button 
          type="button" 
          onClick={onCancel}
          className="px-4 py-1.5 rounded-md font-semibold text-xs sm:text-sm text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          {readOnly ? 'Voltar' : 'Cancelar'}
        </button>
        {!readOnly && (
          <button 
            type="submit"
            className="px-4 py-1.5 rounded-md font-semibold text-xs sm:text-sm text-white bg-blue-700 hover:bg-blue-800 transition-colors shadow-md"
          >
            {isEditing ? 'Atualizar' : 'Salvar Registro'}
          </button>
        )}
      </div>

    </form>
  );
}
