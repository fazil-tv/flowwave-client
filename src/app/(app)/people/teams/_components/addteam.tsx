"use client";
import { useAlertContext } from "@/context/AlertContext";
import { makeApiCall } from '@/utils/makeApiCall';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/shadinput";
import { Label } from "@/components/ui/label";
import { useGlobalUser } from '@/hooks/useGlobalUser';
import { FcExpand, FcCollapse } from "react-icons/fc";

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useRef } from "react";
import { useGetMembersQuery } from "@/redux/user/userApi";
import { useGetUserTeamsQuery, useCreateTeamMutation } from '@/redux/user/teamApi';

import * as z from "zod";
import { ZodError } from "zod";

const teamSchema = z.object({

    TeamName: z.string().min(1, "Team name is required"),
    TeamLead: z.string().min(1, "Team lead is required"),

});


export const AddTeam: React.FC = () => {
    const { showAlert } = useAlertContext();
    const sheetCloseRef = useRef<HTMLButtonElement>(null);

    const { user } = useGlobalUser();
    const userId = user?.data?._id;

    const { refetch } = useGetUserTeamsQuery(userId);
    const [initiateTeam] = useCreateTeamMutation({});
    const { data: members } = useGetMembersQuery({});

    console.log(members,)
    const [formData, setFormData] = useState({
        TeamName: "",
        TeamLead: "",
        Members: [] as string[],
        Description: "",
    });

    const [formErrors, setFormErrors] = useState<z.ZodError | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = e.target.name === 'TeamSize'
            ? parseInt(e.target.value) || 0
            : e.target.value;

        setFormErrors((prevErrors) => {
            if (!prevErrors) return null;
            const filteredIssues = prevErrors.issues.filter(
                (issue) => issue.path[0] !== e.target.name
            );
            return filteredIssues.length ? new ZodError(filteredIssues) : null;
        });

        setFormData({
            ...formData,
            [e.target.name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        try {
            const validatedData = teamSchema.parse(formData);

            makeApiCall(


                () => initiateTeam(formData).unwrap(),

                {

                    afterSuccess: (response: any) => {
                        refetch();


                        setFormErrors(null);
                        showAlert('Team created successfully!', 'success');



                        if (sheetCloseRef.current) {
                            sheetCloseRef.current.click();
                        }

                        setFormData({
                            TeamName: "",
                            TeamLead: "",
                            Members: [],
                            Description: "",
                        });
                    },
                    afterError: (error: any) => {
                        showAlert(
                            error?.data?.message || 'An error occurred while creating the team.',
                            'error'
                        );
                    },
                    toast: (message: any) => {
                        console.log(message);
                    }
                }
            );
        } catch (error) {
            if (error instanceof z.ZodError) {
                setFormErrors(error);
            } else {
                console.error("Error validating team data:", error);
            }
        }
    };

    const getErrorMessage = (field: keyof typeof formData) => {
        return formErrors?.issues?.find(issue => issue.path[0] === field)?.message;
    };

    const toggleDropdown = () => {
        setIsOpen(prev => !prev);
    };

    const handleSelectMember = (user: { _id: string; name: string; email: string }) => {
        setFormData(prev => {
            const selectedMembers = prev.Members.includes(user._id)
                ? prev.Members.filter(id => id !== user._id)
                : [...prev.Members, user._id];

            return {
                ...prev,
                Members: selectedMembers,
            };
        });
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    className="!repeat-0 !bg-cover bg-gradient-radial from-[#a881fe] to-[#6419ff] [background-position:50%_50%] shadow-[0px_2px_12px_rgba(168,129,254,0.64),_inset_0px_1px_1px_rgba(168,129,254,1)] bg-gradient-to-r bg-transparent border-none text-white"
                >
                    New Team
                </Button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="w-full sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl overflow-y-auto pt-0  
                justify-between gap-10 h-screen bg-[rgba(49,38,85,0.07)] shadow-lg shadow-[rgba(31,38,135,0.37)]   
                backdrop-blur-[7.5px] rounded-xl border-[rgba(255,255,255,0.18)]"
            >
                <div className="h-full px-10">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold text-white mt-16">New Team</SheetTitle>
                        <SheetDescription className="text-custom-purple-light mt-2">
                            Create a new team to collaborate with.
                        </SheetDescription>
                    </SheetHeader>

                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6 py-10 mt-10">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="teamName" className="text-white">Team Name</Label>
                                <Input
                                    id="teamName"
                                    name="TeamName"
                                    value={formData.TeamName}
                                    onChange={handleChange}
                                    className="col-span-3"
                                />
                                {getErrorMessage("TeamName") && (
                                    <p className="col-span-4 text-red-500">{getErrorMessage("TeamName")}</p>
                                )}
                            </div>



                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="teamLead" className="text-white flex items-center">
                                    Team Lead
                                </Label>
                                <select
                                    id="teamLead"
                                    name="TeamLead"
                                    value={formData.TeamLead}
                                    onChange={handleChange}
                                    className="col-span-3 block w-full rounded-md bg-white px-3 py-2 text-gray-900 shadow-sm sm:text-sm"
                                >
                                    <option value="" disabled>Select Team Lead</option>
                                    {members?.data?.length > 0 ? (
                                        members.data.map(member => (
                                            <option key={member._id} value={member._id}>
                                                {member.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>Loading  users...</option>
                                    )}
                                </select>
                                {getErrorMessage("TeamLead") && (
                                    <p className="col-span-4 text-red-500">{getErrorMessage("TeamLead")}</p>
                                )}
                            </div>



                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="members" className="text-white">Choose Members</Label>
                                <div className="col-span-3 relative">
                                    <button
                                        type="button"
                                        onClick={toggleDropdown}
                                        className=" w-full rounded-md  px-3 py-2  text-gray-900 shadow-sm sm:text-sm flex items-center justify-between
                                        ">
                                        <span className="flex items-center
                                        ">
                                            {formData.Members.length > 0 ? (
                                                members?.data
                                                    .filter(user => formData.Members.includes(user._id))
                                                    .map(user => (
                                                        <img
                                                            key={user._id}
                                                            src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                                                            alt="Avatar"
                                                            className="h-8 w-8 rounded-full mr-2"
                                                        />
                                                    ))
                                            ) : (
                                                <span className='text-white'>Select members...</span>
                                            )}
                                        </span>

                                        <span className="ml-2">
                                            {!isOpen ? <FcExpand className='' /> : <FcCollapse />}
                                        </span>
                                    </button>
                                    {isOpen && (
                                        <div className="absolute z-10  border rounded-md shadow-lg mt-1 w-full bg-white">
                                            {members?.data.map(user => (
                                                <div
                                                    key={user._id}
                                                    onClick={() => handleSelectMember(user)}
                                                    className={`flex items-center p-2 cursor-pointer hover:bg-gray-200 ${formData.Members.includes(user._id) ? 'bg-gray-200' : ''}`}
                                                >
                                                    <img
                                                        src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                                                        alt="Avatar"
                                                        className="h-8 w-8 rounded-full mr-2"
                                                    />
                                                    <div className="flex flex-col">
                                                        <div className='font-light'>{user.name}</div>
                                                        <div className='font-light text-custom-purple-light text-xs'>{user.email}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {getErrorMessage("Members") && (
                                    <p className="col-span-4 text-red-500">{getErrorMessage("Members")}</p>
                                )}
                            </div>



                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-white">Description</Label>
                                <textarea
                                    id="description"
                                    name="Description"
                                    value={formData.Description}
                                    onChange={handleChange}
                                    className="col-span-3 min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2"
                                />
                                {getErrorMessage("Description") && (
                                    <p className="col-span-4 text-red-500">{getErrorMessage("Description")}</p>
                                )}
                            </div>

                        </div>

                        <SheetFooter className="mt-6">
                            <SheetClose asChild>
                                <Button className="bg-white" type="button" ref={sheetCloseRef}>
                                    Cancel
                                </Button>
                            </SheetClose>
                            <Button
                                type="submit"
                                className="!repeat-0 !bg-cover bg-gradient-radial from-[#a881fe] to-[#6419ff] [background-position:50%_50%] shadow-[0px_2px_12px_rgba(168,129,254,0.64),_inset_0px_1px_1px_rgba(168,129,254,1)] bg-gradient-to-r bg-transparent border-none text-white"
                            >
                                Create Team
                            </Button>
                        </SheetFooter>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    );
};