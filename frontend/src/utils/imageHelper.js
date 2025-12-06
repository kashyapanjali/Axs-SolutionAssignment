// Helper function to get full image URL
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // If it's already a full URL, return it
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Otherwise, prepend the backend URL
  const backendUrl = process.env.REACT_APP_API_URL?.replace('/api', '');
  return `${backendUrl}${imageUrl}`;
};

