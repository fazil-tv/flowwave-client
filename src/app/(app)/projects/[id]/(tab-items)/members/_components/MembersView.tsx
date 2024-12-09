"use client"
import { useGetProjectTeamMembersQuery } from '@/redux/user/userApi';
import { useParams } from 'next/navigation';
import { User } from 'lucide-react';

function MembersView() {
  const { id } = useParams<{ id: string }>();
  const { data: teamMembers, error, isLoading } = useGetProjectTeamMembersQuery(id);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching team members</div>;

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl font-bold mb-4">Team Members</h2>
      <div className="overflow-x-auto  rounded-lg shadow">
        <table className="table w-full">
          <thead className="">
            <tr>
              <th className="p-4">
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th className="p-4">Member</th>
              <th className="p-4">Email</th>
              <th className="p-4">Teams</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers?.data.map((member) => (
              <tr key={member.userId} className="">
                <th className="p-4">
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-500" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{member.name}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  {member.email}
                </td>
                <td className="p-4">
                  {member.teams.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {member.teams.map((team) => (
                        <span key={team.teamId} className="badge badge-ghost">
                          {team.teamName}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400">No teams</span>
                  )}
                </td>
                <td className="p-4">
                  <button className="btn btn-ghost btn-xs">Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MembersView