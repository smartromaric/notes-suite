import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../store';
import { shareNote } from '../../store/notes/notesSlice';
import { Ionicons } from '@expo/vector-icons';

interface ShareNoteScreenProps {
  route: {
    params: {
      noteId: number;
      noteTitle: string;
    };
  };
}

const ShareNoteScreen: React.FC<ShareNoteScreenProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation() as any;
  const route = useRoute();
  const { noteId, noteTitle } = route.params as { noteId: number; noteTitle: string };
  const { isLoading } = useSelector((state: RootState) => state.notes);
  
  const [email, setEmail] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleShare = async () => {
    if (!email.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir une adresse email');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Erreur', 'Veuillez saisir une adresse email valide');
      return;
    }

    try {
      await dispatch(shareNote({ noteId, email: email.trim() })).unwrap();
      Alert.alert(
        'Succès',
        `La note "${noteTitle}" a été partagée avec ${email}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Erreur', error || 'Erreur lors du partage');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white border-b border-gray-200 px-6 py-4">
          <View className="flex-row items-center justify-between mt-8">
            <TouchableOpacity
              onPress={handleCancel}
              className="p-2 -ml-2"
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            
            <Text className="text-lg font-semibold text-gray-900">
              Partager la note
            </Text>
            
            <TouchableOpacity
              onPress={handleShare}
              disabled={isLoading || !email.trim()}
              className={`px-4 py-2 rounded-lg ${
                isLoading || !email.trim()
                  ? 'bg-gray-300'
                  : 'bg-green-600'
              }`}
            >
              <Text className="text-white font-medium">
                {isLoading ? 'Partage...' : 'Partager'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-1 p-6">
          {/* Note Info */}
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-100 p-3 rounded-full mr-4">
                <Ionicons name="document-text" size={24} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900">
                  {noteTitle}
                </Text>
                <Text className="text-sm text-gray-500">
                  Note à partager
                </Text>
              </View>
            </View>
          </View>

          {/* Email Input */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Adresse email du destinataire *
            </Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900"
              placeholder="exemple@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
            />
            <Text className="text-xs text-gray-500 mt-1">
              L'utilisateur recevra un accès en lecture à cette note
            </Text>
          </View>

          {/* Info Box */}
          <View className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="information-circle" size={16} color="#3B82F6" />
              <Text className="text-blue-800 font-medium ml-2">
                Information
              </Text>
            </View>
            <Text className="text-blue-700 text-sm">
              • Le destinataire pourra voir et lire cette note{'\n'}
              • Il recevra une notification par email{'\n'}
              • Vous pourrez révoquer l'accès à tout moment
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ShareNoteScreen;
