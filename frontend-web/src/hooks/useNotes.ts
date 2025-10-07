import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import type { RootState, AppDispatch } from '../store';
import {
  loadNotes,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
  shareNotePublic,
  getPublicNote,
  setSearchQuery,
  setSelectedTags,
  setVisibilityFilter,
  clearError,
  setCurrentSearch,
  clearSearch,
  clearPublicNote,
} from '../store/notes/notesSlice';
import type { CreateNoteRequest, UpdateNoteRequest, ShareNoteRequest, SearchParams } from '../types';

export const useNotes = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    notes,
    filteredNotes,
    publicNote,
    searchQuery,
    selectedTags,
    visibilityFilter,
    currentSearch,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.notes);

  // Load notes
  const loadNotesData = useCallback(async (params: SearchParams) => {
    try {
      await dispatch(loadNotes(params)).unwrap();
    } catch (error: any) {
      toast.error(error || 'Erreur lors du chargement des notes');
      throw error;
    }
  }, [dispatch]);

  // Create note
  const createNoteData = useCallback(async (noteData: CreateNoteRequest) => {
    try {
      const result = await dispatch(createNote(noteData)).unwrap();
      toast.success('Note créée avec succès !');
      return result;
    } catch (error: any) {
      toast.error(error || 'Erreur lors de la création de la note');
      throw error;
    }
  }, [dispatch]);

  // Update note
  const updateNoteData = useCallback(async (noteData: UpdateNoteRequest) => {
    try {
      const result = await dispatch(updateNote(noteData)).unwrap();
      toast.success('Note mise à jour avec succès !');
      return result;
    } catch (error: any) {
      toast.error(error || 'Erreur lors de la mise à jour de la note');
      throw error;
    }
  }, [dispatch]);

  // Delete note
  const deleteNoteData = useCallback(async (noteId: number) => {
    try {
      await dispatch(deleteNote(noteId)).unwrap();
      toast.success('Note supprimée avec succès !');
    } catch (error: any) {
      toast.error(error || 'Erreur lors de la suppression de la note');
      throw error;
    }
  }, [dispatch]);

  // Share note
  const shareNoteData = useCallback(async (shareData: ShareNoteRequest) => {
    try {
      await dispatch(shareNote(shareData)).unwrap();
      toast.success('Note partagée avec succès !');
    } catch (error: any) {
      toast.error(error || 'Erreur lors du partage de la note');
      throw error;
    }
  }, [dispatch]);

  // Share note public
  const shareNotePublicData = useCallback(async (noteId: number) => {
    try {
      const token = await dispatch(shareNotePublic(noteId)).unwrap();
      toast.success('Lien public créé avec succès !');
      return token;
    } catch (error: any) {
      toast.error(error || 'Erreur lors de la création du lien public');
      throw error;
    }
  }, [dispatch]);

  // Get public note
  const getPublicNoteData = useCallback(async (token: string) => {
    try {
      const note = await dispatch(getPublicNote(token)).unwrap();
      return note;
    } catch (error: any) {
      toast.error(error || 'Erreur lors du chargement de la note publique');
      throw error;
    }
  }, [dispatch]);

  // Search and filter functions
  const searchNotes = useCallback((query: string) => {
    dispatch(setSearchQuery(query));
  }, [dispatch]);

  const filterByTags = useCallback((tags: string[]) => {
    dispatch(setSelectedTags(tags));
  }, [dispatch]);

  const filterByVisibility = useCallback((visibility: 'ALL' | 'PRIVATE' | 'SHARED' | 'PUBLIC') => {
    dispatch(setVisibilityFilter(visibility));
  }, [dispatch]);

  const setSearchParams = useCallback((params: SearchParams) => {
    dispatch(setCurrentSearch(params));
  }, [dispatch]);

  const clearSearchData = useCallback(() => {
    dispatch(clearSearch());
  }, [dispatch]);

  const clearPublicNoteData = useCallback(() => {
    dispatch(clearPublicNote());
  }, [dispatch]);

  const clearNotesError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Get all unique tags
  const getAllTags = useCallback(() => {
    const allTags = notes.flatMap(note => note.tags);
    const uniqueTags = Array.from(new Set(allTags.map(tag => tag.label)));
    return uniqueTags;
  }, [notes]);

  // Get note by ID
  const getNoteById = useCallback((id: number) => {
    return notes.find(note => note.id === id);
  }, [notes]);

  return {
    // Data
    notes,
    filteredNotes,
    publicNote,
    searchQuery,
    selectedTags,
    visibilityFilter,
    currentSearch,
    isLoading,
    error,
    
    // Actions
    loadNotes: loadNotesData,
    createNote: createNoteData,
    updateNote: updateNoteData,
    deleteNote: deleteNoteData,
    shareNote: shareNoteData,
    shareNotePublic: shareNotePublicData,
    getPublicNote: getPublicNoteData,
    
    // Search and filter
    searchNotes,
    filterByTags,
    filterByVisibility,
    setSearchParams,
    clearSearch: clearSearchData,
    clearPublicNote: clearPublicNoteData,
    clearError: clearNotesError,
    
    // Utilities
    getAllTags,
    getNoteById,
  };
};
