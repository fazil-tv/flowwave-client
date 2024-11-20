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
        return{
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
  }),
});


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
  useGetUserByIdQuery
} = userApi;
