"use client"

import { makeApiCall } from '@/utils/makeApiCall';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/shadinput"
import { Label } from "@/components/ui/label"
import { DatePickerWithRange } from '@/components/ui/DatePickerWithRange';
import { useGlobalUser } from '@/hooks/useGlobalUser';

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useState, useEffect, useRef } from "react"
import { useGetProjectByIdQuery, useGetTasksByUserIdQuery, useInitiateTaskMutation } from "@/redux/user/userApi"



import * as z from "zod";
import { ZodError } from "zod"

import { TaskStatus } from '@/types/database';
import { useParams } from 'next/navigation';
;

const baseTaskSchema = z.object({
    name: z.string().min(1, "Task name is required"),
    description: z.string().min(1, "Description is required"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"], {
        errorMap: () => ({ message: "Priority must be Low, Medium, or High" })
    }),
    status: z.enum(["TO_DO", "ON_PROGRESS", "COMPLETED"], {
        errorMap: () => ({ message: "Status must be To Do, On Progress, or Completed" })
    }),
    startDate: z.string()
        .nonempty("Start date is required")
        .refine((date) => {
            const startDate = new Date(date);
            return !isNaN(startDate.getTime());
        }, "Invalid start date format"),
    dueDate: z.string()
        .nonempty("Due date is required")
        .refine((date) => {
            const dueDate = new Date(date);
            return !isNaN(dueDate.getTime());
        }, "Invalid due date format"),
    module: z.string().optional(),
    assignee: z.string().optional(),
});

const dateValidationSchema = baseTaskSchema.pick({
    startDate: true,
    dueDate: true,
}).refine((data) => {
    const start = new Date(data.startDate);
    const due = new Date(data.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return start >= today;
}, {
    message: "Start date cannot be in the past",
    path: ["startDate"]
}).refine((data) => {
    const start = new Date(data.startDate);
    const due = new Date(data.dueDate);
    return start < due;
}, {
    message: "Due date must be after start date",
    path: ["dueDate"]
});

const taskSchema = baseTaskSchema.refine((data) => {
    const start = new Date(data.startDate);
    const due = new Date(data.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return start >= today;
}, {
    message: "Start date cannot be in the past",
    path: ["startDate"]
}).refine((data) => {
    const start = new Date(data.startDate);
    const due = new Date(data.dueDate);
    return start < due;
}, {
    message: "Due date must be after start date",
    path: ["dueDate"]
});

interface AddTaskProps {
    showAlert: (message: string, type: 'success' | 'error') => void;
    projectId?: string;
}

export const AddTask: React.FC<AddTaskProps> = ({ showAlert, projectId }) => {
    const { user } = useGlobalUser();
    const sheetCloseRef = useRef<HTMLButtonElement>(null);



    const { id } = useParams<{ id: string }>();



    const [initiateTask] = useInitiateTaskMutation();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        projectId: projectId || "",
        priority: "",
        status: TaskStatus.TO_DO,
        startDate: "",
        dueDate: "",
        module: "",
        assignee: "",
    });

    const [formErrors, setFormErrors] = useState<z.ZodError | null>(null);
    const [dateRange, setDateRange] = useState<{
        from: Date | undefined;
        to: Date | undefined;
    }>({
        from: undefined,
        to: undefined
    });

    useEffect(() => {
        validateDates();
    }, [dateRange]);

    useEffect(() => {
        if (projectId) {
            setFormData(prev => ({ ...prev, projectId }));
        }
    }, [projectId]);

    const validateDates = () => {
        try {
            if (dateRange.from || dateRange.to) {
                const dateData = {
                    startDate: dateRange.from ? dateRange.from.toISOString().split('T')[0] : "",
                    dueDate: dateRange.to ? dateRange.to.toISOString().split('T')[0] : "",
                };

                dateValidationSchema.parse(dateData);

                setFormErrors((prevErrors) => {
                    if (!prevErrors) return null;
                    const filteredIssues = prevErrors.issues.filter(
                        (issue) => !['startDate', 'dueDate'].includes(issue.path[0] as string)
                    );
                    return filteredIssues.length ? new ZodError(filteredIssues) : null;
                });
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                setFormErrors((prevErrors) => {
                    const newErrors = error.issues;
                    if (!prevErrors) return new ZodError(newErrors);

                    const existingNonDateErrors = prevErrors.issues.filter(
                        (issue) => !['startDate', 'dueDate'].includes(issue.path[0] as string)
                    );
                    return new ZodError([...existingNonDateErrors, ...newErrors]);
                });
            }
        }
    };

    const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
        setDateRange(range);
        setFormData({
            ...formData,
            startDate: range.from ? range.from.toISOString().split('T')[0] : "",
            dueDate: range.to ? range.to.toISOString().split('T')[0] : "",
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormErrors((prevErrors) => {
            if (!prevErrors) return null;
            const filteredIssues = prevErrors.issues.filter(
                (issue) => issue.path[0] !== e.target.name
            );
            return filteredIssues.length ? new ZodError(filteredIssues) : null;
        });

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };



    const { refetch: refetchTasks } = useGetTasksByUserIdQuery(id);
    const { refetch: refetchProject } = useGetProjectByIdQuery(id);

    const refetchBoth = async () => {
        await Promise.all([refetchTasks(), refetchProject()]);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const validatedData = taskSchema.parse(formData);

            makeApiCall(


                () =>
                    initiateTask({
                        taskData: validatedData,
                        projectId: id
                    }).unwrap(),

                {
                    afterSuccess: (response: any) => {
                        setFormErrors(null);
                        setDateRange({ from: undefined, to: undefined });
                        refetchBoth();
                        showAlert('Task created successfully!', 'success');


                        if (sheetCloseRef.current) {
                            sheetCloseRef.current.click();
                        }


                        setFormData({
                            name: "",
                            description: "",
                            projectId: projectId || "",
                            priority: "",
                            status: TaskStatus.TO_DO,
                            startDate: "",
                            dueDate: "",
                            module: "",
                            assignee: "",
                        });
                    },
                    afterError: (error: any) => {
                        showAlert(
                            error?.data?.message || 'An error occurred while creating the task.',
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
                console.error("Error validating task data:", error);
            }
        }
    };

    const getErrorMessage = (field: keyof typeof formData) => {
        return formErrors?.issues?.find(issue => issue.path[0] === field)?.message;
    };

    const getDateErrors = () => {
        const startDateError = getErrorMessage('startDate');
        const dueDateError = getErrorMessage('dueDate');
        return startDateError || dueDateError;
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    className="!repeat-0 !bg-cover bg-gradient-radial from-[#a881fe] to-[#6419ff] [background-position:50%_50%] shadow-[0px_2px_12px_rgba(168,129,254,0.64),_inset_0px_1px_1px_rgba(168,129,254,1)] bg-gradient-to-r bg-transparent border-none text-white"
                >
                    New Task
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
                        <SheetTitle className="text-xl font-bold text-white mt-16">New Task</SheetTitle>
                        <SheetDescription className="text-custom-purple-light mt-2">
                            Create a new task
                        </SheetDescription>
                    </SheetHeader>

                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6 py-10 mt-10">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-white">
                                    Task Name
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="col-span-3"
                                />
                                {getErrorMessage("name") && (
                                    <p className="col-span-4 text-red-500">{getErrorMessage("name")}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="priority" className="text-white">
                                    Priority
                                </Label>
                                <select
                                    id="priority"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="col-span-3 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="" disabled>Select Priority</option>
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                </select>
                                {getErrorMessage("priority") && (
                                    <p className="col-span-4 text-red-500">{getErrorMessage("priority")}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-white">
                                    Status
                                </Label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="col-span-3 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="TO_DO">To Do</option>
                                    <option value="ON_PROGRESS">On Progress</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>
                                {getErrorMessage("status") && (
                                    <p className="col-span-4 text-red-500">{getErrorMessage("status")}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="dateRange" className="text-white">
                                    Date Range
                                </Label>
                                <div className="col-span-3">
                                    <DatePickerWithRange
                                        className="w-full"
                                        onDateRangeChange={handleDateRangeChange}
                                    />
                                    {getDateErrors() && (
                                        <p className="text-red-500 mt-2">{getDateErrors()}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="module" className="text-white">
                                    Module
                                </Label>
                                <Input
                                    id="module"
                                    name="module"
                                    value={formData.module}
                                    onChange={handleChange}
                                    className="col-span-3"
                                />
                            </div>


                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="assignee" className="text-white">
                                    Assignee
                                </Label>
                                <select
                                    id="assignee"
                                    name="assignee"
                                    value={formData.assignee}
                                    onChange={handleChange}
                                    className="col-span-3 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="">Select Assignee</option>
                                    <option value={user?.data?._id}>{user?.data?.username}</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-white">
                                    Description
                                </Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="col-span-3 min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2"
                                />
                                {getErrorMessage("description") && (
                                    <p className="col-span-4 text-red-500">{getErrorMessage("description")}</p>
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
                                Create Task
                            </Button>
                        </SheetFooter>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    );
};