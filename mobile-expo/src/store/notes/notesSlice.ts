import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import { syncService } from '../../services/syncService';

// Types
interface Tag {
  id: number;
  label: string;
}

interface Note {
  id: number;
  title: string;
  contentMd: string;
  visibility: 'PRIVATE' | 'SHARED' | 'PUBLIC';
  createdAt: string;
  updatedAt: string;
  owner: {
    id: number;
    name: string;
    email: string;
  };
  tags: Tag[];
}

interface CreateNoteRequest {
  title: string;
  contentMd: string;
  visibility: 'PRIVATE' | 'SHARED' | 'PUBLIC';
  tags: string[];
}

interface UpdateNoteRequest {
  id: number;
  title: string;
  contentMd: string;
  visibility: 'PRIVATE' | 'SHARED' | 'PUBLIC';
  tags: string[];
}

interface PublicNote {
  id: number;
  title: string;
  contentMd: string;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: number;
    name: string;
    email: string;
  };
  tags: Tag[];
}

interface NotesState {
  notes: Note[];
  filteredNotes: Note[];
  publicNote: PublicNote | null;
  searchQuery: string;
  selectedTags: string[];
  visibilityFilter: 'ALL' | 'PRIVATE' | 'SHARED' | 'PUBLIC';
  currentSearch: {
    query?: string;
    tag?: string;
    visibility?: string;
  };
  isLoading: boolean;
  error: string | null;
  isOffline: boolean;
  pendingSyncActions: number;
  lastSync: Date | null;
}

// Thunks
export const loadNotes = createAsyncThunk(
  'notes/loadNotes',
  async (params?: { query?: string; tag?: string; visibility?: string }, { rejectWithValue }) => {
    try {
      const searchParams = new URLSearchParams();
      if (params?.query) searchParams.append('query', params.query);
      if (params?.tag) searchParams.append('tag', params.tag);
      if (params?.visibility) searchParams.append('visibility', params.visibility);
      
      const url = `/notes${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data.content || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load notes');
    }
  }
);

export const createNote = createAsyncThunk(
  'notes/createNote',
  async (noteData: CreateNoteRequest, { rejectWithValue, getState }) => {
    try {
      const response = await api.post('/notes', noteData);
      return response.data;
    } catch (error: any) {
      // If offline or network error, add to offline queue
      if (!navigator.onLine || error.code === 'NETWORK_ERROR') {
        await syncService.addOfflineAction('CREATE_NOTE', noteData);
        // Return optimistic note for immediate UI update
        return {
          id: Date.now(), // Temporary ID
          ...noteData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          owner: (getState() as any).auth.user,
          tags: noteData.tags.map((label, index) => ({ id: index, label })),
        };
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to create note');
    }
  }
);

export const updateNote = createAsyncThunk(
  'notes/updateNote',
  async (noteData: UpdateNoteRequest, { rejectWithValue, getState }) => {
    try {
      const { id, ...updateData } = noteData;
      const response = await api.put(`/notes/${id}`, updateData);
      return response.data;
    } catch (error: any) {
      // If offline or network error, add to offline queue
      if (!navigator.onLine || error.code === 'NETWORK_ERROR') {
        await syncService.addOfflineAction('UPDATE_NOTE', noteData);
        // Return optimistic update for immediate UI update
        return {
          ...noteData,
          updatedAt: new Date().toISOString(),
          tags: noteData.tags.map((label, index) => ({ id: index, label })),
        };
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to update note');
    }
  }
);

export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async (noteId: number, { rejectWithValue }) => {
    try {
      await api.delete(`/notes/${noteId}`);
      return noteId;
    } catch (error: any) {
      // If offline or network error, add to offline queue
      if (!navigator.onLine || error.code === 'NETWORK_ERROR') {
        await syncService.addOfflineAction('DELETE_NOTE', { id: noteId });
        return noteId; // Return ID for immediate UI update
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to delete note');
    }
  }
);

export const shareNote = createAsyncThunk(
  'notes/shareNote',
  async ({ noteId, email }: { noteId: number; email: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/notes/${noteId}/share/user?email=${email}`);
      return response.data;
    } catch (error: any) {
      // If offline or network error, add to offline queue
      if (!navigator.onLine || error.code === 'NETWORK_ERROR') {
        await syncService.addOfflineAction('SHARE_NOTE', { noteId, email });
        return { message: 'Note will be shared when online' };
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to share note');
    }
  }
);

export const shareNotePublic = createAsyncThunk(
  'notes/shareNotePublic',
  async (noteId: number, { rejectWithValue }) => {
    try {
      const response = await api.post(`/notes/${noteId}/share/public`);
      return response.data;
    } catch (error: any) {
      // If offline or network error, add to offline queue
      if (!navigator.onLine || error.code === 'NETWORK_ERROR') {
        await syncService.addOfflineAction('SHARE_PUBLIC', { noteId });
        return { message: 'Public link will be created when online' };
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to create public link');
    }
  }
);

export const getPublicNote = createAsyncThunk(
  'notes/getPublicNote',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/p/${token}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load public note');
    }
  }
);

// Initial state
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
  isOffline: true,
  pendingSyncActions: 0,
  lastSync: null,
};

// Slice
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
    setCurrentSearch: (state, action: PayloadAction<{ query?: string; tag?: string; visibility?: string }>) => {
      state.currentSearch = action.payload;
    },
    clearSearch: (state) => {
      state.currentSearch = {};
      state.searchQuery = '';
      state.selectedTags = [];
      state.visibilityFilter = 'ALL';
    },
    setOfflineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload;
    },
    setPendingSyncActions: (state, action: PayloadAction<number>) => {
      state.pendingSyncActions = action.payload;
    },
    setLastSync: (state, action: PayloadAction<Date | null>) => {
      state.lastSync = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(updateNote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.notes.findIndex(note => note.id === action.payload.id);
        if (index !== -1) {
          state.notes[index] = action.payload;
          state.filteredNotes = state.notes;
        }
        state.error = null;
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
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
        state.publicNote = null;
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
  setOfflineStatus,
  setPendingSyncActions,
  setLastSync
} = notesSlice.actions;

export default notesSlice;
