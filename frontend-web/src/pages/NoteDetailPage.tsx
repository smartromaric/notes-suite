import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Share2, 
  Trash2, 
  Calendar, 
  User, 
  Tag, 
  Eye, 
  EyeOff,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useNotes } from '../hooks/useNotes';
import { useAuth } from '../hooks/useAuth';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { NoteDetailSkeleton } from '../components/Skeleton';

const NoteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notes, deleteNote, shareNotePublic, isLoading } = useNotes();
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [publicLink, setPublicLink] = useState<string | null>(null);

  const note = notes.find(n => n.id === parseInt(id || '0'));

  useEffect(() => {
    if (!note && !isLoading) {
      navigate('/dashboard');
    }
  }, [note, isLoading, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      await deleteNote(parseInt(id || '0'));
      navigate('/dashboard');
    }
  };

  const handleShare = () => {
    setShowShareOptions(true);
  };

  const handleCreatePublicLink = async () => {
    try {
      const token = await shareNotePublic(parseInt(id || '0'));
      const link = `${window.location.origin}/p/${token}`;
      setPublicLink(link);
    } catch (error) {
      // Error handled by hook
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'PRIVATE':
        return <EyeOff className="w-5 h-5 text-gray-500" />;
      case 'SHARED':
        return <Share2 className="w-5 h-5 text-blue-500" />;
      case 'PUBLIC':
        return <Eye className="w-5 h-5 text-green-500" />;
      default:
        return <EyeOff className="w-5 h-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-xl font-semibold text-gray-900">Détails de la note</h1>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <NoteDetailSkeleton />
        </main>
      </div>
    );
  }

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
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Détails de la note</h1>
          </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate(`/notes/${note.id}/edit`)}
                className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-100"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Note Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{note.title}</h1>
              <div className="flex items-center space-x-2">
                {getVisibilityIcon(note.visibility)}
                <span className="text-sm font-medium text-gray-600 capitalize">
                  {note.visibility.toLowerCase()}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>{note.owner.name}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Créée le {formatDate(note.createdAt)}</span>
              </div>
              {note.updatedAt !== note.createdAt && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Modifiée le {formatDate(note.updatedAt)}</span>
                </div>
              )}
            </div>

            {note.tags.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center mb-2">
                  <Tag className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Note Content */}
          <div className="p-6">
            <MarkdownRenderer content={note.contentMd} />
          </div>
        </div>
      </main>

      {/* Share Modal */}
      {showShareOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Partager la note</h3>
            
            <div className="space-y-4">
              <button
                onClick={() => navigate(`/notes/${note.id}/share`)}
                className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-3 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-900">Partager avec un utilisateur</div>
                    <div className="text-sm text-gray-500">Partager avec un utilisateur spécifique par email</div>
                  </div>
                </div>
              </button>

              <button
                onClick={handleCreatePublicLink}
                className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <ExternalLink className="w-5 h-5 mr-3 text-green-500" />
                  <div>
                    <div className="font-medium text-gray-900">Créer un lien public</div>
                    <div className="text-sm text-gray-500">Générer un lien public visible par tous</div>
                  </div>
                </div>
              </button>
            </div>

            {publicLink && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate flex-1 mr-2">{publicLink}</span>
                  <button
                    onClick={() => copyToClipboard(publicLink)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowShareOptions(false);
                  setPublicLink(null);
                }}
                className="btn-secondary"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteDetailPage;
