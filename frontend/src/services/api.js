export const fetchDeals = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/deals');
    if (!response.ok) throw new Error('Failed to fetch deals');
    return await response.json();
  } catch (error) {
    console.error('Error fetching deals:', error);
    return []; // Fallback to an empty array if the server is not running
  }
};
