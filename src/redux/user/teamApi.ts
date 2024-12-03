import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

interface TeamData {
    teamName: string;
    members: string[];
}

interface TeamResponse {
    id: string;
    teamName: string;
    members: string[];
}

interface Team {
    id: string;
    TeamName: string;
    TeamLead:string;
    members: string[];
}

export const teamApi = createApi({
    reducerPath: 'teamApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, credentials: 'include' }),
    endpoints: (builder) => ({
        getUserTeams: builder.query<Team[], void>({
            query: (userId) => ({
                url: `/teamapi/user-teams/${userId}`,
                method: 'GET',
            }),
            // transformResponse: (response: { data: Team[] }) => response.data,
        }),

        createTeam: builder.mutation({
            query: ( validatedData ) => ({
                url: '/teamapi/create',
                method: 'POST',
                body: validatedData,
            }),
        }),

        updateTeam: builder.mutation({
            query: ({  ...teamData }) => {
          
                console.log("Team Data:", teamData); 
        
                return {
                    url: `/teamapi/updateteam`, 
                    method: "PATCH",
                    body: teamData,
                };
            },
            // invalidatesTags: ["Teams"],
        }),
        
        

    }),
});

export const { useGetUserTeamsQuery, useCreateTeamMutation,useUpdateTeamMutation } = teamApi;
