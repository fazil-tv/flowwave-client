"use client"
import React, { useState } from 'react'
import { SingleProjectView } from './_components/SingleProjectView';
import { Alert } from '@/app/(app)/_components/Alert';

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
        <>
        <div className="  bg-[url('/images/invite-bg.svg')]">
            <div className=" flex justify-center">
                <Alert message={alert.message} type={alert.type} resetAlert={resetAlert} />
            </div>
            <div className=" flex justify-center">
                <SingleProjectView showAlert={showAlert} />
            </div>
            </div>
        </>
    )
}

export default page