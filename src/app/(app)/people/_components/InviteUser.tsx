'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/shadinput';
import { useGetMembersQuery, useGetUserProjectsQuery, useInviteMemberMutation } from '@/redux/user/userApi';
import { makeApiCall } from '@/utils/makeApiCall';
import { Label } from '@/components/ui/label';
import { useAlertContext } from "@/context/AlertContext";
import { TaskSpinner } from '@/components/animated/spinner';


export enum MemberRole {
    DEFAULT = 'default',
    OWNER = 'owner',
    ADMIN = 'admin',
    EDITOR = 'editor',
    VIEWER = 'viewer',
}


const InviteUserSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    projects: z.array(z.string()).min(1, { message: "Select at least one project" }),
    role: z.enum(Object.values(MemberRole) as [string, ...string[]], {
        errorMap: () => ({ message: "Please select a valid role" })
    }),
});

type InviteUserFormData = z.infer<typeof InviteUserSchema>;

function InviteUser() {
    const { showAlert } = useAlertContext();
    const { data: projects, error } = useGetUserProjectsQuery({});
    const [inviteMember, { isLoading, isError }] = useInviteMemberMutation();
    const { refetch } = useGetMembersQuery({});
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<InviteUserFormData>({
        name: '',
        email: '',
        projects: [],
        role: MemberRole.DEFAULT,
    });


    const [validationErrors, setValidationErrors] = useState<{
        name?: string;
        email?: string;
        projects?: string;
        role?: string;
    }>({});

    const roles = Object.values(MemberRole);

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        setStep(1);
        setFormData({
            name: '',
            email: '',
            projects: [],
            role: MemberRole.DEFAULT,
        });
        setValidationErrors({});
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear specific field validation error when user starts typing  
        setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const validateStep = () => {
        try {
            if (step === 1) {

                InviteUserSchema.pick({ name: true, email: true }).parse(formData);
                return true;
            } else if (step === 2) {

                InviteUserSchema.pick({ projects: true }).parse(formData);
                return true;
            } else if (step === 3) {

                InviteUserSchema.parse(formData);
                return true;
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors = error.flatten().fieldErrors;
                setValidationErrors({
                    name: errors.name?.[0],
                    email: errors.email?.[0],
                    projects: errors.projects?.[0],
                    role: errors.role?.[0],
                });
            }
            return false;
        }
    };

    const handleNext = () => {
        if (validateStep()) {
            setStep((prev) => prev + 1);
        }
    };

    const handleBack = () => setStep((prev) => prev - 1);


    const handleProjectToggle = (project: string) => {
        setFormData((prev) => {
            const newProjects = prev.projects.includes(project)
                ? prev.projects.filter((p) => p !== project)
                : [...prev.projects, project];
            return { ...prev, projects: newProjects };
        });
    };



    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRole = e.target.value as MemberRole;
        setFormData((prev) => ({ ...prev, role: selectedRole }));

        setValidationErrors((prev) => ({ ...prev, role: undefined }));
    };

    const handleSubmit = () => {

        try {
            InviteUserSchema.parse(formData);

            makeApiCall(
                () => inviteMember(formData).unwrap(),
                {
                    afterSuccess: (response: any) => {
                        refetch();
                        closeModal();
                        showAlert('User invited successfully!', 'success');
                    },
                    afterError: (error: any) => {
                        console.log(error);
                        showAlert(
                            error?.data?.message || 'An error occurred while inviting the user.',
                            'error'
                        );
                    },
                    toast: (message: any) => {
                        console.log(message);
                    },
                }
            );
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors = error.flatten().fieldErrors;
                setValidationErrors({
                    name: errors.name?.[0],
                    email: errors.email?.[0],
                    projects: errors.projects?.[0],
                    role: errors.role?.[0],
                });
            }
        }
    };

    return (
        <div>
            <Button
                onClick={openModal}
                variant="outline"
                className="bg-gradient-to-r from-[#a881fe] to-[#6419ff] text-white border-none shadow-[0px_2px_12px_rgba(168,129,254,0.64),_inset_0px_1px_1px_rgba(168,129,254,1)]"
            >
                <span className="mx-1 font-extrabold">+</span>Invite Users
            </Button>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 text-white">
                    <div className="p-6 w-11/12 max-w-2xl relative bg-[rgba(103,61,245,0.1)] backdrop-blur-[50px] rounded-[16px] border-[rgba(255,255,255,0.18)] bg-blend-lighten shadow-[0px_2px_12px_rgba(168,129,254,0.64),_inset_0px_1px_1px_rgba(168,129,254,1)]">
                        <h3 className="font-bold text-lg mb-4">Invite Users</h3>

                        <Button
                            className="absolute top-2 right-2 text-white bg-transparent hover:bg-white hover:text-black rounded-full w-8 h-8 flex items-center justify-center"
                            onClick={closeModal}
                        >
                            <span className="sr-only">Close</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-4 h-4"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </Button>

                        {step === 1 && (
                            <div className="space-y-4">
                                <p>Who would you like to invite?</p>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="relative z-0">
                                        <Input
                                            className="col-span-3 block w-full rounded-md bg-white px-3 py-2 text-gray-900 shadow-sm sm:text-sm"
                                            name="name"
                                            placeholder="Name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        {validationErrors.name && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {validationErrors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="relative z-0">
                                        <Input
                                            className="col-span-3 block w-full rounded-md bg-white px-3 py-2 text-gray-900 shadow-sm sm:text-sm"
                                            name="email"
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        {validationErrors.email && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {validationErrors.email}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <p>Select projects to add the user to:</p>
                                {projects?.data && Array.isArray(projects.data) ? (
                                    <>
                                        {projects.data.map((project: any) => (
                                            <div key={project._id} className="flex items-center space-x-2">

                                                <input type="checkbox" className="checkbox"
                                                    id={project._id}
                                                    checked={formData.projects.includes(project._id)}
                                                    onChange={() => handleProjectToggle(project._id)}
                                                />

                                                <label htmlFor={project._id} className="text-sm font-medium">
                                                    {project.projectName}
                                                </label>
                                            </div>
                                        ))}
                                        {validationErrors.projects && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {validationErrors.projects}
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <p>No projects available</p>
                                )}
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4">
                                <Label htmlFor="projectLead" className="text-white">
                                    Assign a Role
                                </Label>
                                <select
                                    id="projectLead"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleRoleChange}
                                    className="col-span-3 block w-full rounded-md bg-white px-3 py-2 text-gray-900 shadow-sm sm:text-sm"
                                >
                                    <option value="" disabled>
                                        Select a Role
                                    </option>
                                    {roles.map((role) => (
                                        <option key={role} value={role}>
                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                {validationErrors.role && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {validationErrors.role}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="flex justify-between mt-6">
                            {step > 1 && (
                                <Button onClick={handleBack} variant="outline" className="border-white">
                                    Back
                                </Button>
                            )}
                            {step < 3 ? (
                                <Button onClick={handleNext} className="bg-white text-black ml-auto">
                                    Next
                                </Button>
                            ) : (
                                <Button
                                onClick={handleSubmit}
                                className="bg-gradient-to-r from-[#a881fe] to-[#6419ff] text-white border-none shadow-[0px_2px_12px_rgba(168,129,254,0.64),_inset_0px_1px_1px_rgba(168,129,254,1)] flex items-center justify-center"
                                disabled={isLoading} 
                            >
                                {isLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <TaskSpinner /> 
                                        <p>Loading...</p>
                                    </div>
                                ) : (
                                    <p>Invite</p>
                                )}
                            </Button>
                            )}
                        </div>

                        <div className="mt-6 flex justify-center space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className={`w-3 h-3 rounded-full ${step >= i ? 'bg-white' : 'bg-gray-500'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default InviteUser;