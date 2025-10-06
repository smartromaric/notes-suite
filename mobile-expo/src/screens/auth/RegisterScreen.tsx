import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../store';
import { registerUser } from '../../store/auth/authSlice';
import { Ionicons } from '@expo/vector-icons';

const RegisterScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation() as any;
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email valide');
      return;
    }

    dispatch(registerUser({ name: name.trim(), email: email.trim(), password }));
  };

  const handleLogin = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1">
        {/* Top Section with Dark Green Background */}
        <View className="flex-1 bg-gray-900 relative">
          {/* Background Image Effect */}
          <View className="absolute inset-0 bg-gray-900 opacity-90" />
          
          {/* Yellow Circle Icon */}
          <View className="items-center mt-20 mb-6">
            <View className="w-16 h-16 bg-yellow-500 rounded-full items-center justify-center">
              <View className="w-8 h-8">
                <View className="w-full h-0.5 bg-white mb-1" />
                <View className="w-full h-0.5 bg-white mb-1" />
                <View className="w-full h-0.5 bg-white" />
              </View>
            </View>
          </View>

          {/* Welcome Text */}
          <View className="items-center px-8">
            <Text className="text-white text-2xl font-bold text-center">
                Créer un compte
              </Text>
            <Text className="text-gray-300 text-center mt-2">
              Rejoignez-nous pour commencer
              </Text>
            </View>
          </View>

        {/* Bottom Section with White Card */}
        <View className="bg-white rounded-t-3xl -mt-8 flex-1 px-8 pt-8">
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Name Input */}
            <View className="mb-6">
              <Text className="text-gray-500 text-sm mb-2">Nom complet</Text>
              <View className="border-b border-gray-300 focus:border-yellow-500 pb-2">
                  <TextInput
                  className="text-base text-black"
                  placeholder="Votre nom complet"
                    placeholderTextColor="#9CA3AF"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
              </View>
            </View>

            {/* Email Input */}
            <View className="mb-6">
              <Text className="text-gray-500 text-sm mb-2">Email Address</Text>
              <View className="border-b border-gray-300 focus:border-yellow-500 pb-2">
                  <TextInput
                  className="text-base text-black"
                    placeholder="votre@email.com"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-gray-500 text-sm mb-2">Password</Text>
              <View className="border-b border-gray-300 focus:border-yellow-500 pb-2">
                  <TextInput
                  className="text-base text-black"
                  placeholder="Mot de passe"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
              </View>
            </View>

            {/* Confirm Password Input */}
            <View className="mb-6">
              <Text className="text-gray-500 text-sm mb-2">Confirmer le mot de passe</Text>
              <View className="border-b border-gray-300 focus:border-yellow-500 pb-2">
                  <TextInput
                  className="text-base text-black"
                  placeholder="Confirmer le mot de passe"
                    placeholderTextColor="#9CA3AF"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
              </View>
            </View>

            {/* Error Message */}
            {error && (
              <View className="bg-red-50 border border-red-200 rounded-xl mb-6">
                <View className="flex-row items-center p-4">
                  <Ionicons name="alert-circle" size={20} color="#DC2626" style={{ marginRight: 12 }} />
                  <Text className="text-red-800 text-sm flex-1">
                    {error}
                  </Text>
                </View>
              </View>
            )}

            {/* Register Button */}
            <TouchableOpacity
              className={`rounded-xl py-4 mb-6 ${
                isLoading ? 'bg-gray-400' : 'bg-yellow-500'
              }`}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <View className="flex-row items-center justify-center">
                {isLoading && (
                  <Ionicons name="refresh" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                )}
                <Text className="text-white font-bold text-lg">
                  {isLoading ? 'Création...' : 'CRÉER UN COMPTE'}
                </Text>
              </View>
            </TouchableOpacity>

          {/* Login Link */}
            <TouchableOpacity className="items-center" onPress={handleLogin}>
              <Text className="text-gray-500 text-sm">
                Vous avez déjà un compte? <Text className="font-bold text-black">SE CONNECTER</Text>
                </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;