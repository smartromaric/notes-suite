import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../store';
import { loadNotes, setCurrentSearch, clearSearch } from '../../store/notes/notesSlice';
import { Ionicons } from '@expo/vector-icons';

interface Note {
  id: number;
  title: string;
  contentMd: string;
  visibility: 'PRIVATE' | 'SHARED' | 'PUBLIC';
  createdAt: string;
  updatedAt: string;
  tags: Array<{ id: number; label: string }>;
}

const SearchNotesScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation() as any;
  const { notes, isLoading, currentSearch } = useSelector((state: RootState) => state.notes);
  
  const [query, setQuery] = useState(currentSearch.query || '');
  const [selectedTag, setSelectedTag] = useState(currentSearch.tag || '');
  const [selectedVisibility, setSelectedVisibility] = useState(currentSearch.visibility || '');
  const [isSearching, setIsSearching] = useState(false);

  // Get unique tags from all notes
  const allTags = Array.from(
    new Set(notes.flatMap(note => note.tags.map(tag => tag.label)))
  ).sort();

  const performSearch = async () => {
    setIsSearching(true);
    const searchParams: any = {};
    
    if (query.trim()) searchParams.query = query.trim();
    if (selectedTag) searchParams.tag = selectedTag;
    if (selectedVisibility) searchParams.visibility = selectedVisibility;
    
    dispatch(setCurrentSearch(searchParams));
    await dispatch(loadNotes(searchParams));
    setIsSearching(false);
  };

  const clearAllFilters = () => {
    setQuery('');
    setSelectedTag('');
    setSelectedVisibility('');
    dispatch(clearSearch());
    dispatch(loadNotes());
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNotePress = (note: Note) => {
    navigation.navigate('NoteDetail' as never, { noteId: note.id } as never);
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
      className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
      onPress={() => handleNotePress(item)}
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
        {item.contentMd && (
          <Text className="text-gray-600 text-sm" numberOfLines={3}>
            {item.contentMd.replace(/[#*`]/g, '').substring(0, 150)}...
          </Text>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <View className="flex-row flex-wrap">
            {item.tags.slice(0, 3).map((tag) => (
              <View key={tag.id} className="bg-blue-100 px-2 py-1 rounded-md mr-2 mb-1">
                <Text className="text-blue-700 text-xs font-medium">
                  #{tag.label}
                </Text>
              </View>
            ))}
            {item.tags.length > 3 && (
              <View className="bg-gray-100 px-2 py-1 rounded-md mr-2 mb-1">
                <Text className="text-gray-600 text-xs">
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
        <View className="bg-gray-100 p-6 rounded-full mb-4">
          <Ionicons name="search-outline" size={48} color="#9CA3AF" />
        </View>
        <Text className="text-xl font-semibold text-gray-900 mb-2">
          Aucun résultat
        </Text>
        <Text className="text-gray-500 text-center px-8">
          Aucune note ne correspond à vos critères de recherche
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-6 py-4">
        <View className="flex-row items-center justify-between mt-8">
          <TouchableOpacity
            onPress={handleBack}
            className="p-2 -ml-2"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          
          <Text className="text-lg font-semibold text-gray-900">
            Rechercher
          </Text>
          
          <TouchableOpacity
            onPress={clearAllFilters}
            className="p-2 -mr-2"
          >
            <Ionicons name="refresh" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          {/* Search Input */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Rechercher par titre
            </Text>
            <View className="flex-row items-center bg-white border border-gray-300 rounded-xl px-4 py-3">
              <Ionicons name="search" size={20} color="#9CA3AF" style={{ marginRight: 12 }} />
              <TextInput
                className="flex-1 text-base text-gray-900"
                placeholder="Titre de la note..."
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={performSearch}
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery('')}>
                  <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Tag Filter */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-3">
              Filtrer par tag
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row space-x-2">
                <TouchableOpacity
                  onPress={() => setSelectedTag('')}
                  className={`px-4 py-2 rounded-full border ${
                    selectedTag === ''
                      ? 'bg-blue-600 border-blue-600'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <Text className={`text-sm font-medium ${
                    selectedTag === '' ? 'text-white' : 'text-gray-700'
                  }`}>
                    Tous
                  </Text>
                </TouchableOpacity>
                {allTags.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => setSelectedTag(tag)}
                    className={`px-4 py-2 rounded-full border ${
                      selectedTag === tag
                        ? 'bg-blue-600 border-blue-600'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <Text className={`text-sm font-medium ${
                      selectedTag === tag ? 'text-white' : 'text-gray-700'
                    }`}>
                      #{tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Visibility Filter */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-3">
              Filtrer par visibilité
            </Text>
            <View className="flex-row space-x-3">
              {(['', 'PRIVATE', 'SHARED', 'PUBLIC'] as const).map((vis) => (
                <TouchableOpacity
                  key={vis}
                  onPress={() => setSelectedVisibility(vis)}
                  className={`flex-1 p-3 rounded-xl border-2 ${
                    selectedVisibility === vis
                      ? 'bg-blue-100 border-blue-300'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <View className="flex-row items-center justify-center">
                    <Ionicons
                      name={vis === 'PRIVATE' ? 'lock-closed-outline' : 
                            vis === 'SHARED' ? 'share-outline' : 
                            vis === 'PUBLIC' ? 'globe-outline' : 'list-outline'}
                      size={16}
                      color={selectedVisibility === vis ? '#3B82F6' : '#6B7280'}
                      style={{ marginRight: 6 }}
                    />
                    <Text className={`text-sm font-medium ${
                      selectedVisibility === vis ? 'text-blue-800' : 'text-gray-600'
                    }`}>
                      {vis === 'PRIVATE' ? 'Privée' : 
                       vis === 'SHARED' ? 'Partagée' : 
                       vis === 'PUBLIC' ? 'Publique' : 'Toutes'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Search Button */}
          <TouchableOpacity
            onPress={performSearch}
            disabled={isSearching}
            className={`py-4 rounded-xl mb-6 ${
              isSearching ? 'bg-gray-300' : 'bg-blue-600'
            }`}
          >
            <View className="flex-row items-center justify-center">
              {isSearching && (
                <Ionicons name="refresh" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              )}
              <Text className="text-white font-semibold text-base">
                {isSearching ? 'Recherche...' : 'Rechercher'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Results */}
          {notes.length > 0 && (
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-4">
                {notes.length} résultat{notes.length > 1 ? 's' : ''} trouvé{notes.length > 1 ? 's' : ''}
              </Text>
              <FlatList
                data={notes}
                renderItem={renderNoteItem}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
            </View>
          )}

          {notes.length === 0 && !isLoading && (
            renderEmptyState()
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default SearchNotesScreen;
