const { askGPTSMS, rewritePrompt } = require('./OpenAI');
const { sendSMS } = require('./Vonage');

exports.inboundSMS = async (req, res) => {
  const { text: prompt, msisdn: to } = req.body;

  if (!prompt || !to) return res.status(400).send('invalid input');

  console.log('prompt: ', prompt, '\n');
  console.log('to: ', to, '\n');

  try {
    // const rewritedPrompt = await rewritePrompt(prompt);
    const gptResponse = await askGPTSMS(prompt);
    console.log('gptResponse: ', gptResponse, '\n');

    const vonageResponse = await sendSMS(to, gptResponse);
    console.log('vonageResponse: ', vonageResponse, '\n');

    res.status(200).send('OK');
  } catch (error) {
    console.log(error);
    res.status(500).send('KO');
  }
}

