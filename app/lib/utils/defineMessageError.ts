export const errorMessages: {[key: number]: string} = {
  404: 'The page you are looking for was not found.',
  500: 'Internal Server Error. Please try again later.',
  403: 'You do not have permission to access this page.',
};

export function getErrorMessage(status: number): string {
  return errorMessages[status] || 'An unexpected error occurred.';
}
