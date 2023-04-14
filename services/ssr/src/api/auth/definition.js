export const authSliceDefinition = {
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => ({
        url: '/auth/me',
      }),
      transformResponse: (res) => {
        return res;
      },
    }),
    login: builder.mutation({
      query: ({ username, password }) => ({
        url: '/auth/login',
        method: 'post',
        body: {
          username,
          password,
        },
      }),
    }),
  }),
  overrideExisting: true,
};
