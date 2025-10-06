export interface Note {
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
  tags: Array<{
    id: number;
    label: string;
  }>;
  shares?: Array<{
    id: number;
    sharedWithUser: {
      id: number;
      name: string;
      email: string;
    };
    permission: 'READ' | 'WRITE';
    createdAt: string;
  }>;
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
  owner: {
    id: number;
    name: string;
    email: string;
  };
  tags: Array<{
    id: number;
    label: string;
  }>;
}
