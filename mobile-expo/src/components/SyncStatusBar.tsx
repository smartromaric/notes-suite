import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useConnectivity } from '../hooks/useConnectivity';
import { syncService, SyncStatus } from '../services/syncService';

interface SyncStatusBarProps {
  onSyncPress?: () => void;
}

const SyncStatusBar: React.FC<SyncStatusBarProps> = ({ onSyncPress }) => {
  const connectivity = useConnectivity();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(syncService.getStatus());

  useEffect(() => {
    const unsubscribe = syncService.addListener(setSyncStatus);
    return unsubscribe;
  }, []);

  const getStatusColor = () => {
    if (syncStatus.isSyncing) return 'bg-blue-500';
    if (connectivity.isOffline) return 'bg-gray-500';
    if (syncStatus.pendingActions > 0) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusText = () => {
    if (syncStatus.isSyncing) return 'Synchronisation...';
    if (connectivity.isOffline) return 'Mode hors ligne';
    if (syncStatus.pendingActions > 0) return `${syncStatus.pendingActions} action(s) en attente`;
    return 'Synchronisé';
  };

  const getStatusIcon = () => {
    if (syncStatus.isSyncing) return 'sync';
    if (connectivity.isOffline) return 'cloud-offline';
    if (syncStatus.pendingActions > 0) return 'time';
    return 'checkmark-circle';
  };

  if (!connectivity.isOffline && syncStatus.pendingActions === 0 && !syncStatus.isSyncing) {
    return null; // Hide when everything is synced and online
  }

  return (
    <TouchableOpacity
      className={`${getStatusColor()} px-4 py-2 flex-row items-center justify-center`}
      onPress={onSyncPress}
      disabled={connectivity.isOffline || syncStatus.isSyncing}
    >
      {syncStatus.isSyncing ? (
        <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
      ) : (
        <Ionicons 
          name={getStatusIcon() as any} 
          size={16} 
          color="#FFFFFF" 
          style={{ marginRight: 8 }} 
        />
      )}
      <Text className="text-white text-sm font-medium">
        {getStatusText()}
      </Text>
      {syncStatus.pendingActions > 0 && !syncStatus.isSyncing && (
        <View className="ml-2 bg-white bg-opacity-20 rounded-full px-2 py-1">
          <Text className="text-white text-xs font-bold">
            {syncStatus.pendingActions}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SyncStatusBar;
