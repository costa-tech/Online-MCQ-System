export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: {
      auth: [
        'POST /api/auth/login',
        'POST /api/auth/register'
      ],
      users: [
        'GET /api/users/profile'
      ],
      exams: [
        'GET /api/exams',
        'GET /api/exams/:id',
        'POST /api/exams/:id/start'
      ],
      results: [
        'POST /api/results',
        'GET /api/results/user/:userId',
        'GET /api/results/:resultId'
      ]
    }
  });
};
