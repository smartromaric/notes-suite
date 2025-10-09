import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Copy, ExternalLink, Check } from 'lucide-react';
import { useNotes } from '../hooks/useNotes';

const SharePublicPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { notes, shareNotePublic, isLoading } = useNotes();
  
  const note = notes.find(n => n.id === parseInt(id || '0'));
  const [publicLink, setPublicLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (note) {
      generatePublicLink();
    }
  }, [note]);

  const generatePublicLink = async () => {
    try {
      const token = await shareNotePublic(parseInt(id || '0'));
      const link = `${window.location.origin}/p/${token}`;
      setPublicLink(link);
    } catch (error) {
      // Error handled by hook
    }
  };

  const copyToClipboard = async () => {
    if (publicLink) {
      try {
        await navigator.clipboard.writeText(publicLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    }
  };

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Note non trouvée</h1>
          <Link to="/dashboard" className="btn-primary">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              to={`/notes/${id}`}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Lien public</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{note.title}</h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : publicLink ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <ExternalLink className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">Lien public créé avec succès !</span>
                </div>
                <p className="text-sm text-green-700">
                  Toute personne avec ce lien peut voir votre note.
                </p>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate flex-1 mr-2">{publicLink}</span>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {copied && (
                <p className="text-sm text-green-600 text-center">Lien copié dans le presse-papiers !</p>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Échec de génération du lien public. Veuillez réessayer.</p>
              <button
                onClick={generatePublicLink}
                className="btn-primary mt-4"
              >
                Réessayer
              </button>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Link to={`/notes/${id}`} className="btn-secondary">
              Retour à la note
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SharePublicPage;
