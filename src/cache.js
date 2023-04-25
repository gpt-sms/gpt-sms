const fs = require('fs').promises;
const path = require('path');


module.exports = {
  /**
   * Pool of msisdn's containing messages and timestamp.
   *
   * 'msisdn': {
   *    messages: [],
   *    timestamp: '123456789'
   * }
   */
  pool: {},

  cacheFilePath: path.join(__dirname, '..', '.cache'),

  /**
   * Init the cache create a specific file and restor in memory if exists
   */
  init: async function () {
    try {
      await fs.access(this.cacheFilePath);
      console.log('👍 cache exists in: ', this.cacheFilePath);

      const content = await fs.readFile(this.cacheFilePath);
      if (content) {
        console.log('👍 cache loaded in memory');
        this.pool = JSON.parse(content);
      }
    } catch (err) {
      console.log(`'cache' does not exist. Creating it...`);

      try {
        await fs.writeFile(this.cacheFilePath, '');
        console.log(`👌 cache created successfully...`);
      } catch (writeErr) {
        console.error(`Error creating 'cache'}'reated successfully...`, writeErr);
      }
    }
  },

  /**
   * Create a new item in the pool
   * 
   * @param {String} msisdn calledId
   * @param {Array} messages messages history {role, content}
   */
  create: function (msisdn, messages) {
    if (this.pool[msisdn])
      return false;

    this.pool[msisdn] = {
      messages,
      timestamp: Date.now(),
    };
  },

  /**
   * Push a new message to the msisdn
   *
   * @param {String} msisdn calledId
   * @param {Object} message message to be pushed.
   */
  pushNewMessages: function (msisdn, messages) {
    if (!this.pool[msisdn])
      return false;

    this.pool[msisdn] = {
      messages: [...this.pool[msisdn].messages, ...messages],
      timestamp: new Date().getTime(),
    }
  },

  all: function () {
    return this.pool;
  },

  get: function (msisdn) {
    return this.pool[msisdn];
  },

  clear: async function () {
    this.pool = {};
    await this.persist();
  },

  persist: async function () {
    try {
      await fs.writeFile(this.cacheFilePath, JSON.stringify(this.pool));
      console.log('JSON object saved successfully to: ', this.cacheFilePath);
    } catch (err) {
      console.error('Error saving JSON object to file:', err);
    }
  }

}
