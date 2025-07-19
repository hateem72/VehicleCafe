export const getRecommendedParking = async (userLocation, vehicleType, api) => {
  try {
    const timeOfDay = new Date().getHours() >= 8 && new Date().getHours() <= 18 ? 'peak' : 'off-peak';
    const response = await api.get('/api/parking/nearby', {
      params: { ...userLocation, vehicleType, timeOfDay }
    });
    return response.data;
  } catch (err) {
    console.error('Recommendation error:', err);
    return [];
  }
};