
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import * as api from '../services/api';
import { LogEntry, LogEvent } from '../types';

interface LogContextType {
  logs: LogEntry[];
  logEvent: (event: LogEvent) => void;
}

const LogContext = createContext<LogContextType | undefined>(undefined);

export const LogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    api.getLogs().then(setLogs);
  }, []);

  const logEvent = useCallback((event: LogEvent) => {
    api.logEvent(event).then(newLog => {
        setLogs(prevLogs => [newLog, ...prevLogs]);
    });
  }, []);

  return (
    <LogContext.Provider value={{ logs, logEvent }}>
      {children}
    </LogContext.Provider>
  );
};

export const useLog = () => {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error('useLog must be used within a LogProvider');
  }
  return context;
};