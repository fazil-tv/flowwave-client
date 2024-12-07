"use client"

import { useGetProjectByIdQuery, useUpdateProjectMutation, useGetUserProjectsQuery } from '@/redux/user/userApi';

import { useParams } from 'next/navigation';
import { useEffect, useState, useMemo } from "react"
import { format } from "date-fns"
import { Calendar, Clock, Edit2, Flag, Save } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { makeApiCall } from '@/utils/makeApiCall';
import { useGlobalUser } from '@/hooks/useGlobalUser';
import { useGetUserTeamsQuery } from '@/redux/user/teamApi';

interface ProjectLead {
    username: string;
    _id: string;
}
interface Team {
    _id: string;
    TeamName: string;
    Description: string;
    TeamLead: string;
    memberIds: string[];
}

interface TeamsResponse {  
    data: Team[];  
    total?: number;  
    success?: boolean;  
  }  

interface ProjectTeam {
    _id: string;
    TeamName: string;
    Description: string;
}

interface Project {
    _id: string;
    projectName: string;
    projectCode: string;
    description: string;
    team: ProjectTeam | null;
    startDate: string;
    endDate: string;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    progress: number;
    ProjectLead: {
        username: string;
        _id: string;
    };
}


interface SingleProjectView {
    showAlert: (message: string, type: 'success' | 'error') => void;
}


export const SingleProjectView: React.FC<SingleProjectView> = ({ showAlert }) => {

    const { id } = useParams<{ id: string }>();
    const { data: projectData, error, isLoading } = useGetProjectByIdQuery(id);

    const { user, isLoading: isUserLoading } = useGlobalUser();
    const userId = user?.data?._id;
    const {
        data: teams,
        isLoading: isTeamsLoading,
    } = useGetUserTeamsQuery(userId, {
            skip: !userId || isUserLoading,
        }) as unknown as { data: TeamsResponse; isLoading: boolean }




    const { refetch } = useGetProjectByIdQuery(id);

    const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

    const [project, setProject] = useState<Project | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [originalProject, setOriginalProject] = useState<Project | null>(null);

    useEffect(() => {
        if (projectData?.data?.length) {
            const fetchedProject = projectData.data[0];
            const transformedProject = {
                ...fetchedProject,
                team: Array.isArray(fetchedProject.team) && fetchedProject.team.length > 0
                    ? {
                        _id: fetchedProject.team[0]._id,
                        TeamName: fetchedProject.team[0].TeamName,
                        Description: fetchedProject.team[0].Description
                    }
                    : null
            };
            
            console.log('Transformed project:', transformedProject);
            setProject(transformedProject);
            setOriginalProject(transformedProject);
        }
    }, [projectData]);


    const hasChanges = useMemo(() => {
        if (!project || !originalProject) return false;
        return (
            project.projectName !== originalProject.projectName ||
            project.description !== originalProject.description ||
            project.startDate !== originalProject.startDate ||
            project.team?._id !== originalProject.team?._id ||
            project.endDate !== originalProject.endDate ||
            project.status !== originalProject.status ||
            project.priority !== originalProject.priority
        );
    }, [project, originalProject]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading project</div>;
    if (!project) return <div>No project found</div>;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setProject((prev) => prev ? { ...prev, [name]: value } : null)
    }

    const handleSelectChange = (name: string, value: string) => {
        setProject((prev) => prev ? { ...prev, [name]: value } : null)
    }


    const handleTeamChange = (teamId: string) => {
       
        if (!teams?.data) return;
        
        const selectedTeam = teams.data.find(team => team._id === teamId);
        
        setProject(prev => {
            if (!prev) return null;
            
         
            if (!selectedTeam) {
                return {
                    ...prev,
                    team: null
                };
            }
            
          
            const projectTeam: ProjectTeam = {
                _id: selectedTeam._id,
                TeamName: selectedTeam.TeamName,
                Description: selectedTeam.Description
            };
            
            return {
                ...prev,
                team: projectTeam
            };
        });
    };




    const handleSave = async () => {
        if (!hasChanges || !project) {
            setIsEditing(false);
            return;
        }
        makeApiCall(
            () => updateProject({
                id: project._id,
                updates: {
                    projectName: project.projectName,
                    description: project.description,
                    startDate: project.startDate,
                    team: project.team?._id, 
                    endDate: project.endDate,
                    status: project.status,
                    priority: project.priority
                }
            }).unwrap(),
            {
                afterSuccess: (response: any) => {
                    console.log("", response);
                    refetch()
                    setIsEditing(false);
                    showAlert('Project updated successfull!', 'success');
                },
                afterError: (error: any) => {
                    showAlert(
                        error?.data?.message || 'An error occurred while initiating the project.',
                        'error'
                    );
                }
            }
        );
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "LOW": return "text-green-500"
            case "MEDIUM": return "text-yellow-500"
            case "HIGH": return "text-red-500"
            default: return "text-gray-500"
        }
    }

    return (

        <Card className="w-[90%] h-[600px] mt-5 p-5 bg-[rgba(49,38,85,0.07)] shadow-lg shadow-[rgba(31,38,135,0.37)] text-white backdrop-blur-[9.5px] rounded-xl border-[rgba(255,255,255,0.18)] ">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="space-y-1 font-bold">
                    {isEditing ? (
                        <div className=' !w-full'>
                            <Label htmlFor="projectName" className="text-white">ProjectName</Label>
                            <Input
                                name="projectName"
                                value={project.projectName}
                                onChange={handleInputChange}
                                className="text-2xl font-bold border-none !focus:outline-none !focus:ring-0 !w-full"
                            />
                        </div>
                    ) : (
                        <div>

                            <CardTitle className="text-2xl font-bold">{project.projectName}</CardTitle>
                        </div>
                    )}


                    {!isEditing ? (
                        <CardDescription className="!mt-7">{project.projectCode}</CardDescription>
                    ) : null}

                </div>
                {!isEditing ? (
                    <div className="flex items-center text-sm text-gray-500">
                        <Clock className="mr-2 h-4 w-4" />
                        {Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                    </div>
                ) : null}

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">

                <div className="grid grid-cols-2 gap-4 ">
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-white">Description</Label>
                        {isEditing ? (
                            <Textarea
                                id="description"
                                name="description"
                                value={project.description}
                                onChange={handleInputChange}
                                className="resize-none"
                            />
                        ) : (
                            <p className="text-sm text-gray-500">{project.description}</p>
                        )}
                    </div>


                    <div className="space-y-2">
                        <Label htmlFor="team" className="text-white">Team</Label>
                        {isEditing ? (
                         <Select
                         name="team"
                         value={project.team?._id || ""}
                         onValueChange={handleTeamChange}
                     >
                         <SelectTrigger id="team">
                             <SelectValue placeholder="Select Team" />
                         </SelectTrigger>
                         <SelectContent>
                             {teams?.data && teams.data.map((team) => (
                                 <SelectItem key={team._id} value={team._id}>
                                     {team.TeamName}
                                 </SelectItem>
                             ))}
                         </SelectContent>
                     </Select>
                        ) : (
                            <p className="text-sm text-gray-500">
                             
                                {project.team ? project.team.TeamName : 'No team assigned'}
                            </p>
                        )}
                    </div>




                </div>


                <div className="grid grid-cols-2 gap-4 !mt-12">
                    <div className="space-y-2">
                        <Label htmlFor="startDate" className="text-white">Start Date</Label>
                        {isEditing ? (
                            <Input
                                className="!border-none"
                                id="startDate"
                                name="startDate"
                                type="date"
                                value={project.startDate.split("T")[0]}
                                onChange={handleInputChange}
                            />
                        ) : (
                            <div className="flex items-center text-sm text-gray-500 !border-none">
                                <Calendar className="mr-2 h-4 w-4" />
                                {format(new Date(project.startDate), "MMMM d, yyyy")}
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="endDate" className="text-white">End Date</Label>
                        {isEditing ? (
                            <Input
                                className='!border-none'
                                id="endDate"
                                name="endDate"
                                type="date"
                                value={project.endDate.split("T")[0]}
                                onChange={handleInputChange}
                            />
                        ) : (
                            <div className="flex items-center text-sm text-gray-500">
                                <Flag className="mr-2 h-4 w-4" />
                                {format(new Date(project.endDate), "MMMM d, yyyy")}
                            </div>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 mt-5">
                        <Label htmlFor="status" className="text-white">Status</Label>
                        {isEditing ? (
                            <Select
                                name="status"
                                value={project.status}
                                onValueChange={(value) => handleSelectChange("status", value)}
                            >
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <p className="text-sm font-medium">{project.status.replace("_", " ")}</p>
                        )}
                    </div>
                    <div className="space-y-2 mt-5">
                        <Label htmlFor="projectLead" className="text-white">Project Lead</Label>
                        {isEditing ? (
                            <Select
                                name="projectLead"
                                value={project.ProjectLead.username}
                                onValueChange={(value) => handleSelectChange("projectLead", value)}
                            >
                                <SelectTrigger id="projectLead">
                                    <SelectValue placeholder="Project Lead" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={project.ProjectLead.username}>
                                        {project.ProjectLead.username}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <p className="text-sm font-medium">
                                {project.ProjectLead.username}
                            </p>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 mt-5">
                        <Label htmlFor="priority" className="text-white">Priority</Label>
                        {isEditing ? (
                            <Select
                                name="priority"
                                value={project.priority}
                                onValueChange={(value) => handleSelectChange("priority", value)}
                            >
                                <SelectTrigger id="priority">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LOW">Low</SelectItem>
                                    <SelectItem value="MEDIUM">Medium</SelectItem>
                                    <SelectItem value="HIGH">High</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <p className={`text-sm font-medium ${getPriorityColor(project.priority)}`}>
                                {project.priority}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4">

                        {!isEditing ? (
                            <div className="space-y-2 mt-5">
                                <Label htmlFor="progress" className="text-white">Progress</Label>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium">{project.progress}%</span>
                                    <Progress value={project.progress} className="flex-1" />
                                </div>
                            </div>
                        ) : null}
                        {isEditing && hasChanges && (
                            <div className='flex justify-between items-end mx-5'>
                                <Button
                                    className=' w-[35%]'
                                    onClick={handleSave}
                                    disabled={isUpdating}
                                >
                                    Save Changes
                                </Button>

                            </div>
                        )}
                    </div>

                </div>


            </CardContent>

        </Card>
    )
}
