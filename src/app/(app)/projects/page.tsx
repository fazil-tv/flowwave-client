"use client";
import React, { useState } from "react";
import { AddProject } from "./_components/AddProject"; 
import { Alert } from "./_components/Alert"; 

function Page() {

  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | null }>({
    message: "",
    type: null,
  });

  const showAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
  };


  const resetAlert = () => {
    setAlert({ message: "", type: null });
  };

  return (
    <div>
     
      <div className=" flex justify-center">
      <Alert message={alert.message} type={alert.type} resetAlert={resetAlert}  />
      </div>
    

      <div className="flex justify-end px-4 sm:px-6 lg:px-8">
        
        <AddProject showAlert={showAlert} />
      </div>
    </div>
  );
}

export default Page;
