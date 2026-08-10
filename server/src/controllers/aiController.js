const { generateAdvisorResponse } = require('../services/aiService');

exports.chatWithAdvisor = async (req, res, next) => {
  try {
    const { prompt, assessmentData, goals } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'User prompt message is required.' });
    }

    const advisorResult = await generateAdvisorResponse(prompt, assessmentData, goals);

    return res.status(200).json({
      success: true,
      data: advisorResult
    });
  } catch (error) {
    next(error);
  }
};
