
export const useAnalytics = () => {
  const trackEngagement = (type: string, contentId: number) => {
    // Track user engagement metrics
    apiRequest('POST', '/api/analytics/engagement', {
      type,
      contentId,
      timestamp: new Date()
    });
  };

  return { trackEngagement };
};
