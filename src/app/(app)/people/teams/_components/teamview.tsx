import React from 'react';
import { AnimatedTooltip } from '@/components/ui/animated-tooltip';
import { useGetUserTeamsQuery } from '@/redux/user/teamApi';
import { useGlobalUser } from '@/hooks/useGlobalUser';
import { UpdateTeam } from './updateTeam';

interface TeamCardProps {
    
    
}


const TeamCard: React.FC<TeamCardProps> = () => {
    const { user, isLoading: isUserLoading } = useGlobalUser();
    const userId = user?.data?._id;

    const { data: teams, isLoading, isError } = useGetUserTeamsQuery(userId, {
        skip: !userId || isUserLoading,
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }


    if (isLoading) {
        return <p>Loading teams...</p>;
    }

    if (isError) {
        return <p>Error loading teams. Please try again.</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {teams?.data.map((team) => {
                const teamMembers = team.memberIds.map((member) => ({
                    id: member._id,
                    name: member.name,
                    email: member.email,
                    image: "https://img.daisyui.com/images/profile/demo/2@94.webp",
                }));

                return (
                    <div
                        key={team._id}
                        className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 bg-gradient-radial from-[#a881fe] to-[#6419ff] [background-position:50%_50%] bg-gradient-to-r bg-transparent border-none text-white transition-shadow duration-300 hover:shadow-[0px_2px_12px_rgba(168,129,254,0.64),_inset_0px_1px_1px_rgba(168,129,254,1)] cursor-pointer"
                    >
                        <div className='flex justify-end'>
                            <UpdateTeam team={team} />
                        </div>

                        <div className="flex flex-col  p-8 pt-0">

                            <div className="flex justify-center w-full mb-4">
                                <AnimatedTooltip items={teamMembers} />
                            </div>

                            <h5 className="mb-2 text-xl font-medium text-white-900 dark:text-white">
                                {team.TeamName}
                            </h5>
                            <span className="text-sm text-white-500 dark:text-gray-400 mb-1">
                                Team Lead : {team.TeamLead.name}
                            </span>
                            <span className="text-sm text-white-500 dark:text-gray-400 mb-1">
                                Date Added: {formatDate(team.createdAt)}
                            </span>
                            <span className="text-sm text-white-500 dark:text-gray-400 mb-1">
                                Description : {team.Description}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TeamCard;
