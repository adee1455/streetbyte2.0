export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const handleAuthError = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  return 'An error occurred during authentication';
};