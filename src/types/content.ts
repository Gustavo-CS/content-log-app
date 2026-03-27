export type Formato = 'Vídeo' | 'Texto' | 'Podcast' | 'Outros';

export interface ContentRecord {
  id: string;
  conteudo: string;
  criador: string;
  plataforma: string;
  formato: Formato;
  formatoOutros?: string;
  data: string; // format: YYYY-MM-DD
  avaliacao: number; // 1 to 5 stars
  resenha: string;
  obs: string;
}
