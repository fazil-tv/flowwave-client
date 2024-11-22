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
import { useState, useEffect, useRef, useMemo } from "react"
import { useGetTasksByUserIdQuery, useUpdateTaskMutation } from "@/redux/user/userApi"

import * as z from "zod";
import { ZodError } from "zod"

import { TaskStatus } from '@/types/database';
import { useParams } from 'next/navigation';

const baseTaskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"], {
    errorMap: () => ({ message: "Priority must be Low, Medium, or High" })
  }),
  progress: z.number().min(0).max(100),
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
  return start < due;
}, {
  message: "Due date must be after start date",
  path: ["dueDate"]
});

const taskSchema = baseTaskSchema.refine((data) => {
  const start = new Date(data.startDate);
  const due = new Date(data.dueDate);
  return start < due;
}, {
  message: "Due date must be after start date",
  path: ["dueDate"]
});

interface UpdateTaskProps {
  task: {
    _id: string;
    progress: number;
    name: string;
    description: string;
    priority: string;
    status: TaskStatus;
    startDate: string;
    dueDate: string;
    module?: string;
    assignee?: { _id: string };
  };
  trigger?: React.ReactNode;
  onTaskUpdate?: (updatedTask: any) => void;
  showAlert: (message: string, type: 'success' | 'error') => void;
}

export const UpdateTask: React.FC<UpdateTaskProps> = ({ task, trigger, onTaskUpdate, showAlert }) => {
  const { user } = useGlobalUser();
  const sheetCloseRef = useRef<HTMLButtonElement>(null);
  const { id } = useParams<{ id: string }>();
  const [updateTask] = useUpdateTaskMutation();
  const { refetch } = useGetTasksByUserIdQuery(id)

  const [formData, setFormData] = useState({
    name: task.name,
    description: task.description,
    priority: task.priority,
    progress: task.progress || 0,
    status: task.status,
    startDate: task.startDate.split('T')[0],
    dueDate: task.dueDate.split('T')[0],
    module: task.module || "",
    assignee: task.assignee ? task.assignee._id : "",
  });



  const [originalTask] = useState({
    name: task.name,
    description: task.description,
    priority: task.priority,
    progress: task.progress || 0,
    status: task.status,
    startDate: task.startDate.split('T')[0],
    dueDate: task.dueDate.split('T')[0],
    module: task.module || "",
    assignee: task.assignee ? task.assignee._id : "",
  });



  const hasChanges = useMemo(() => {
    return (
      formData.name !== originalTask.name ||
      formData.description !== originalTask.description ||
      formData.priority !== originalTask.priority ||
      formData.progress !== originalTask.progress ||
      formData.status !== originalTask.status ||
      formData.startDate !== originalTask.startDate ||
      formData.dueDate !== originalTask.dueDate ||
      formData.module !== originalTask.module ||
      formData.assignee !== originalTask.assignee
    );
  }, [formData, originalTask]);



  const [formErrors, setFormErrors] = useState<z.ZodError | null>(null);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(task.startDate),
    to: new Date(task.dueDate)
  });

  useEffect(() => {
    validateDates();
  }, [dateRange]);

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

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(100, Math.max(0, Number(e.target.value)));
    setFormData({
      ...formData,
      progress: value
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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasChanges) {
      if (sheetCloseRef.current) {
        sheetCloseRef.current.click();
      }
      return;
    }

    try {

      const validatedData = taskSchema.parse(formData);
      console.log(validatedData, "Validated Data");

      if (hasChanges) {
        makeApiCall(
          () => updateTask({
            taskId: task._id,
            taskData: validatedData,
            projectId: id
          }).unwrap(),
          {
            afterSuccess: async (response: any) => {

              await refetch();

              if (onTaskUpdate) {
                onTaskUpdate({ ...validatedData, _id: task._id });
              }

              setFormErrors(null);

              setFormData(originalTask);

              showAlert('Task updated successfully!', 'success');

              if (sheetCloseRef.current) {
                sheetCloseRef.current.click();
              }
            },
            afterError: (error: any) => {

              showAlert(
                error?.data?.message || 'An error occurred while update the task.',
                'error'
              );

            },

          }
        );
      }

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
        {trigger || (
          <Button
            variant="outline"
            className="!repeat-0 !bg-cover bg-gradient-radial from-[#a881fe] to-[#6419ff] [background-position:50%_50%] shadow-[0px_2px_12px_rgba(168,129,254,0.64),_inset_0px_1px_1px_rgba(168,129,254,1)] bg-gradient-to-r bg-transparent border-none text-white"
          >
            Update Task
          </Button>
        )}
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl overflow-y-auto pt-0
                justify-between gap-10 h-screen bg-[rgba(49,38,85,0.07)] shadow-lg shadow-[rgba(31,38,135,0.37)] 
                backdrop-blur-[7.5px] rounded-xl border-[rgba(255,255,255,0.18)]"
      >
        <div className="h-full px-10">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-white mt-16">Update Task</SheetTitle>
            <SheetDescription className="text-custom-purple-light mt-2">
              Update task details
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-10 mt-10">
              {/* ... All your existing form fields ... */}
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
                <Label htmlFor="progress" className="text-white">
                  Progress
                </Label>
                <div className="col-span-3 space-y-2 flex items-center py-5">
                  <div className="flex items-center space-x-4 ">

                    <Input
                      type="number"
                      value={formData.progress}
                      onChange={handleProgressChange}
                      min="0"
                      max="100"
                      className="w-20 text-center "
                    />
                    <span className="text-white pe-5">{formData.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 ">
                    <div
                      className="bg-purple-600 h-2.5 rounded-full transition-all duration-300 "
                      style={{ width: `${formData.progress}%` }}
                    ></div>
                  </div>
                </div>
                {getErrorMessage("progress") && (
                  <p className="col-span-4 text-red-500">{getErrorMessage("progress")}</p>
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
                  // initialDateRange={dateRange}
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
                  value={user?.data?._id}
                  onChange={handleChange}
                  className="col-span-3 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >

                  {/* <option value={user?.data?._id}>{user?.data?.username}</option> */}
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
              {hasChanges && (
                <Button
                  type="submit"
                  className="!repeat-0 !bg-cover bg-gradient-radial from-[#a881fe] to-[#6419ff] [background-position:50%_50%] shadow-[0px_2px_12px_rgba(168,129,254,0.64),_inset_0px_1px_1px_rgba(168,129,254,1)] bg-gradient-to-r bg-transparent border-none text-white"
                >
                  Save Changes
                </Button>
              )}
            </SheetFooter>
          </form>
        </div>
      </SheetContent >
    </Sheet >
  );
}