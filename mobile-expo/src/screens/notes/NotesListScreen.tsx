import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../store';
import { loadNotes } from '../../store/notes/notesSlice';
import { logout } from '../../store/auth/authSlice';
import { Ionicons } from '@expo/vector-icons';
import BackgroundShapes from '../../components/BackgroundShapes';
import SyncStatusBar from '../../components/SyncStatusBar';
import { useConnectivity } from '../../hooks/useConnectivity';
import { syncService } from '../../services/syncService';

interface Note {
  id: number;
  title: string;
  contentMd: string;
  visibility: 'PRIVATE' | 'SHARED' | 'PUBLIC';
  createdAt: string;
  updatedAt: string;
  tags: Array<{ id: number; label: string }>;
}

const NotesListScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { notes } = useSelector((state: RootState) => state.notes);
  const { user } = useSelector((state: RootState) => state.auth);
  const connectivity = useConnectivity();
  
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(loadNotes());
  }, [dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(loadNotes()).unwrap();
      // Auto-sync when refreshing
      if (!connectivity.isOffline) {
        await syncService.sync();
      }
    } catch (error) {
      console.error('Error refreshing notes:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSyncPress = async () => {
    if (!connectivity.isOffline) {
      await syncService.sync();
    }
  };

  const handleCreateNote = () => {
    (navigation as any).navigate('CreateEditNote');
  };

  const handleNotePress = (note: Note) => {
    (navigation as any).navigate('NoteDetail', { noteId: note.id });
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => dispatch(logout()),
        },
      ]
    );
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'PUBLIC':
        return 'bg-green-100 text-green-800';
      case 'SHARED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'PUBLIC':
        return 'globe-outline';
      case 'SHARED':
        return 'share-outline';
      default:
        return 'lock-closed-outline';
    }
  };

  const renderNoteItem = ({ item }: { item: Note }) => (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mb-5 shadow-lg border border-gray-200"
      onPress={() => handleNotePress(item)}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <View className="space-y-3">
        {/* Header */}
        <View className="flex-row items-center">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900" numberOfLines={2}>
              {item.title}
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              {new Date(item.updatedAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
          <View className={`px-3 py-1 rounded-full ${getVisibilityColor(item.visibility)}`}>
            <View className="flex-row items-center">
              <Ionicons 
                name={getVisibilityIcon(item.visibility) as any} 
                size={12} 
                color="currentColor"
                style={{ marginRight: 4 }}
              />
              <Text className="text-xs font-medium">
                {item.visibility}
              </Text>
            </View>
          </View>
        </View>

        {/* Content Preview */}
        {!!item.contentMd && (
          <Text className="text-gray-600 text-sm" numberOfLines={3}>
            {item.contentMd.replace(/[#*`]/g, '').substring(0, 150)}...
          </Text>
        )}

        {/* Tags */}
        {!!(item.tags && item.tags.length > 0) && (
          <View className="flex-row flex-wrap">
            {item.tags.slice(0, 3).map((tag) => (
              <View key={tag.id} className="bg-yellow-100 px-2 py-1 rounded-md mr-2 mb-1">
                <Text className="text-yellow-800 text-xs font-medium">
                  #{tag.label}
                </Text>
              </View>
            ))}
            {item.tags.length > 3 && (
              <View className="bg-gray-200 px-2 py-1 rounded-md mr-2 mb-1">
                <Text className="text-gray-700 text-xs">
                  +{item.tags.length - 3}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center py-20">
      <View className="items-center">
        <View className="bg-yellow-100 p-6 rounded-full mb-4">
          <Ionicons name="document-text-outline" size={48} color="#F59E0B" />
        </View>
        <View className="items-center mb-6">
          <Text className="text-xl font-semibold text-white">
            Aucune note
          </Text>
          <Text className="text-gray-300 text-center px-8 mt-2">
            Commencez par créer votre première note pour organiser vos idées
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Background Shapes */}
      <BackgroundShapes />
      
      {/* Sync Status Bar */}
      <SyncStatusBar onSyncPress={handleSyncPress} />
      
      {/* Header */}
      <View className="bg-[#699b92] border-b border-gray-700 rounded-b-[80px] px-6 py-8">
        <View className="flex-row items-center mt-8">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-white">
              Mes Notes
            </Text>
            <Text className="text-sm text-gray-300">
              Bonjour {user?.name || 'Utilisateur'}
            </Text>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity
              className="bg-[#af6e6e] p-3 rounded-xl"
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search and Public Access Buttons */}
        <View className="space-y-3 mt-4">
          {/* Search Button */}
          <TouchableOpacity
            className="bg-[#6ea9af] p-3 rounded-xl mb-5 flex-row items-center justify-center"
            onPress={() => (navigation as any).navigate('SearchNotes')}
          >
            <Ionicons name="search" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text className="text-white font-medium text-sm">Rechercher des notes</Text>
          </TouchableOpacity>
          
          {/* Public Access Buttons */}
          <View className="flex-row space-x-5 gap-3">
            <TouchableOpacity
              className="flex-1 bg-[#746eaf] p-3 rounded-xl flex-row items-center justify-center"
              onPress={() => (navigation as any).navigate('ReadPublicLink')}
            >
              <Ionicons name="link" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text className="text-white font-medium text-sm">Lire un lien</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-[#6e84af] font-bold p-3 rounded-xl flex-row items-center justify-center"
              onPress={() => (navigation as any).navigate('PublicHistory')}
            >
              <Ionicons name="time-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text className="text-white font-medium text-sm">Historique</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-4 py-4 bg-white">
        {notes.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={notes}
            renderItem={renderNoteItem}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={['#3B82F6']}
                tintColor="#3B82F6"
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-yellow-500 w-16 h-16 rounded-full items-center justify-center shadow-lg"
        onPress={handleCreateNote}
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

export default NotesListScreen;
