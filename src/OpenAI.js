const { Configuration, OpenAIApi } = require("openai");

const PROMPTS = {
  ask: `You are an assistant who reply only by sms. Your reply cannot exceed 160 characters and contain only the sms content.`
}
const MODEL = 'gpt-3.5-turbo';

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

const askBot = async (pre, prompt) => {
  const completion = await openai.createChatCompletion({
    model: MODEL,
    messages: [
      { role: "system", content: pre },
      { role: "user", content: prompt }
    ],
    max_tokens: 50,
    temperature: 0.7,
  });

  return completion.data.choices[0].message.content.trim();
};

exports.askGPTSMS = async (prompt) => askBot(PROMPTS.ask, prompt);
