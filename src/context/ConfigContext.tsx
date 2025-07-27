import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  getUseAutoTiling,
  getAutoTilingWebSocketUri,
  getMediaMaxWidth,
  getOffsetX
} from '../utils/getFromEnv';

interface ConfigContextType {
  useAutoTiling: boolean;
  autoTilingWebSocketUri: string;
  mediaMaxWidth: string;
  isLoading: boolean;
  offsetX: string;
}

const defaultConfig: ConfigContextType = {
  useAutoTiling: false,
  autoTilingWebSocketUri: 'ws://localhost:6123',
  mediaMaxWidth: '400',
  isLoading: true,
  offsetX: '0',
};

const ConfigContext = createContext<ConfigContextType>(defaultConfig);

export const useConfig = () => useContext(ConfigContext);

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<ConfigContextType>(defaultConfig);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const [useAutoTiling, autoTilingWebSocketUri, mediaMaxWidth, offsetX] = await Promise.all([
          getUseAutoTiling(),
          getAutoTilingWebSocketUri(),
          getMediaMaxWidth(),
          getOffsetX(),
        ]);

        setConfig({
          useAutoTiling,
          autoTilingWebSocketUri,
          mediaMaxWidth,
          isLoading: false,
          offsetX,
        });
      } catch (error) {
        console.error('Failed to load configuration:', error);
        setConfig(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadConfig();
  }, []);

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
};
