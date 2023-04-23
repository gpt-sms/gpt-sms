require('dotenv').config();
// express
const app = require('express')();
const bodyParser = require('body-parser');

// rate-limit
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 1, // Limit each IP to 1 requests per
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// express middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(limiter);

// API
const { inboundSMS } = require('./InboundSMS');
// const rateMsisdn = require('./rateMsisdn');

// API entrypoints
app.post('/webhooks/inbound-sms', /*rateMsisdn, */ inboundSMS);
app.post('/webhooks/delivery-receipts', (req, res) => {
  const params = Object.assign(req.query, req.body)
  console.log(params)

  // Send a 200 OK response to acknowledge receipt
  res.status(200).send('OK');

});

app.get('/ping', (req, res) => {
  console.log('ping');
  res.status(200).send('OK');
})

// start server
const port = process.env.API_PORT || process.env.PORT || 8000;
app.listen(port, () => { console.log(`GPTSMS is running on port: ${port}`) });
