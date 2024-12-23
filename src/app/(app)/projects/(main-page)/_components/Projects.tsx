"use client";
import React, { useEffect } from 'react';
import { useGetUserProjectsQuery } from '@/redux/user/userApi';

import Link from 'next/link';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from 'next/image';
import { Avatar } from '@radix-ui/react-avatar';
import { AvatarImage } from '@/components/ui/avatar';


export function Projects() {

    const { data: projects, error, isLoading, refetch } = useGetUserProjectsQuery({});
    useEffect(() => {
        refetch();
    }, [refetch]);



    if (isLoading) return <div>Loading...</div>;


    if (error) return <div className='text-white'>Error loading projects</div>;

    return (

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects?.data && Array.isArray(projects.data) ? (
                projects.data.map((project: any) => (
                    <Link
                        href={`projects/${project._id}/project`}
                        legacyBehavior
                        passHref
                        key={project._id}
                    >
                        <Card
                            className="w-full bg-gradient-radial mx-auto from-[#a881fe] to-[#6419ff] [background-position:50%_50%] bg-gradient-to-r bg-transparent border-none text-white transition-shadow duration-300 hover:shadow-[0px_2px_12px_rgba(168,129,254,0.64),_inset_0px_1px_1px_rgba(168,129,254,1)] cursor-pointer"
                        >
                            <CardHeader className="flex justify-between">
                                <div>
                                    <CardTitle>{project.projectName}</CardTitle>
                                    <CardDescription className="pt-3 text-white">
                                        {project.projectCode}
                                    </CardDescription>
                                </div>
                                <div>
                                    <div
                                        className="radial-progress"
                                        style={{ "--value": project.progress } as React.CSSProperties}
                                        role="progressbar"
                                    >
                                        {project.progress}%

                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>{ }</CardContent>
                            <CardFooter className="flex justify-between">
                                <span className="flex items-center">
                                    <div className="avatar">
                                        <div className="ring-custom-purple ring-offset-base-100 w-12 rounded-full ring">

                                            <Avatar className="w-full h-full ">
                                                <AvatarImage
                                                    src={project?.ProjectLead.profileImg || "/images/user-img.jpeg"}
                                                    alt="User Avatar"
                                                    className="bg-cover"
                                                />
                                            </Avatar>

                                        </div>
                                    </div>
                                    <div className="flex items-center ms-3">
                                        {project.ProjectLead.username}
                                    </div>
                                </span>
                                <span>Click to View</span>
                            </CardFooter>
                        </Card>
                    </Link>
                ))
            ) : (
                <div>
                    No projects available

                    <Image
                        src="/images/no-projects.svg"
                        alt="Description of the image"
                        width={500}
                        height={300}
                    />

                </div>
            )}
        </div>

    );
}




