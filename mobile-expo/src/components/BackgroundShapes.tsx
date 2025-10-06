import React from 'react';
import { View } from 'react-native';

const BackgroundShapes: React.FC = () => {
  return (
    <View className="absolute inset-0 overflow-hidden">
      {/* Large curved shape from top-left */}
      <View 
        className="absolute -top-20 -left-20 w-80 h-80 bg-yellow-400 rounded-full opacity-20"
        style={{
          transform: [{ rotate: '-15deg' }],
        }}
      />
      
      {/* Medium curved shape from bottom-left */}
      <View 
        className="absolute -bottom-16 -left-16 w-64 h-64 bg-yellow-300 rounded-full opacity-25"
        style={{
          transform: [{ rotate: '25deg' }],
        }}
      />
      
      {/* Small accent circles */}
      <View className="absolute top-32 right-8 w-12 h-12 bg-yellow-500 rounded-full opacity-30" />
      <View className="absolute top-48 right-16 w-8 h-8 bg-yellow-400 rounded-full opacity-40" />
      <View className="absolute bottom-32 right-12 w-16 h-16 bg-yellow-300 rounded-full opacity-20" />
      
      {/* Additional flowing shapes */}
      <View 
        className="absolute top-40 right-20 w-32 h-32 bg-yellow-200 rounded-full opacity-15"
        style={{
          transform: [{ rotate: '45deg' }],
        }}
      />
      
      <View 
        className="absolute bottom-40 left-8 w-24 h-24 bg-yellow-400 rounded-full opacity-20"
        style={{
          transform: [{ rotate: '-30deg' }],
        }}
      />
    </View>
  );
};

export default BackgroundShapes;
