"use client";

import { makeApiCall } from '@/utils/makeApiCall';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/shadinput";
import { Label } from "@/components/ui/label";
import { useGlobalUser } from '@/hooks/useGlobalUser';
import { FcExpand, FcCollapse } from "react-icons/fc";
import { useAlertContext } from "@/context/AlertContext";


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
import { useState, useRef, useEffect } from "react";
import { useGetMembersQuery } from "@/redux/user/userApi";
import { useGetUserTeamsQuery, useUpdateTeamMutation } from '@/redux/user/teamApi';

import * as z from "zod";
import { ZodError } from "zod";
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuShortcut } from '@/components/ui/dropdown-menu';

const teamSchema = z.object({
    TeamName: z.string().min(1, "Team name is required"),
    TeamLead: z.string().min(1, "Team lead is required"),
});

interface EditTeamProps {
    team: any;
}

export const EditTeam: React.FC<EditTeamProps> = ({ team }) => {
    const { showAlert } = useAlertContext();
    const sheetCloseRef = useRef<HTMLButtonElement>(null);

    const { user } = useGlobalUser();
    const userId = user?.data?._id;

    const { refetch } = useGetUserTeamsQuery(userId);
    const [updateTeam] = useUpdateTeamMutation({});
    const { data: members } = useGetMembersQuery({});

    const [formData, setFormData] = useState({
        TeamName: team.TeamName,
        TeamLead: team.TeamLead?._id || "",
        Members: team?.memberIds || [],
        Description: team.Description,
    });

    const [initialFormData] = useState(formData);


    const [formErrors, setFormErrors] = useState<z.ZodError | null>(null);
    const [LeadisOpen, setLeadisOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {

        setIsDirty(JSON.stringify(formData) !== JSON.stringify(initialFormData));
    }, [formData, initialFormData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = e.target.value;

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
        console.log("Form submitted:", formData);

        try {


            const validatedData = teamSchema.parse(formData);

            console.log(validatedData, "validatedData");




            makeApiCall(
                () => updateTeam({ id: team._id, ...formData }).unwrap(),
                {
                    afterSuccess: (response: any) => {

                        refetch();
                        showAlert('Team Updated successfully!', 'success');
                        setFormErrors(null);
                        if (sheetCloseRef.current) {
                            sheetCloseRef.current.click();
                        }
                    },
                    afterError: (error: any) => {
                        showAlert(
                            error?.data?.message || 'An error occurred while creating the team.',
                            'error'
                        );
                        console.log(error)
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

    const LeadtoggleDropdown = () => {
        setLeadisOpen(prev => !prev);
    };
    const handleSelectMember = (user: { _id: string; name: string; email: string }) => {
        setFormData(prev => {

            const isMemberAlreadySelected = prev.Members.some(member =>
                (typeof member === 'string' ? member : member._id) === user._id
            );

            const updatedMembers = isMemberAlreadySelected

                ? prev.Members.filter(member =>
                    (typeof member === 'string' ? member : member._id) !== user._id
                )

                : [...prev.Members, user];

            return {
                ...prev,
                Members: updatedMembers,
            };
        });
    };
    return (
        <Sheet>
            <SheetTrigger asChild>

                <span className=" hover:text-black">Edit Team</span>


            </SheetTrigger>

            <SheetContent
                side="right"
                className="w-full sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl overflow-y-auto pt-0 
                justify-between gap-10 h-screen bg-[rgba(49,38,85,0.07)] shadow-lg shadow-[rgba(31,38,135,0.37)] 
                backdrop-blur-[7.5px] rounded-xl border-[rgba(255,255,255,0.18)]"
            >
                <div className="h-full px-10">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold text-white mt-16">Edit Team</SheetTitle>
                        <SheetDescription className="text-custom-purple-light mt-2">
                            Update the team details.
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
                                <div className="col-span-3 relative">
                                    <button
                                        type="button"
                                        onClick={LeadtoggleDropdown}
                                        className="w-full rounded-md bg-white px-3 py-2 text-gray-900 shadow-sm sm:text-sm flex items-center justify-between"
                                    >
                                        <span className="flex items-center">
                                            {formData.TeamLead ? (
                                                <div className="flex items-center">
                                                    <img
                                                        src={formData.TeamLead.avatar || "default-avatar-url"}
                                                        alt="Team Lead Avatar"
                                                        className="h-8 w-8 rounded-full mr-2"
                                                    />
                                                    <div className="flex flex-col">
                                                        <div className="font-light">{formData.TeamLead.name}</div>
                                                        <div className="font-light text-custom-purple-light text-xs">
                                                            {formData.TeamLead.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span>Select Team Lead</span>
                                            )}
                                        </span>
                                        <span className="ml-2">
                                            {!LeadisOpen ? <FcExpand /> : <FcCollapse />}
                                        </span>
                                    </button>

                                    {LeadisOpen && members?.data && (
                                        <div className="absolute z-10 border rounded-md shadow-lg mt-1 w-full bg-white">
                                            {members.data.map(member => (
                                                <div
                                                    key={member._id}
                                                    onClick={() => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            TeamLead: member._id
                                                        }));
                                                        setLeadisOpen(false);
                                                    }}
                                                    className={`flex items-center p-2 cursor-pointer hover:bg-gray-200 
                                                        ${formData.TeamLead._id === member._id ? 'bg-gray-200' : ''}`}
                                                >
                                                    <img
                                                        src={member.avatar || "default-avatar-url"}
                                                        alt="Avatar"
                                                        className="h-8 w-8 rounded-full mr-2"
                                                    />
                                                    <div className="flex flex-col">
                                                        <div className="font-light">{member.name}</div>
                                                        <div className="font-light text-custom-purple-light text-xs">
                                                            {member.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>











                            <div className="grid grid-cols-4 items-center gap-4 mt-4">
                                <Label htmlFor="members" className="text-white">Choose Members</Label>
                                <div className="col-span-3 relative">
                                    <button
                                        type="button"
                                        onClick={toggleDropdown}
                                        className="w-full rounded-md px-3 py-2 text-gray-900 shadow-sm sm:text-sm flex items-center justify-between"
                                    >
                                        <span className="flex items-center">
                                            {Array.isArray(formData.Members) && formData.Members.length > 0 ? (
                                                formData.Members.map(member => (
                                                    <img
                                                        key={member._id}
                                                        src={member.avatar || "default-avatar-url"}
                                                        alt="Avatar"
                                                        className="h-8 w-8 rounded-full mr-2"
                                                    />
                                                ))
                                            ) : (
                                                <span className='text-white'>Select members...</span>
                                            )}
                                        </span>

                                        <span className="ml-2">
                                            {!isOpen ? <FcExpand /> : <FcCollapse />}
                                        </span>
                                    </button>

                                    {isOpen && members?.data && (
                                        <div className="absolute z-10 border rounded-md shadow-lg mt-1 w-full bg-white">
                                            {members.data.map(user => (
                                                <div
                                                    key={user._id}
                                                    onClick={() => handleSelectMember(user)}
                                                    className={`flex items-center p-2 cursor-pointer hover:bg-gray-200 
                                                    ${Array.isArray(formData.Members) && formData.Members.some(member => member._id === user._id) ? 'bg-gray-200' : ''}`}
                                                >
                                                    <img
                                                        src={user.avatar || "default-avatar-url"}
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
                            </div>






















                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-white">Description</Label>
                                <textarea
                                    id="description"
                                    name="Description"
                                    value={formData.Description}
                                    onChange={handleChange}
                                    className="col-span-3 block w-full rounded-md bg-white px-3 py-2 text-gray-900 shadow-sm sm:text-sm"
                                    rows={4}
                                />
                            </div>
                        </div>

                        
                        
                        <SheetFooter>
                        <SheetClose asChild>
                            <Button className="bg-white" type="button" ref={sheetCloseRef}>
                                Cancel
                            </Button>
                        </SheetClose>
                            <Button type="submit" disabled={!isDirty}>Save changes</Button>
                        </SheetFooter>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default EditTeam;
