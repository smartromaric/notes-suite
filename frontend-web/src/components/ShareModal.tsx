import React, { useState } from 'react';
import { X, User, ExternalLink, Mail, Send, Copy, Check } from 'lucide-react';
import { useNotes } from '../hooks/useNotes';
import type { Note } from '../types';

interface ShareModalProps {
  note: Note;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ note, onClose }) => {
  const { shareNote, shareNotePublic, isLoading } = useNotes();
  
  const [shareMode, setShareMode] = useState<'choose' | 'user' | 'public'>('choose');
  const [email, setEmail] = useState('');
  const [publicLink, setPublicLink] = useState<string | null>(null);
  const [copiedWeb, setCopiedWeb] = useState(false);
  const [copiedMobile, setCopiedMobile] = useState(false);

  const handleShareWithUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await shareNote({ noteId: note.id, email });
      onClose();
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleCreatePublicLink = async () => {
    try {
      const token = await shareNotePublic(note.id);
      setPublicLink(token);
    } catch (error) {
      // Error handled by hook
    }
  };

  const copyToClipboard = async (text: string, type: 'web' | 'mobile') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'web') {
        setCopiedWeb(true);
        setTimeout(() => setCopiedWeb(false), 2000);
      } else {
        setCopiedMobile(true);
        setTimeout(() => setCopiedMobile(false), 2000);
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Partager la note</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">"{note.title}"</p>
        </div>

        {/* Choose Mode */}
        {shareMode === 'choose' && (
          <div className="space-y-3">
            <button
              onClick={() => setShareMode('user')}
              className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <div className="font-medium text-gray-900">Partager avec un utilisateur</div>
                  <div className="text-sm text-gray-500">Partager avec un utilisateur spécifique par email</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setShareMode('public');
                handleCreatePublicLink();
              }}
              className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <ExternalLink className="w-5 h-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <div className="font-medium text-gray-900">Créer un lien public</div>
                  <div className="text-sm text-gray-500">Générer un lien public visible par tous</div>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Share with User Mode */}
        {shareMode === 'user' && (
          <form onSubmit={handleShareWithUser} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="user@example.com"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="flex justify-between space-x-3">
              <button
                type="button"
                onClick={() => setShareMode('choose')}
                className="btn-secondary flex-1"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Partage...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Send className="w-4 h-4 mr-2" />
                    Partager
                  </div>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Public Link Mode */}
        {shareMode === 'public' && (
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : publicLink ? (
              <>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <ExternalLink className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-800">Lien public créé avec succès !</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Toute personne avec ce lien peut voir votre note.
                  </p>
                </div>

                {/* Lien Web */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Lien Web (Navigateur)
                  </label>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 truncate flex-1 mr-2">
                        {`${window.location.origin}/p/${publicLink}`}
                      </span>
                      <button
                        onClick={() => copyToClipboard(`${window.location.origin}/p/${publicLink}`, 'web')}
                        className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Copier le lien web"
                      >
                        {copiedWeb ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {copiedWeb && (
                    <p className="text-xs text-green-600 mt-1">✓ Lien web copié !</p>
                  )}
                </div>

                {/* Lien Mobile/API */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Lien Mobile (Application)
                  </label>
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 truncate flex-1 mr-2">
                        {`${window.location.protocol}//${window.location.hostname}:9090/p/${publicLink}`}
                      </span>
                      <button
                        onClick={() => copyToClipboard(`${window.location.protocol}//${window.location.hostname}:9090/p/${publicLink}`, 'mobile')}
                        className="p-2 text-purple-600 hover:text-purple-800 rounded-lg hover:bg-purple-100 transition-colors"
                        title="Copier le lien mobile"
                      >
                        {copiedMobile ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {copiedMobile && (
                    <p className="text-xs text-green-600 mt-1">✓ Lien mobile copié !</p>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Échec de génération du lien public.</p>
                <button
                  onClick={handleCreatePublicLink}
                  className="btn-primary"
                >
                  Réessayer
                </button>
              </div>
            )}

            <div className="flex justify-between space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShareMode('choose');
                  setPublicLink(null);
                }}
                className="btn-secondary flex-1"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-primary flex-1"
              >
                Terminé
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareModal;
