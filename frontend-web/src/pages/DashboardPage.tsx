import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  LogOut, 
  User, 
  Calendar, 
  Tag, 
  Eye, 
  EyeOff, 
  Share2,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotes } from '../hooks/useNotes';
import ShareModal from '../components/ShareModal';
import type { Note } from '../types';

const DashboardPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [visibilityFilter, setVisibilityFilter] = useState<'ALL' | 'PRIVATE' | 'SHARED' | 'PUBLIC'>('ALL');
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  
  const { user, logout } = useAuth();
  const { 
    notes,
    filteredNotes, 
    isLoading, 
    loadNotes, 
    deleteNote, 
    getAllTags,
    searchNotes,
    filterByTags,
    filterByVisibility 
  } = useNotes();
  const navigate = useNavigate();

  useEffect(() => {
    // Load notes with filters
    const params: any = {};
    
    if (searchQuery.trim()) {
      params.query = searchQuery.trim();
    }
    
    if (selectedTags.length > 0) {
      params.tag = selectedTags[0]; // Backend accepts single tag for now
    }
    
    if (visibilityFilter !== 'ALL') {
      params.visibility = visibilityFilter;
    }
    
    loadNotes(params);
  }, [searchQuery, selectedTags, visibilityFilter, loadNotes]);

  const handleDeleteNote = async (noteId: number) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(noteId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'PRIVATE':
        return <EyeOff className="w-4 h-4 text-gray-500" />;
      case 'SHARED':
        return <Share2 className="w-4 h-4 text-blue-500" />;
      case 'PUBLIC':
        return <Eye className="w-4 h-4 text-green-500" />;
      default:
        return <EyeOff className="w-4 h-4 text-gray-500" />;
    }
  };

  const allTags = getAllTags();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">Notes Suite</h1>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-lg hover:bg-gray-100 ${
                    selectedTags.length > 0 || visibilityFilter !== 'ALL' || searchQuery
                      ? 'text-primary-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Filter className="w-5 h-5" />
                </button>
                {(selectedTags.length > 0 || visibilityFilter !== 'ALL' || searchQuery) && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-600 rounded-full"></span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tags Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        if (selectedTags.includes(tag)) {
                          setSelectedTags(selectedTags.filter(t => t !== tag));
                        } else {
                          setSelectedTags([...selectedTags, tag]);
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-primary-100 text-primary-800 border border-primary-200'
                          : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      <Tag className="w-3 h-3 inline mr-1" />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visibility Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                <select
                  value={visibilityFilter}
                  onChange={(e) => setVisibilityFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="ALL">All Notes</option>
                  <option value="PRIVATE">Private</option>
                  <option value="SHARED">Shared</option>
                  <option value="PUBLIC">Public</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedTags([]);
                    setVisibilityFilter('ALL');
                    setSearchQuery('');
                    loadNotes({});
                  }}
                  className="btn-secondary"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <User className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {searchQuery || selectedTags.length > 0 || visibilityFilter !== 'ALL' ? 'Results' : 'Total Notes'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{notes.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Public</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notes.filter(n => n.visibility === 'PUBLIC').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Share2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Shared</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notes.filter(n => n.visibility === 'SHARED').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Tag className="w-6 h-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tags</p>
                <p className="text-2xl font-bold text-gray-900">{allTags.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first note.</p>
            <Link to="/notes/new" className="btn-primary">
              <Plus className="w-5 h-5 mr-2" />
              Create Note
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div key={note.id} className="note-card group">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {note.title}
                  </h3>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => navigate(`/notes/${note.id}/edit`)}
                      className="p-1 text-gray-400 hover:text-primary-600 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {note.contentMd.replace(/[#*`]/g, '').substring(0, 150)}...
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(note.updatedAt)}
                  </div>
                  <div className="flex items-center">
                    {getVisibilityIcon(note.visibility)}
                    <span className="ml-1 capitalize">{note.visibility.toLowerCase()}</span>
                  </div>
                </div>

                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {note.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.id}
                        className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                      >
                        {tag.label}
                      </span>
                    ))}
                    {note.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{note.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => navigate(`/notes/${note.id}`)}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    Read more →
                  </button>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNote(note);
                        setShowShareModal(true);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 rounded"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <Link
        to="/notes/new"
        className="fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Plus className="w-6 h-6" />
      </Link>

      {/* Share Modal */}
      {showShareModal && selectedNote && (
        <ShareModal
          note={selectedNote}
          onClose={() => {
            setShowShareModal(false);
            setSelectedNote(null);
          }}
        />
      )}
    </div>
  );
};

export default DashboardPage;
