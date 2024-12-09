'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { makeApiCall } from '@/utils/makeApiCall';
import { useAlertContext } from "@/context/AlertContext";
import { TaskSpinner } from '@/components/animated/spinner';

const EditUserSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
    email: z.string().email({ message: "Invalid email address" }).optional(),
    otp: z.string().optional()
});

type EditUserFormData = z.infer<typeof EditUserSchema>;

function EditUserInfo({ user }: { user: any }) {
    const { showAlert } = useAlertContext();
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [isOtpRequired, setIsOtpRequired] = useState(false);
    const [formData, setFormData] = useState<EditUserFormData>({
        name: user.name || '',
        email: user.email || '',
        otp: ''
    });

    const [validationErrors, setValidationErrors] = useState<{
        name?: string;
        email?: string;
        otp?: string;
    }>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };


        const hasEmailChanged = newFormData.email !== user.email;
        setIsOtpRequired(hasEmailChanged);

        setFormData(newFormData);
    };

    const handleValidation = () => {
        try {
            EditUserSchema.parse(formData);
            setValidationErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors = error.flatten().fieldErrors;
                setValidationErrors({
                    name: errors.name?.[0],
                    email: errors.email?.[0],
                    otp: errors.otp?.[0]
                });
            }
            return false;
        }
    };

    const handleSubmit = async () => {
        if (!handleValidation()) return;

        // await makeApiCall(
        //     () => updateUserProfile(formData),
        //     {
        //         toast: showAlert,
        //         afterSuccess: () => {
        //             setIsOpen(false);
        //             // Optionally refresh user data
        //         },
        //         afterError: (error) => {
        //             console.error(error);
        //         }
        //     }
        // );
    };

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        setFormData({
            name: user.name || '',
            email: user.email || '',
            otp: ''
        });
        setValidationErrors({});
        setIsOtpRequired(false);
    };
    

    return (
        <div>
            <Button onClick={openModal} variant="outline">
                Edit Profile
            </Button>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 ">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

                        <div className="space-y-4">
                            <div>
                                <Input
                                    name="name"
                                    label="Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    error={validationErrors.name}
                                />
                            </div>

                            <div>
                                <Input
                                    name="email"
                                    label="Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    error={validationErrors.email}
                                />
                            </div>

                            {isOtpRequired && (
                                <div>
                                    <Input
                                        name="otp"
                                        label="OTP"
                                        value={formData.otp}
                                        onChange={handleInputChange}
                                        error={validationErrors.otp}
                                    />
                                </div>
                            )}

                            <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={closeModal}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmit}>
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditUserInfo;