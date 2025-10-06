import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Share,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../store';
import { deleteNote } from '../../store/notes/notesSlice';
import { Ionicons } from '@expo/vector-icons';
import MarkdownRenderer from '../../components/MarkdownRenderer';

interface NoteDetailScreenProps {
  route: {
    params: {
      noteId: number;
    };
  };
}

const NoteDetailScreen: React.FC<NoteDetailScreenProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation() as any;
  const route = useRoute();
  const { noteId } = route.params as { noteId: number };
  
  const { notes, isLoading } = useSelector((state: RootState) => state.notes);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const note = notes.find(n => n.id === noteId);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!note) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-500">Note non trouvée</Text>
        <TouchableOpacity
          className="mt-4 bg-blue-600 px-4 py-2 rounded-lg"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white">Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleEdit = () => {
    navigation.navigate('CreateEditNote' as never, { noteId: note.id } as never);
  };

  const handleDelete = () => {
    Alert.alert(
      'Supprimer la note',
      'Êtes-vous sûr de vouloir supprimer cette note ? Cette action est irréversible.',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await dispatch(deleteNote(note.id)).unwrap();
              Alert.alert('Succès', 'Note supprimée avec succès', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } catch (error: any) {
              Alert.alert('Erreur', error || 'Erreur lors de la suppression');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleShare = () => {
    Alert.alert(
      'Partager la note',
      'Comment souhaitez-vous partager cette note ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Avec un utilisateur',
          onPress: () => navigation.navigate('ShareNote' as never, { 
            noteId: note.id, 
            noteTitle: note.title 
          } as never),
        },
        {
          text: 'Lien public',
          onPress: () => navigation.navigate('SharePublic' as never, { 
            noteId: note.id, 
            noteTitle: note.title 
          } as never),
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderMarkdownContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let listIndex = 0;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('# ')) {
        elements.push(
          <Text key={`h1-${index}`} className="text-2xl font-bold text-gray-900 mb-4 mt-4">
            {trimmedLine.substring(2)}
          </Text>
        );
      } else if (trimmedLine.startsWith('## ')) {
        elements.push(
          <Text key={`h2-${index}`} className="text-xl font-semibold text-gray-900 mb-3 mt-3">
            {trimmedLine.substring(3)}
          </Text>
        );
      } else if (trimmedLine.startsWith('### ')) {
        elements.push(
          <Text key={`h3-${index}`} className="text-lg font-medium text-gray-900 mb-2 mt-2">
            {trimmedLine.substring(4)}
          </Text>
        );
      } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        elements.push(
          <View key={`list-${index}`} className="flex-row mb-1">
            <Text className="text-gray-700 mr-2">•</Text>
            <Text className="text-gray-700 flex-1">
              {renderInlineMarkdown(trimmedLine.substring(2))}
            </Text>
          </View>
        );
      } else if (trimmedLine.startsWith('1. ') || trimmedLine.startsWith('2. ') || 
                 trimmedLine.startsWith('3. ') || trimmedLine.startsWith('4. ') || 
                 trimmedLine.startsWith('5. ') || trimmedLine.startsWith('6. ') || 
                 trimmedLine.startsWith('7. ') || trimmedLine.startsWith('8. ') || 
                 trimmedLine.startsWith('9. ')) {
        const number = trimmedLine.match(/^\d+\./)?.[0] || '•';
        elements.push(
          <View key={`ol-${index}`} className="flex-row mb-1">
            <Text className="text-gray-700 mr-2">{number}</Text>
            <Text className="text-gray-700 flex-1">
              {renderInlineMarkdown(trimmedLine.replace(/^\d+\.\s*/, ''))}
            </Text>
          </View>
        );
      } else if (trimmedLine.startsWith('```')) {
        // Code block - simple implementation
        elements.push(
          <View key={`code-${index}`} className="bg-gray-100 p-3 rounded-lg my-2">
            <Text className="text-gray-800 font-mono text-sm">
              {trimmedLine.substring(3)}
            </Text>
          </View>
        );
      } else if (trimmedLine === '') {
        elements.push(<View key={`space-${index}`} className="h-3" />);
      } else {
        elements.push(
          <Text key={`p-${index}`} className="text-gray-700 mb-2 leading-6">
            {renderInlineMarkdown(trimmedLine)}
          </Text>
        );
      }
    });

    return elements;
  };

  const renderInlineMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <Text key={index} className="font-bold text-gray-900">
            {part.slice(2, -2)}
          </Text>
        );
      } else if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
        return (
          <Text key={index} className="italic text-gray-800">
            {part.slice(1, -1)}
          </Text>
        );
      } else if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <Text key={index} className="bg-gray-200 px-1 py-0.5 rounded font-mono text-sm text-gray-800">
            {part.slice(1, -1)}
          </Text>
        );
      } else if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
        const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          return (
            <Text key={index} className="text-blue-600 underline">
              {linkMatch[1]}
            </Text>
          );
        }
      }
      return part;
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-6 py-4">
        <View className="flex-row items-center justify-between mt-8">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 -ml-2"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          
          <Text className="text-lg font-semibold text-gray-900">
            Détail de la note
          </Text>
          
          <View className="flex-row space-x-2">
            <TouchableOpacity
              onPress={handleEdit}
              className="p-2"
            >
              <Ionicons name="create-outline" size={24} color="#3B82F6" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleShare}
              className="p-2"
            >
              <Ionicons name="share-outline" size={24} color="#10B981" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              disabled={isDeleting}
              className="p-2"
            >
              <Ionicons 
                name="trash-outline" 
                size={24} 
                color={isDeleting ? "#9CA3AF" : "#EF4444"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          {/* Title */}
          <Text className="text-3xl font-bold text-gray-900 mb-4">
            {note.title}
          </Text>

          {/* Meta Info */}
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center space-x-4">
              <View className={`px-3 py-1 rounded-full ${getVisibilityColor(note.visibility)}`}>
                <View className="flex-row items-center">
                  <Ionicons 
                    name={getVisibilityIcon(note.visibility) as any} 
                    size={14} 
                    color="currentColor"
                    style={{ marginRight: 4 }}
                  />
                  <Text className="text-sm font-medium">
                    {note.visibility === 'PRIVATE' ? 'Privée' : 
                     note.visibility === 'SHARED' ? 'Partagée' : 'Publique'}
                  </Text>
                </View>
              </View>
            </View>
            <Text className="text-sm text-gray-500">
              {formatDate(note.updatedAt)}
            </Text>
          </View>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">Tags</Text>
              <View className="flex-row flex-wrap">
                {note.tags.map((tag) => (
                  <View key={tag.id} className="bg-blue-100 px-3 py-1 rounded-full mr-2 mb-2">
                    <Text className="text-blue-800 text-sm font-medium">
                      #{tag.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Content */}
          <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <Text className="text-sm font-medium text-gray-700 mb-4">Contenu</Text>
            <View className="space-y-2">
              <MarkdownRenderer content={note.contentMd} />
            </View>
          </View>

          {/* Owner Info */}
          <View className="mt-6 p-4 bg-gray-50 rounded-xl">
            <Text className="text-sm text-gray-600">
              Créée par {note.owner?.name || 'Utilisateur'} le {formatDate(note.createdAt)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default NoteDetailScreen;
