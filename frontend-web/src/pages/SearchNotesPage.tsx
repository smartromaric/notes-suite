import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Search, Tag, Eye, EyeOff, Share2 } from 'lucide-react';
import { useNotes } from '../hooks/useNotes';

const SearchNotesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [visibilityFilter, setVisibilityFilter] = useState<'ALL' | 'PRIVATE' | 'SHARED' | 'PUBLIC'>('ALL');
  
  const { 
    filteredNotes, 
    isLoading, 
    loadNotes, 
    getAllTags,
    setSearchParams 
  } = useNotes();
  const navigate = useNavigate();

  useEffect(() => {
    loadNotes({});
  }, [loadNotes]);

  const handleSearch = () => {
    const params: any = {};
    
    if (searchQuery.trim()) {
      params.query = searchQuery.trim();
    }
    
    if (selectedTags.length > 0) {
      params.tag = selectedTags[0]; // Backend accepts single tag
    }
    
    if (visibilityFilter !== 'ALL') {
      params.visibility = visibilityFilter;
    }
    
    loadNotes(params);
  };

  const allTags = getAllTags();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Search Notes</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="space-y-6">
            {/* Search Query */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Query
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Search in title and content..."
                />
              </div>
            </div>

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
                className="input-field"
              >
                <option value="ALL">All Notes</option>
                <option value="PRIVATE">Private</option>
                <option value="SHARED">Shared</option>
                <option value="PUBLIC">Public</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSearch}
                className="btn-primary"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
            <p className="text-gray-500">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Search Results ({filteredNotes.length})
              </h2>
            </div>

            <div className="space-y-4">
              {filteredNotes.map((note) => (
                <div key={note.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                      <Link to={`/notes/${note.id}`}>{note.title}</Link>
                    </h3>
                    <div className="flex items-center space-x-2">
                      {getVisibilityIcon(note.visibility)}
                      <span className="text-sm text-gray-500 capitalize">
                        {note.visibility.toLowerCase()}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {note.contentMd.replace(/[#*`]/g, '').substring(0, 200)}...
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>By {note.owner.name}</span>
                      <span>•</span>
                      <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                    </div>
                    {note.tags.length > 0 && (
                      <div className="flex space-x-1">
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
                            +{note.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchNotesPage;
