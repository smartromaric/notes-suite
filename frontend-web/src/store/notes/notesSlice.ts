import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { notesApi } from '../../services/api';
import type { Note, CreateNoteRequest, UpdateNoteRequest, ShareNoteRequest, PublicNote, SearchParams } from '../../types';

interface NotesState {
  notes: Note[];
  filteredNotes: Note[];
  publicNote: PublicNote | null;
  searchQuery: string;
  selectedTags: string[];
  visibilityFilter: 'ALL' | 'PRIVATE' | 'SHARED' | 'PUBLIC';
  currentSearch: SearchParams;
  isLoading: boolean;
  error: string | null;
}

const initialState: NotesState = {
  notes: [],
  filteredNotes: [],
  publicNote: null,
  searchQuery: '',
  selectedTags: [],
  visibilityFilter: 'ALL',
  currentSearch: {},
  isLoading: false,
  error: null,
};

// Async thunks
export const loadNotes = createAsyncThunk(
  'notes/loadNotes',
  async (params: SearchParams, { rejectWithValue }) => {
    try {
      const notes = await notesApi.getNotes(params);
      return notes;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load notes');
    }
  }
);

export const createNote = createAsyncThunk(
  'notes/createNote',
  async (noteData: CreateNoteRequest, { rejectWithValue }) => {
    try {
      const note = await notesApi.createNote(noteData);
      return note;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create note');
    }
  }
);

export const updateNote = createAsyncThunk(
  'notes/updateNote',
  async (noteData: UpdateNoteRequest, { rejectWithValue }) => {
    try {
      const note = await notesApi.updateNote(noteData);
      return note;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update note');
    }
  }
);

export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async (noteId: number, { rejectWithValue }) => {
    try {
      await notesApi.deleteNote(noteId);
      return noteId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete note');
    }
  }
);

export const shareNote = createAsyncThunk(
  'notes/shareNote',
  async (shareData: ShareNoteRequest, { rejectWithValue }) => {
    try {
      const result = await notesApi.shareNote(shareData);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to share note');
    }
  }
);

export const shareNotePublic = createAsyncThunk(
  'notes/shareNotePublic',
  async (noteId: number, { rejectWithValue }) => {
    try {
      const token = await notesApi.shareNotePublic(noteId);
      return token;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create public link');
    }
  }
);

export const getPublicNote = createAsyncThunk(
  'notes/getPublicNote',
  async (token: string, { rejectWithValue }) => {
    try {
      const note = await notesApi.getPublicNote(token);
      return note;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load public note');
    }
  }
);

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredNotes = state.notes.filter(note =>
        note.title.toLowerCase().includes(action.payload.toLowerCase()) ||
        note.contentMd.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    setSelectedTags: (state, action: PayloadAction<string[]>) => {
      state.selectedTags = action.payload;
      if (action.payload.length === 0) {
        state.filteredNotes = state.notes;
      } else {
        state.filteredNotes = state.notes.filter(note =>
          note.tags.some(tag => action.payload.includes(tag.label))
        );
      }
    },
    setVisibilityFilter: (state, action: PayloadAction<'ALL' | 'PRIVATE' | 'SHARED' | 'PUBLIC'>) => {
      state.visibilityFilter = action.payload;
      if (action.payload === 'ALL') {
        state.filteredNotes = state.notes;
      } else {
        state.filteredNotes = state.notes.filter(note => note.visibility === action.payload);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentSearch: (state, action: PayloadAction<SearchParams>) => {
      state.currentSearch = action.payload;
    },
    clearSearch: (state) => {
      state.currentSearch = {};
      state.searchQuery = '';
      state.selectedTags = [];
      state.visibilityFilter = 'ALL';
    },
    clearPublicNote: (state) => {
      state.publicNote = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load notes
      .addCase(loadNotes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notes = action.payload;
        state.filteredNotes = action.payload;
        state.error = null;
      })
      .addCase(loadNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create note
      .addCase(createNote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notes.unshift(action.payload);
        state.filteredNotes.unshift(action.payload);
        state.error = null;
      })
      .addCase(createNote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update note
      .addCase(updateNote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.notes.findIndex(note => note.id === action.payload.id);
        if (index !== -1) {
          state.notes[index] = action.payload;
          const filteredIndex = state.filteredNotes.findIndex(note => note.id === action.payload.id);
          if (filteredIndex !== -1) {
            state.filteredNotes[filteredIndex] = action.payload;
          }
        }
        state.error = null;
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete note
      .addCase(deleteNote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notes = state.notes.filter(note => note.id !== action.payload);
        state.filteredNotes = state.filteredNotes.filter(note => note.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Share note
      .addCase(shareNote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(shareNote.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(shareNote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Share note public
      .addCase(shareNotePublic.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(shareNotePublic.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(shareNotePublic.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get public note
      .addCase(getPublicNote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPublicNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.publicNote = action.payload;
        state.error = null;
      })
      .addCase(getPublicNote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearchQuery,
  setSelectedTags,
  setVisibilityFilter,
  clearError,
  setCurrentSearch,
  clearSearch,
  clearPublicNote,
} = notesSlice.actions;

export default notesSlice.reducer;
