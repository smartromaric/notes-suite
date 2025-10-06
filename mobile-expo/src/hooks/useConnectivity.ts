import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export interface ConnectivityState {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
  isOffline: boolean;
}

export const useConnectivity = () => {
  const [connectivity, setConnectivity] = useState<ConnectivityState>({
    isConnected: false,
    isInternetReachable: null,
    type: null,
    isOffline: true,
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setConnectivity({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
        isOffline: !state.isConnected || state.isInternetReachable === false,
      });
    });

    // Get initial state
    NetInfo.fetch().then(state => {
      setConnectivity({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
        isOffline: !state.isConnected || state.isInternetReachable === false,
      });
    });

    return () => unsubscribe();
  }, []);

  return connectivity;
};
