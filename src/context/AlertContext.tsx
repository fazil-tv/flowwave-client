"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type AlertType = 'success' | 'error' | 'info' | null;

interface Alert {
  message: string;
  type: AlertType;
}

interface AlertContextProps {
  alert: Alert;
  showAlert: (message: string, type: AlertType) => void;
  resetAlert: () => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alert, setAlert] = useState<Alert>({ message: '', type: null });

  const showAlert = (message: string, type: AlertType) => setAlert({ message, type });
  const resetAlert = () => setAlert({ message: '', type: null });

  return (
    <AlertContext.Provider value={{ alert, showAlert, resetAlert }}>
      {children}
    </AlertContext.Provider>
  );
};


export const useAlertContext = (): AlertContextProps => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlertContext must be used within an AlertProvider');
  }
  return context;
};
