const Cache = require('./cache');

module.exports = (req, res, next) => {
  const { text: prompt, msisdn: to } = req.body;

  if (!Cache.get(to)) {
    Cache.set(msisdn);
  }

  console.log('>> middleware rateMsisdn');

  console.log('to: ', to);
  console.log('prompt: ', prompt);

  next();
}