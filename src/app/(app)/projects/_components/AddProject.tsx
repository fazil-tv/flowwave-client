"use client"

import { makeApiCall } from '@/utils/makeApiCall';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/shadinput"
import { Label } from "@/components/ui/label"
import { DatePickerWithRange } from '@/components/ui/DatePickerWithRange';
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
import { useState, useEffect } from "react"
import { useInitiateProjectMutation } from "@/redux/user/userApi"

import * as z from "zod";
import { ZodError } from "zod"

const baseProjectSchema = z.object({
  ProjectName: z.string().min(1, "Project name is required"),
  ProjectLead: z.string().min(1, "Project lead is required"),
  Priority: z.enum(["LOW", "Medium", "High"], {
    errorMap: () => ({ message: "Priority must be Low, Medium, or High" })
  }),
  StartDate: z.string()
    .nonempty("Start date is required")
    .refine((date) => {
      const startDate = new Date(date);
      return !isNaN(startDate.getTime());
    }, "Invalid start date format"),
  EndDate: z.string()
    .nonempty("End date is required")
    .refine((date) => {
      const endDate = new Date(date);
      return !isNaN(endDate.getTime());
    }, "Invalid end date format"),
  Description: z.string().min(1, "Description is required"),
});


const dateValidationSchema = baseProjectSchema.pick({
  StartDate: true,
  EndDate: true,
}).refine((data) => {
  const start = new Date(data.StartDate);
  const end = new Date(data.EndDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return start >= today;
}, {
  message: "Start date cannot be in the past",
  path: ["StartDate"]
}).refine((data) => {
  const start = new Date(data.StartDate);
  const end = new Date(data.EndDate);
  return start < end;
}, {
  message: "End date must be after start date",
  path: ["EndDate"]
});



const projectSchema = baseProjectSchema.refine((data) => {
  const start = new Date(data.StartDate);
  const end = new Date(data.EndDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return start >= today;
}, {
  message: "Start date cannot be in the past",
  path: ["StartDate"]
}).refine((data) => {
  const start = new Date(data.StartDate);
  const end = new Date(data.EndDate);
  return start < end;
}, {
  message: "End date must be after start date",
  path: ["EndDate"]
});

interface AddProjectProps {
  showAlert: (message: string, type: 'success' | 'error') => void;
}

export const AddProject: React.FC<AddProjectProps> = ({ showAlert }) => {
  const [initiateProject] = useInitiateProjectMutation();
  const [formData, setFormData] = useState({
    ProjectName: "",
    ProjectLead: "",
    Priority: "",
    StartDate: "",
    EndDate: "",
    Description: "",
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

  const validateDates = () => {
    try {
      if (dateRange.from || dateRange.to) {
        const dateData = {
          StartDate: dateRange.from ? dateRange.from.toISOString().split('T')[0] : "",
          EndDate: dateRange.to ? dateRange.to.toISOString().split('T')[0] : "",
        };

        dateValidationSchema.parse(dateData);

        setFormErrors((prevErrors) => {
          if (!prevErrors) return null;
          const filteredIssues = prevErrors.issues.filter(
            (issue) => !['StartDate', 'EndDate'].includes(issue.path[0] as string)
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
            (issue) => !['StartDate', 'EndDate'].includes(issue.path[0] as string)
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
      StartDate: range.from ? range.from.toISOString().split('T')[0] : "",
      EndDate: range.to ? range.to.toISOString().split('T')[0] : "",
    });
  };

  const handleChange = (e: any) => {
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const validatedData = projectSchema.parse(formData);

      makeApiCall(
        () => initiateProject({ projectData: validatedData }).unwrap(),
        {
          afterSuccess: (response: any) => {
            setFormErrors(null);
            setDateRange({ from: undefined, to: undefined });
            showAlert('Project created successfully!', 'success');
          },

          afterError: (error: any) => {
            showAlert(
              error?.data?.message || 'An error occurred while initiating the project.',
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
        console.error("Error validating project data:", error);
      }
    }
  };

  const getErrorMessage = (field: keyof typeof formData) => {
    return formErrors?.issues?.find(issue => issue.path[0] === field)?.message;
  };

  const getDateErrors = () => {
    const startDateError = getErrorMessage('StartDate');
    const endDateError = getErrorMessage('EndDate');
    return startDateError || endDateError;
  };

  return (

    <Sheet>

      <SheetTrigger asChild>
        <Button variant="outline" className="bg-custom-purple border-none text-white">
          New Project
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl overflow-y-auto pt-0
        justify-between gap-10 h-screen bg-[rgba(103,61,245,0.1)] shadow-lg shadow-[rgba(31,38,135,0.37)] 
        backdrop-blur-[7.5px] rounded-xl border-[rgba(255,255,255,0.18)]" >

        <div className="h-full px-10">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-white mt-16">New Project</SheetTitle>
            <SheetDescription className="text-custom-purple-light mt-2">
              Start everything from scratch
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-10 mt-10">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="projectTitle" className="text-white">
                  Project Title
                </Label>
                <Input
                  id="projectTitle"
                  name="ProjectName"
                  value={formData.ProjectName}
                  onChange={handleChange}
                  className="col-span-3 "
                />
                {getErrorMessage("ProjectName") && (
                  <p className="col-span-4 text-red-500">{getErrorMessage("ProjectName")}</p>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="projectLead" className="text-white">
                  Project Lead
                </Label>
                <Input
                  id="projectLead"
                  name="ProjectLead"
                  value={formData.ProjectLead}
                  onChange={handleChange}
                  className="col-span-3"
                />
                {getErrorMessage("ProjectLead") && (
                  <p className="col-span-4 text-red-500">{getErrorMessage("ProjectLead")}</p>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-white">
                  Priority
                </Label>
                <select
                  id="priority"
                  name="Priority"
                  value={formData.Priority}
                  onChange={handleChange}
                  className="col-span-3 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="" disabled>
                    Select Priority
                  </option>
                  <option value="LOW">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                {getErrorMessage("Priority") && (
                  <p className="col-span-4 text-red-500">{getErrorMessage("Priority")}</p>
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
                    <p className="text-red-500 mt-2">
                      {getDateErrors()}
                    </p>
                  )}
                </div>
              </div>


              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-white">
                  Description
                </Label>
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
                <Button className="bg-white" type="button">
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit" className="bg-custom-purple border-none text-white">
                Save Project
              </Button>
            </SheetFooter>
          </form>
        </div>
      </SheetContent>
    </Sheet>


  );
};