"use client"
import React, { useState } from 'react'
import { AddTask } from './_components/addtask'
import { Alert } from '@/app/(app)/_components/Alert';
import Taskview from './_components/taskview';


function page() {
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
    <div className='text-white'>
      <Alert message={alert.message} type={alert.type} resetAlert={resetAlert} />
      <div className="flex py-10 justify-end px-0 sm:px-0 lg:px-0 ">
        
      
        <AddTask showAlert={showAlert} />
       
      </div>
      <div>
        <Taskview showAlert={showAlert} />
      </div>
    </div>
  )
}

export default page