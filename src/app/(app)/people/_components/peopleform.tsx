"use client"
import React from 'react';
import { useGetMembersQuery } from '@/redux/user/userApi';


export default function Peopleform() {
    const { data: members, isLoading, error } = useGetMembersQuery({});

  
    if (isLoading) return <p>Loading members...</p>;
    if (error) return <p>Error fetching members</p>;

    return (
        <div>
            <div className="!overflow-x-auto">
                <table className="table !text-white">
                    <thead>
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox" />
                                </label>
                            </th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Team</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.data?.map((member:any) => (
                            <tr key={member._id}>
                                <th>
                                    <label>
                                        <input type="checkbox" className="checkbox" />
                                    </label>
                                </th>
                                <td>
                                    <div className="flex items-center gap-3">
                                       
                                        <div>
                                            <div className="font-bold">{member.name}</div>
                
                                        </div>
                                    </div>
                                </td>
                                <td>{member.email}</td>
                                <td>
                                    <span className="badge badge-primary badge-sm">
                                        {member.role}
                                    </span>
                                </td>
                                <td>
                                    <span className="badge badge-primary badge-sm">
                                        {member.role}
                                    </span>
                                </td>
                                <td>
                                    <span className={`badge ${
                                        member.status === 'pending' 
                                        ? 'badge-warning' 
                                        : 'badge-success'
                                    } badge-sm`}>
                                        {member.status}
                                    </span>
                                </td>
                                <th>
                                    <div className="flex space-x-2">
                                        <button 
                                            className="btn btn-ghost btn-xs"
                                        
                                        >
                                            Details
                                        </button>
                                        <button 
                                            className="btn btn-ghost btn-xs btn-error"
                                           
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </th>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}