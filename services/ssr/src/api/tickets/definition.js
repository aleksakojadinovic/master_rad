export const ticketsSliceDefinition = {
  endpoints: (builder) => ({
    getTicket: builder.query({
      query: ({ id }) => ({
        url: `/tickets/${id}`,
      }),
      transformResponse: (res) => {
        // TODO: Entity normalization? Overkill?
        return res;
      },
    }),
  }),
  overrideExisting: true,
};
