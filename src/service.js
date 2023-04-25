require('dotenv').config();

// express
const service = require('express')();
const bodyParser = require('body-parser');

// express middlewares
service.use(bodyParser.json());
service.use(bodyParser.urlencoded({ extended: true }));

const boot = async () => {
  // Cache
  await require('./cache').init();

  // Limiter: check for numbers and cache timestamp
  const { limiter } = require('./limiter');

  // SERVICES
  const { inboundSMS } = require('./InboundSMS');

  // Entrypoints
  service.post('/webhooks/inbound-sms', limiter, inboundSMS);

  service.post('/webhooks/delivery-receipts', (req, res) => {
    const params = Object.assign(req.query, req.body);
    console.log('delivery-receipts: ', params);
    res.status(200).send('OK');
  });

  service.get('/ping', limiter, (req, res) => {
    console.log('ping ok');
    res.status(200).send('OK');
  });

  // start server
  const port = process.env.API_PORT || process.env.PORT || 8000;
  service.listen(port, () => { console.log(`🚀 GPT SMS is running on port: ${port}`) });
}

boot();
