import React from 'react';
import { ContentRecord } from '../types/content';
import { StarRating } from './StarRating';

interface ContentCardProps {
  record: ContentRecord;
  onClick: () => void;
}

export function ContentCard({ record, onClick }: ContentCardProps) {
  return (
    <div 
      onClick={onClick}
      className="notebook-paper p-4 cursor-pointer hover:shadow-lg transition-transform hover:-translate-y-1 h-full flex flex-col"
    >
      <div className="border-b-[2px] border-[#1e3a8a] pb-2 mb-2">
        <h3 className="font-bold text-lg text-gray-800 line-clamp-2" style={{ fontFamily: "var(--font-mono)" }}>
          {record.conteudo || 'Sem Título'}
        </h3>
      </div>
      <div className="flex-grow flex flex-col gap-1 text-sm text-gray-600">
        <p><span className="font-semibold text-xs uppercase">Criador:</span> {record.criador || '-'}</p>
        <p><span className="font-semibold text-xs uppercase">Plataforma:</span> {record.plataforma || '-'}</p>
        <p><span className="font-semibold text-xs uppercase">Formato:</span> {record.formato === 'Outros' ? record.formatoOutros : record.formato}</p>
        
        <div className="mt-2 text-xs">
          <StarRating rating={record.avaliacao} onRatingChange={() => {}} readOnly={true} />
        </div>
      </div>
      <div className="pt-3 border-t-2 border-[#1e3a8a] mt-3">
        <p className="text-xs text-right opacity-70">
          {new Date(record.data).toLocaleDateString('pt-BR')}
        </p>
      </div>
    </div>
  );
}
