"use client";
import React, { useEffect, useState } from "react";

interface AlertProps {
  message: string;
  type: "success" | "error" | null;
  resetAlert: () => void;
}

export const Alert: React.FC<AlertProps> = ({ message, type, resetAlert }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message && type) {
      setIsVisible(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
        resetAlert(); 
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, type, resetAlert]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed  top-0  z-[9999] p-4  text-white   rounded-b-lg shadow-lg mx-auto ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {message}
    </div>

  );
};
