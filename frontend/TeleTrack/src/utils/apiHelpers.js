// frontend/TeleTrack/src/utils/apiHelpers.js
export const handleApiError = (error) => {
    if (error.response) {
      return error.response.data.error || 'An error occurred';
    }
    return 'Network error occurred';
  };
  
  export const withErrorHandler = async (apiCall) => {
    try {
      const response = await apiCall();
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: handleApiError(error) };
    }
  };