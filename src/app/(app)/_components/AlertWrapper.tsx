"use client"; 

import { useAlertContext } from "@/context/AlertContext";
import { Alert } from "./Alert";

const AlertWrapper = () => {
  const { alert, resetAlert } = useAlertContext();
  return <Alert message={alert.message} type={alert.type} resetAlert={resetAlert} />;
};

export default AlertWrapper; 
