import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNotes } from '../hooks/useNotes';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { NoteDetailSkeleton } from '../components/Skeleton';

const PublicNotePage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { publicNote, getPublicNote, isLoading } = useNotes();

  useEffect(() => {
    if (token) {
      getPublicNote(token);
    }
  }, [token, getPublicNote]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <NoteDetailSkeleton />
        </main>
      </div>
    );
  }

  if (!publicNote) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Note non trouvée</h1>
          <p className="text-gray-500">Cette note publique a peut-être été supprimée ou le lien est invalide.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{publicNote.title}</h1>
            <div className="flex items-center text-sm text-gray-500">
              <span>Par {publicNote.owner.name}</span>
              <span className="mx-2">•</span>
              <span>{new Date(publicNote.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>

          <div className="p-6">
            <MarkdownRenderer content={publicNote.contentMd} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicNotePage;
