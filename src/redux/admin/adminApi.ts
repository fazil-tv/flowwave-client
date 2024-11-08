import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'http://localhost:4000';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, credentials: "include" }),
  endpoints: (builder) => ({
    adminlogin: builder.mutation({
      query: (credentials) => ({
        url: '/adminapi/admin/login',
        method: 'POST',
        body: credentials,
      }),
    }),


    getAllUsers: builder.query({
      query: () => '/adminapi/admin/users',
    }),

    addService: builder.mutation({
      query: (credentials) => {
        console.log('Credentials:', credentials);
        return {
          url: '/adminapi/admin/addservice',
          method: 'POST',
          body: credentials,
        };
      },
    }),

    getAllServices: builder.query({
      query: () => '/adminapi/admin/services',
    }),

    editService: builder.mutation({
      query: ({ id, service }) => {
        console.log('Updating Service ID:', id, 'with Data:', service);
        return {
          url: `/adminapi/admin/editservices/${id}`, 
          method: 'PUT',
          body: service,
        };
      }
    }),
    
    deleteService: builder.mutation({
      query: ({id}) => {
        console.log('Deleting Service with ID:', id);
        return {
          url: `/adminapi/admin/deleteservices/${id}`,
          method: 'DELETE',
        };
      }
    }),
  }),
});

export const { useAdminloginMutation, useGetAllUsersQuery, useAddServiceMutation, useGetAllServicesQuery, useEditServiceMutation,  useDeleteServiceMutation } = adminApi;
