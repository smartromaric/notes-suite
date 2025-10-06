import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { loadUserFromStorage } from '../store/auth/authSlice';

// Import screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import NotesListScreen from '../screens/notes/NotesListScreen';
import CreateEditNoteScreen from '../screens/notes/CreateEditNoteScreen';
import NoteDetailScreen from '../screens/notes/NoteDetailScreen';
import ShareNoteScreen from '../screens/notes/ShareNoteScreen';
import SharePublicScreen from '../screens/notes/SharePublicScreen';
import SearchNotesScreen from '../screens/notes/SearchNotesScreen';
import PublicNoteScreen from '../screens/public/PublicNoteScreen';
import ReadPublicLinkScreen from '../screens/public/ReadPublicLinkScreen';
import PublicHistoryScreen from '../screens/public/PublicHistoryScreen';

// Types
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  NotesList: undefined;
  NoteDetail: { noteId: number };
  CreateEditNote: { noteId?: number };
  ShareNote: { noteId: number; noteTitle: string };
  SharePublic: { noteId: number; noteTitle: string };
  PublicNote: { token: string };
  ReadPublicLink: undefined;
  PublicHistory: undefined;
  SearchNotes: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Try to load user from storage on app start
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  if (isLoading) {
    // You could show a loading screen here
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      {isAuthenticated ? (
        // Authenticated Stack
        <>
          <Stack.Screen 
            name="NotesList" 
            component={NotesListScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="CreateEditNote" 
            component={CreateEditNoteScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="NoteDetail" 
            component={NoteDetailScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="ShareNote" 
            component={ShareNoteScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="SharePublic" 
            component={SharePublicScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="PublicNote" 
            component={PublicNoteScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="ReadPublicLink" 
            component={ReadPublicLinkScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="PublicHistory" 
            component={PublicHistoryScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="SearchNotes" 
            component={SearchNotesScreen}
            options={{
              headerShown: false,
            }}
          />
        </>
      ) : (
        // Unauthenticated Stack
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen}
            options={{
              headerShown: false,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
