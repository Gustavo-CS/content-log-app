'use client';

import React, { useEffect, useState } from 'react';
import { ContentRecord } from '../types/content';
import { ContentForm } from '../components/ContentForm';
import { ContentCard } from '../components/ContentCard';

export default function Home() {
  const [records, setRecords] = useState<ContentRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<ContentRecord | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedRecords = localStorage.getItem('contentRecords');
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords));
      } catch {
        console.error('Failed to parse records');
      }
    }
  }, []);

  const saveToStorage = (newRecords: ContentRecord[]) => {
    localStorage.setItem('contentRecords', JSON.stringify(newRecords));
    setRecords(newRecords);
  };

  const handleSave = (record: ContentRecord) => {
    const existingIndex = records.findIndex(r => r.id === record.id);
    let updatedRecords = [...records];
    
    if (existingIndex >= 0) {
      updatedRecords[existingIndex] = record;
    } else {
      updatedRecords = [record, ...updatedRecords];
    }
    
    saveToStorage(updatedRecords);
    setIsCreating(false);
    setSelectedRecord(null); // Just going back to grid after save
  };

  const handleDelete = (id: string) => {
    const updatedRecords = records.filter(r => r.id !== id);
    saveToStorage(updatedRecords);
    setSelectedRecord(null);
  };

  // Prevent SSR mismatch on simple data load
  if (!isClient) {
    return null;
  }

  // Viewing a specific record
  if (selectedRecord && !isCreating) {
    return (
      <main className="min-h-screen p-2 sm:p-4 lg:p-8 flex items-start justify-center pt-6 sm:pt-10">
        <div className="w-full max-w-4xl relative group">
          <ContentForm 
            initialData={selectedRecord} 
            readOnly={true} 
            onSave={() => {}} // No-op, we'll edit via another button if needed
            onCancel={() => setSelectedRecord(null)}
          />
          <div className="absolute top-2 right-2 flex gap-2 print:hidden z-10 transition-opacity">
            <button 
              onClick={() => { setIsCreating(true); }}
              className="bg-blue-600 text-white px-3 py-1 rounded shadow text-sm hover:bg-blue-700 font-bold"
            >
              Editar
            </button>
            <button 
              onClick={() => {
                if(confirm('Tem certeza que deseja excluir este registro?')) {
                  handleDelete(selectedRecord.id);
                }
              }}
              className="bg-red-500 text-white px-3 py-1 rounded shadow text-sm hover:bg-red-600 font-bold"
            >
              Excluir
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Creating a new record or editing an existing one
  if (isCreating) {
    return (
      <main className="min-h-screen p-2 sm:p-4 lg:p-8 flex items-start justify-center pt-6 sm:pt-10">
        <ContentForm 
          initialData={selectedRecord} // Passes data if editing, null if creating
          onSave={handleSave} 
          onCancel={() => {
            setIsCreating(false);
            if (!selectedRecord) {
              // Only cancel completely if creating new. If editing, we just go back to read view
              // actually this boolean approach works fine either way
            }
          }}
        />
      </main>
    );
  }

  // Initial View (Grid)
  return (
    <main className="min-h-screen bg-[#eaeefe] p-4 sm:p-12 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-slate-300 pb-4">
          <h1 className="text-3xl font-bold tracking-tight text-gray-800" style={{ fontFamily: "var(--font-mono)" }}>
            Meus Registros
          </h1>
          <button 
            onClick={() => {
              setSelectedRecord(null);
              setIsCreating(true);
            }}
            className="flex items-center gap-2 bg-[#1e3a8a] text-white px-5 py-2.5 rounded-md hover:bg-blue-800 transition shadow font-bold tracking-wide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Novo Registro
          </button>
        </header>
        
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-60 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4 text-[#1e3a8a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-xl">Nenhum registro ainda.</p>
            <p className="mt-2">Clique em &quot;Novo Registro&quot; para começar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {records.map(r => (
              <ContentCard 
                key={r.id} 
                record={r} 
                onClick={() => setSelectedRecord(r)} 
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
