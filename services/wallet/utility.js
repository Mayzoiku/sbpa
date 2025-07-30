export const sanitize = ({ data, page = 1, pageSize = 10, total = 0 }) => {
  return {
    data,
    meta: {
      pagination: {
        page,
        pageSize,
        total,
        pageCount: Math.ceil(total / pageSize),
      },
    },
  };
};
