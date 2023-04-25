const Cache = require('./cache');
const { createOne, updateOne } = require('./supabase');

const { sendSMS } = require('./Vonage');
const { askGPTSMS } = require('./OpenAI');

exports.inboundSMS = async (req, res) => {
  const { cached } = req;
  const { text: prompt, msisdn: sender } = req.body;

  if (!prompt || !sender) return res.status(400).send('invalid input');

  console.log('prompt: ', prompt, '\n');
  console.log('sender: ', sender, '\n');

  try {
    /* Ask GPT SMS */
    const gptResponse = await askGPTSMS(prompt);
    console.log('gptResponse: ', gptResponse, '\n');

    /* Send SMS */
    const vonageResponse = await sendSMS(sender, gptResponse);
    console.log('vonageResponse', vonageResponse);

    const msgs = [
      { role: 'user', content: prompt },
      { role: 'assistant', content: gptResponse },
    ];

    // create or push in the cache pool
    Cache[ cached ? 'pushNewMessages' : 'create' ](sender, msgs);

    // persist cache
    await Cache.persist();

    // persist in supabase
    if (!cached)
      await createOne({ msisdn: sender, msgs });
    else
      await updateOne(sender, msgs);

    res.status(200).send('OK');
  } catch (error) {
    console.log(error);
    res.status(500).send('KO');
  }
}

