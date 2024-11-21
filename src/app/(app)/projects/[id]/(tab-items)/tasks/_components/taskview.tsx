"use client";
import { useGetTasksByUserIdQuery } from '@/redux/user/userApi';
import { useParams } from 'next/navigation';
import { Progress } from "@/components/ui/progress"
import React from 'react';
import { Edittask } from './edittask';

function TaskView() {
    const { id } = useParams<{ id: string }>();
    const { data: taskData, isLoading, isError } = useGetTasksByUserIdQuery(id);


    if (isLoading) {
        return <div className="text-center">Loading...</div>;
    }

    if (isError) {
        return <div className="text-red-500">Error fetching tasks.</div>;
    }


    if (!taskData || !taskData.tasks || taskData.tasks.length === 0) {
        return <div>No tasks available for this user.</div>;
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
        <div className='bg-[rgba(49,38,85,0.07)] border-2 shadow-lg shadow-[rgba(74,77,122,0.37)] text-white backdrop-blur-[7.5px] bg-custom-dark rounded-xl border-[rgba(255,255,255,0.18)]'>
            <div className="overflow-x-auto p-5">
                <table className="table p-5">
                    <thead>
                        <tr>

                            <th>Id</th>
                            <th>Task Name</th>
                            <th className='w-32'>Task Discription</th>
                            <th>Task Assignee</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Prograss</th>
                            <th>Due Date</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className='py-5'>
                        {taskData.tasks.map((task: any) => (
                            <tr key={task._id}>

                                <td>
                                    <span className="">{task.taskCode}</span>
                                </td>
                                <td>
                                    <div className="">{task.name}</div>
                                </td>
                                <td className="max-w-4 overflow-hidden text-ellipsis whitespace-nowrap">
                                    <div>{task.description}</div>
                                </td>
                                <td>
                                    <div className="!my-5">


                                        <span className="flex items-center ">
                                            <div className="avatar">
                                                <div className="mask mask-squircle h-12 w-12">
                                                    <img
                                                        src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                                                        alt="Avatar"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex  flex-col ms-3 w-fit">
                                                <div className='font-light'>
                                                    {task.assignee?.username}
                                                </div>
                                                <div className='font-light text-custom-purple-light text-xs'>
                                                    {task.assignee?.email}
                                                </div>
                                            </div>
                                        </span>



                                    </div>
                                </td>

                                <td>
                                    <span className="badge badge-ghost badge-sm">{task.status}</span>
                                </td>

                                <td>
                                    <span className={`text-sm font-medium bg-none ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                                </td>
                                <td>
                                    <div className="flex items-center space-x-1">
                                        <span className="text-sm font-medium">{task.progress}%</span>
                                        <Progress value={task.progress} className="flex-1" />
                                    </div>

                                </td>
                                <td>
                                    <div>{new Date(task.dueDate).toLocaleDateString()}</div>
                                </td>
                                <th>
                                    <button className="btn btn-ghost btn-xs">Details</button>
                                </th>
                                <th>
                                  <Edittask/>
                                </th>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
}

export default TaskView;