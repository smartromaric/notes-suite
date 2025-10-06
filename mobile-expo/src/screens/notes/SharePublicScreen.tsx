import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Share,
  Clipboard,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../store';
import { shareNotePublic } from '../../store/notes/notesSlice';
import { Ionicons } from '@expo/vector-icons';

interface SharePublicScreenProps {
  route: {
    params: {
      noteId: number;
      noteTitle: string;
    };
  };
}

const SharePublicScreen: React.FC<SharePublicScreenProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation() as any;
  const route = useRoute();
  const { noteId, noteTitle } = route.params as { noteId: number; noteTitle: string };
  const { isLoading } = useSelector((state: RootState) => state.notes);
  
  const [publicLink, setPublicLink] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generatePublicLink();
  }, []);

  const generatePublicLink = async () => {
    setIsGenerating(true);
    try {
      const result = await dispatch(shareNotePublic(noteId)).unwrap();
      console.log('Share public result:', result);
      
      // The server returns the token directly as a string
      const token = typeof result === 'string' ? result : result?.token || result?.publicLink?.token || result?.data?.token;
      if (token) {
        const link = `http://localhost:9090/p/${token}`;
        setPublicLink(link);
      } else {
        console.error('No token found in response:', result);
        Alert.alert('Erreur', 'Token non trouvé dans la réponse du serveur');
      }
    } catch (error: any) {
      console.error('Share public error:', error);
      Alert.alert('Erreur', error || 'Erreur lors de la génération du lien');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (publicLink) {
      await Clipboard.setString(publicLink);
      Alert.alert('Copié', 'Le lien a été copié dans le presse-papiers');
    }
  };

  const shareLink = async () => {
    if (publicLink) {
      try {
        await Share.share({
          message: `Regardez cette note: ${noteTitle}\n\n${publicLink}`,
          title: noteTitle,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

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
            Partage public
          </Text>
          
          <View className="w-8" />
        </View>
      </View>

      <View className="flex-1 p-6">
        {/* Note Info */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
          <View className="flex-row items-center mb-4">
            <View className="bg-green-100 p-3 rounded-full mr-4">
              <Ionicons name="globe" size={24} color="#10B981" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900">
                {noteTitle}
              </Text>
              <Text className="text-sm text-gray-500">
                Lien public généré
              </Text>
            </View>
          </View>
        </View>

        {/* Link Generation */}
        {isGenerating ? (
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
            <View className="flex-row items-center justify-center">
              <Ionicons name="refresh" size={20} color="#3B82F6" className="animate-spin mr-2" />
              <Text className="text-gray-600">Génération du lien...</Text>
            </View>
          </View>
        ) : publicLink ? (
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
            <Text className="text-sm font-medium text-gray-700 mb-3">
              Lien public généré
            </Text>
            <View className="bg-gray-100 rounded-lg p-3 mb-4">
              <Text className="text-sm text-gray-800 font-mono" selectable>
                {publicLink}
              </Text>
            </View>
            
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={copyToClipboard}
                className="flex-1 bg-blue-600 py-3 rounded-lg flex-row items-center justify-center"
              >
                <Ionicons name="copy" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text className="text-white font-medium">Copier</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={shareLink}
                className="flex-1 bg-green-600 py-3 rounded-lg flex-row items-center justify-center"
              >
                <Ionicons name="share" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text className="text-white font-medium">Partager</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
            <TouchableOpacity
              onPress={generatePublicLink}
              className="bg-blue-600 py-3 rounded-lg flex-row items-center justify-center"
            >
              <Ionicons name="link" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text className="text-white font-medium">Générer le lien</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Info Box */}
        <View className="bg-green-50 border border-green-200 rounded-xl p-4">
          <View className="flex-row items-center mb-2">
            <Ionicons name="information-circle" size={16} color="#10B981" />
            <Text className="text-green-800 font-medium ml-2">
              Partage public
            </Text>
          </View>
          <Text className="text-green-700 text-sm">
            • Toute personne avec ce lien peut voir la note{'\n'}
            • Aucune authentification requise{'\n'}
            • Le lien est permanent et sécurisé{'\n'}
            • Vous pouvez révoquer l'accès à tout moment
          </Text>
        </View>

        {/* Warning Box */}
        <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
          <View className="flex-row items-center mb-2">
            <Ionicons name="warning" size={16} color="#F59E0B" />
            <Text className="text-yellow-800 font-medium ml-2">
              Attention
            </Text>
          </View>
          <Text className="text-yellow-700 text-sm">
            Ne partagez ce lien qu'avec des personnes de confiance. Toute personne ayant le lien pourra voir le contenu de cette note.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SharePublicScreen;
