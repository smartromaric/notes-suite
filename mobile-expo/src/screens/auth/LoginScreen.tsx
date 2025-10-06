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
import { loginUser } from '../../store/auth/authSlice';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    dispatch(loginUser({ email, password }));
  };

  const handleRegister = () => {
    (navigation as any).navigate('Register');
  };

  const handleForgotPassword = () => {
    // Navigation vers l'écran de récupération de mot de passe
    console.log('Navigate to forgot password');
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
              Welcome Back!
            </Text>
          </View>
        </View>

        {/* Bottom Section with White Card */}
        <View className="bg-white rounded-t-3xl -mt-8 flex-1 px-8 pt-8">
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Email Input */}
            <View className="mb-6">
              <Text className="text-gray-500 text-sm mb-2">Email Address</Text>
              <View className="border-b border-gray-300 focus:border-yellow-500 pb-2">
                  <TextInput
                  className="text-base text-black"
                  placeholder="johnwilliams@gmail.com"
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
                  className="text-base text-black "
                  placeholder="Password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

            {/* Remember me and Forgot Password */}
            <View className="flex-row justify-between items-center mb-8">
              <View className="flex-row items-center">
                <View className="w-4 h-4 border border-gray-400 rounded mr-2" />
                <Text className="text-gray-500 text-sm">Remember me</Text>
              </View>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text className="text-gray-500 text-sm">Forgot Password?</Text>
              </TouchableOpacity>
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

            {/* Login Button */}
            <TouchableOpacity
              className={`rounded-xl py-4 mb-6 ${
                isLoading ? 'bg-gray-400' : 'bg-yellow-500'
              }`}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <View className="flex-row items-center justify-center">
                {isLoading && (
                  <Ionicons name="refresh" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                )}
                <Text className="text-white font-bold text-lg">
                  {isLoading ? 'Connexion...' : 'LOGIN'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Register Link */}
            <TouchableOpacity className="items-center" onPress={handleRegister}>
              <Text className="text-gray-500 text-sm">
                Don't have an account? <Text className="font-bold text-black">SIGN UP</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
