// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

// Note Types
export interface Note {
  id: number;
  title: string;
  contentMd: string;
  visibility: 'PRIVATE' | 'SHARED' | 'PUBLIC';
  createdAt: string;
  updatedAt: string;
  owner: User;
  tags: Tag[];
  shares?: Share[];
}

export interface Tag {
  id: number;
  label: string;
}

export interface Share {
  id: number;
  sharedWithUser: User;
  permission: 'READ' | 'WRITE';
  createdAt: string;
}

export interface CreateNoteRequest {
  title: string;
  contentMd: string;
  visibility: 'PRIVATE' | 'SHARED' | 'PUBLIC';
  tags: string[];
}

export interface UpdateNoteRequest {
  id: number;
  title: string;
  contentMd: string;
  visibility: 'PRIVATE' | 'SHARED' | 'PUBLIC';
  tags: string[];
}

export interface ShareNoteRequest {
  noteId: number;
  email: string;
}

export interface PublicNote {
  id: number;
  title: string;
  contentMd: string;
  visibility: 'PUBLIC';
  createdAt: string;
  updatedAt: string;
  owner: User;
  tags: Tag[];
}

// API Response Types
export interface ApiResponse<T> {
  content?: T[];
  pageable?: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last?: boolean;
  totalPages?: number;
  totalElements?: number;
  size?: number;
  number?: number;
  numberOfElements?: number;
  first?: boolean;
  empty?: boolean;
}

// Search Types
export interface SearchParams {
  query?: string;
  tag?: string;
  visibility?: string;
  page?: number;
  size?: number;
}
