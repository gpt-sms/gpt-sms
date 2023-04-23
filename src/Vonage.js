const { Vonage } = require('@vonage/server-sdk');

const VONAGE_FROM = process.env.VONAGE_PHONE_NUMBER;
if (!VONAGE_FROM) {
  throw new Error('undefined VONAGE_PHONE_NUMBER variable');
}

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

exports.sendSMS = async (to, text, from = VONAGE_FROM) => vonage.sms.send({ to, from, text });
