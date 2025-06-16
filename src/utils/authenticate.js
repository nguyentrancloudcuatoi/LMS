export const authenticate = async (request) => {
  return { 
    user: { 
      id: 1,
      name: 'Test User',
      role: 'admin'
    }, 
    body: request.body 
  }
};