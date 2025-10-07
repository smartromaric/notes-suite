import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';
import { useNotes } from '../hooks/useNotes';
import MarkdownEditor from '../components/MarkdownEditor';
import MarkdownRenderer from '../components/MarkdownRenderer';
import type { CreateNoteRequest, UpdateNoteRequest } from '../types';

const CreateEditNotePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notes, createNote, updateNote, isLoading } = useNotes();
  
  const isEditing = !!id && id !== 'new';
  const note = isEditing ? notes.find(n => n.id === parseInt(id)) : null;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'PRIVATE' | 'SHARED' | 'PUBLIC'>('PRIVATE');
  const [tags, setTags] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.contentMd);
      setVisibility(note.visibility);
      setTags(note.tags.map(t => t.label).join(', '));
    }
  }, [note]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    
    try {
      if (isEditing && note) {
        const updateData: UpdateNoteRequest = {
          id: note.id,
          title: title.trim(),
          contentMd: content.trim(),
          visibility,
          tags: tagsArray,
        };
        await updateNote(updateData);
      } else {
        const createData: CreateNoteRequest = {
          title: title.trim(),
          contentMd: content.trim(),
          visibility,
          tags: tagsArray,
        };
        await createNote(createData);
      }
      navigate('/dashboard');
    } catch (error) {
      // Error handled by hook
    }
  };

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
              <h1 className="text-xl font-semibold text-gray-900">
                {isEditing ? 'Edit Note' : 'Create Note'}
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Title */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                placeholder="Enter note title..."
                required
              />
            </div>

            {/* Visibility */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visibility
              </label>
              <div className="flex space-x-4">
                {[
                  { value: 'PRIVATE', label: 'Private', color: 'bg-gray-100 text-gray-800' },
                  { value: 'SHARED', label: 'Shared', color: 'bg-blue-100 text-blue-800' },
                  { value: 'PUBLIC', label: 'Public', color: 'bg-green-100 text-green-800' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="visibility"
                      value={option.value}
                      checked={visibility === option.value}
                      onChange={(e) => setVisibility(e.target.value as any)}
                      className="sr-only"
                    />
                    <span
                      className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                        visibility === option.value
                          ? option.color
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="input-field"
                placeholder="Enter tags separated by commas..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Separate multiple tags with commas
              </p>
            </div>

            {/* Content */}
            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              {showPreview ? (
                <div className="border border-gray-300 rounded-lg p-6 min-h-[400px] bg-white">
                  <MarkdownRenderer content={content} />
                </div>
              ) : (
                <MarkdownEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write your note content here using Markdown..."
                />
              )}
              <p className="text-sm text-gray-500 mt-1">
                Supports full Markdown syntax with live preview
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <Link to="/dashboard" className="btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading || !title.trim() || !content.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? 'Update Note' : 'Create Note'}
                  </div>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateEditNotePage;
