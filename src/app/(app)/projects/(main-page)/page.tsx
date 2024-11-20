"use client";
import React, { useState } from "react";
import { AddProject } from "./_components/AddProject";
import { Alert } from "../../_components/Alert"
import { Projects } from './_components/Projects'

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
    <div >
      <div className=" flex justify-center">
        <Alert message={alert.message} type={alert.type} resetAlert={resetAlert} />
      </div>
      <div className="flex py-10 justify-end px-0 sm:px-0 lg:px-0">
        <AddProject showAlert={showAlert} />
      </div>
      <Projects />
    </div>
  );
}

export default Page;
