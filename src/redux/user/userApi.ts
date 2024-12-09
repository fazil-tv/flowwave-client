import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'http://localhost:4000';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, credentials: 'include' }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (user) => {
        console.log("Query function called with user:", user);
        return {
          url: '/api/user/register',
          method: 'POST',
          body: user,
        };
      },
    }),

    loginUser: builder.mutation({
      query: (credentials) => {
        console.log("Query function called with credentials:", credentials);
        return {
          url: '/api/user/login',
          method: 'POST',
          body: credentials,
        };
      },
    }),
    verifyOtp: builder.mutation({
      query: (verificationData) => {
        console.log(verificationData, "verificationData");
        return {
          url: '/api/user/verifyOtp',
          method: 'POST',
          body: verificationData,
        };
      },
    }),
    googleSignIn: builder.mutation({
      query: (token) => {
        console.log("Google Sign-In token:", token);
        return {
          url: '/api/user/googleSignIn',
          method: 'POST',
          body: { token },
        };
      },
    }),

    getAllServices: builder.query({
      query: () => '/userapi/user/services',
    }),


    getServiceById: builder.query({
      query: (id: string) => `/userapi/user/services/${id}`,
    }),


    initiateProject: builder.mutation({
      query: ({ projectData }: { projectData: any; }) => ({
        url: 'userapi/user/initiateproject',
        method: 'POST',
        body: {
          ...projectData
        },
      }),
    }),

    getUserProjects: builder.query({
      query: () => {
        return {
          url: `userapi/user/getprojects`,
          method: 'GET',
        };
      },
    }),


    getProjectById: builder.query({
      query: (id) => ({
        url: `userapi/user/getproject/${id}`,
        method: 'GET',
      }),
    }),
    updateProject: builder.mutation({
      query: ({ id, updates }) => ({
        url: `userapi/user/projects/${id}`,
        method: 'PATCH',
        body: updates,
      }),
    }),

    getUserById: builder.query({
      query: (userId) => ({
        url: `userapi/user/${userId}`,
        method: 'GET',
        providesTags: ['User'],
        keepUnusedDataFor: 300,
      }),
    }),

    initiateTask: builder.mutation({
      query: ({ taskData, projectId }) => {
        return {
          url: `taskapi/tasks`,
          method: 'POST',
          body: { ...taskData, projectId },
          invalidatesTags: ['Task'],
        };
      },
    }),

    getTasksByUserId: builder.query({
      query: (projectId) => ({
        url: `/userapi/${projectId}`,
        method: 'GET',
      }),
    }),

    updateTask: builder.mutation({
      query: ({ taskId, taskData, projectId }) => ({
        url: `/taskapi/tasks/${projectId}`,
        method: 'PUT',
        body: { taskData, taskId }
      }),
    }),

    inviteMember: builder.mutation({
      query: (formData) => ({
        url: 'memberapi/invite',
        method: 'POST',
        body: { formData }
      }),
      // invalidatesTags: ['formData']  
    }),

    acceptInvitation: builder.mutation({
      query: (token) => ({
        url: 'memberapi/accept-invitation',
        method: 'POST',
        body: { token }
      }),
    }),

    getMembers: builder.query({
      query: () => ({
        url: 'memberapi/members',
        method: 'GET',
      }),
    }),

    getProjectTeamMembers: builder.query({
      query: (projectId) => ({
        url: `userapi/team-members/${projectId}`,
        method: 'GET',
      }),
    }),

    uploadProfileImage: builder.mutation<string, FormData>({
      query: (formData) => ({
        url: 'userapi/profile-image',
        method: 'POST',
        body: formData,
      }),
    }),


  }),
})



export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useVerifyOtpMutation,
  useGoogleSignInMutation,
  useGetAllServicesQuery,
  useGetServiceByIdQuery,
  useInitiateProjectMutation,
  useGetUserProjectsQuery,
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
  useGetUserByIdQuery,
  useInitiateTaskMutation,
  useGetTasksByUserIdQuery,
  useUpdateTaskMutation,
  useInviteMemberMutation,
  useAcceptInvitationMutation,
  useGetMembersQuery,
  useGetProjectTeamMembersQuery,
  useUploadProfileImageMutation

} = userApi;
