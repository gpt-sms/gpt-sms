const Cache = require('./cache');

// helpers
const unixDiffToHours = (t1, t2) => Math.floor(Math.abs(t1 - t2) / 36e5);
const phoneRegexFR = /^((\+)?33|0|0033)[1-9](\d{2}){4}$/;

const limiter = (req, res, next) => {
  const { msisdn: sender } = req.body;

  /** Accept only FR numbers (Only in testing phase). */
  if (!phoneRegexFR.test(sender)) {
    console.error({ code: 400, msg: `${sender} is not a french number` })
    return res.status(400).send(`${sender} is not a french number`);
  }

  const cached = Cache.get(sender);
  if (cached) {
    const diffInHours = unixDiffToHours(Date.now(), cached.timestamp);

    // if timestamp is less than 24h
    if (diffInHours < 24) {
      // The 429 error code causes A Retry-After header might be included to this response
      console.error({ code: 400, msg: 'too many requests', msisdn: sender });
      return res.status(400).send('too many requests');
    }

    req.cached = true;
    return next();
  }

  req.cached = false;
  return next();
}

module.exports = {
  limiter
}