export const handler = async (event) => {
    const response = 'Priya says ' + event.keyword;
    return response;
  };
