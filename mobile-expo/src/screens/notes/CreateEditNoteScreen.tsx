import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../store';
import { createNote, updateNote } from '../../store/notes/notesSlice';
import { Ionicons } from '@expo/vector-icons';
import MarkdownEditor from '../../components/MarkdownEditor';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import BackgroundShapes from '../../components/BackgroundShapes';

interface CreateEditNoteScreenProps {
  route?: {
    params?: {
      noteId?: number;
    };
  };
}

const CreateEditNoteScreen: React.FC<CreateEditNoteScreenProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation() as any;
  const route = useRoute();
  const { isLoading, notes } = useSelector((state: RootState) => state.notes);
  
  const noteId = (route.params as any)?.noteId;
  const note = noteId ? notes.find(n => n.id === noteId) : null;
  const isEditing = !!noteId;
  
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.contentMd || '');
  const [visibility, setVisibility] = useState<'PRIVATE' | 'SHARED' | 'PUBLIC'>(
    note?.visibility || 'PRIVATE'
  );
  const [tags, setTags] = useState(
    note?.tags?.map(tag => tag.label).join(', ') || ''
  );
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Erreur', 'Le titre est requis');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Erreur', 'Le contenu est requis');
      return;
    }

    try {
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      if (isEditing && noteId) {
        await dispatch(updateNote({
          id: noteId,
          title: title.trim(),
          contentMd: content.trim(),
          visibility,
          tags: tagsArray,
        })).unwrap();
      } else {
        await dispatch(createNote({
          title: title.trim(),
          contentMd: content.trim(),
          visibility,
          tags: tagsArray,
        })).unwrap();
      }

      Alert.alert(
        'Succès',
        isEditing ? 'Note modifiée avec succès' : 'Note créée avec succès',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('Erreur', err || 'Une erreur est survenue');
    }
  };

  const handleCancel = () => {
    if (title.trim() || content.trim()) {
      Alert.alert(
        'Annuler',
        'Voulez-vous vraiment annuler ? Vos modifications seront perdues.',
        [
          { text: 'Continuer', style: 'cancel' },
          { text: 'Annuler', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const getVisibilityColor = (vis: string) => {
    switch (vis) {
      case 'PUBLIC':
        return 'bg-[#6eb3d3] text-white border-[#528ba5]';
      case 'SHARED':
        return 'bg-[#8bc9bc] text-white border-[#6c9b92]';
      default:
        return 'bg-gray-300 text-white border-gray-500';
    }
  };

  const getVisibilityIcon = (vis: string) => {
    switch (vis) {
      case 'PUBLIC':
        return 'globe-outline';
      case 'SHARED':
        return 'share-outline';
      default:
        return 'lock-closed-outline';
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 bg-white">
        {/* Background Shapes */}
        {/* <BackgroundShapes /> */}
        
        {/* Header */}
        <View className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <View className="flex-row items-center justify-between mt-8">
            <TouchableOpacity
              onPress={handleCancel}
              className="p-2 -ml-2"
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <Text className="text-lg font-semibold text-white">
              {isEditing ? 'Modifier la note' : 'Nouvelle note'}
            </Text>
            
            <TouchableOpacity
              onPress={handleSave}
              disabled={isLoading || !title.trim() || !content.trim()}
              className={`px-4 py-2 rounded-lg ${
                isLoading || !title.trim() || !content.trim()
                  ? 'bg-gray-500'
                  : 'bg-yellow-500'
              }`}
            >
              <Text className="text-white font-medium">
                {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-6 space-y-6">
            {/* Title Input */}
            <View>
              <Text className="text-sm font-medium text-gray-300 mb-2">
                Titre *
              </Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900"
                placeholder="Titre de votre note..."
                value={title}
                onChangeText={setTitle}
                maxLength={100}
                autoFocus
              />
              <Text className="text-xs text-gray-400 mt-1">
                {title.length}/100 caractères
              </Text>
            </View>

            {/* Visibility Selector */}
            <View>
              <Text className="text-sm font-medium text-white mb-3">
                Visibilité
              </Text>
              <View className="flex-row space-x-3 gap-5 ">
                {(['PRIVATE', 'SHARED', 'PUBLIC'] as const).map((vis) => (
                  <TouchableOpacity
                    key={vis}
                    onPress={() => setVisibility(vis)}
                    className={`flex-1 p-3 rounded-xl border-2 ${
                      visibility === vis
                        ? getVisibilityColor(vis)
                        : 'bg-white  border-gray-400'
                    }`}
                  >
                    <View className="flex-row items-center justify-center">
                      <Ionicons
                        name={getVisibilityIcon(vis) as any}
                        size={16}
                        color={visibility === vis ? 'currentColor' : '#9CA3AF'}
                        style={{ marginRight: 6 }}
                      />
                      <Text className={`text-sm font-medium ${
                        visibility === vis ? 'text-current' : 'text-gray-300'
                      }`}>
                        {(() => {
                          switch (vis) {
                            case 'PRIVATE': return 'Privée';
                            case 'SHARED': return 'Partagée';
                            case 'PUBLIC': return 'Publique';
                            default: return 'Privée';
                          }
                        })()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Tags Input */}
            <View>
              <Text className="text-sm font-medium text-gray-300 mb-2">
                Tags
              </Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900"
                placeholder="tag1, tag2, tag3..."
                value={tags}
                onChangeText={setTags}
              />
              <Text className="text-xs text-gray-400 mt-1">
                Séparez les tags par des virgules
              </Text>
            </View>

            {/* Content Input */}
            <View>
              <Text className="text-sm font-medium text-gray-300 mb-2">
                Contenu *
              </Text>
              <View className="bg-white border border-gray-300 rounded-xl min-h-[200px] overflow-hidden">
                {showPreview ? (
                  <ScrollView className="flex-1 p-4">
                    <MarkdownRenderer content={content} />
                  </ScrollView>
                ) : (
                  <MarkdownEditor
                    value={content}
                    onChangeText={setContent}
                    placeholder="Commencez à écrire votre note en markdown..."
                    minHeight={200}
                    showPreview={showPreview}
                    onPreviewToggle={setShowPreview}
                  />
                )}
              </View>
           
            </View>

            {/* Markdown Help */}
            
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateEditNoteScreen;
