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
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Share Note</h3>
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
                  <div className="font-medium text-gray-900">Share with User</div>
                  <div className="text-sm text-gray-500">Share with a specific user by email</div>
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
                  <div className="font-medium text-gray-900">Create Public Link</div>
                  <div className="text-sm text-gray-500">Generate a public link for anyone to view</div>
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
                Email Address
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
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sharing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Send className="w-4 h-4 mr-2" />
                    Share
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
                    <span className="text-sm font-medium text-green-800">Public link created successfully!</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Anyone with this link can view your note.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 truncate flex-1 mr-2">{publicLink}</span>
                    <button
                      onClick={copyToClipboard}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {copied && (
                  <p className="text-sm text-green-600 text-center">✓ Link copied to clipboard!</p>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Failed to generate public link.</p>
                <button
                  onClick={handleCreatePublicLink}
                  className="btn-primary"
                >
                  Try Again
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
                Back
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-primary flex-1"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareModal;
