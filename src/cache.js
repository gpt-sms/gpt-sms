const fs = require('fs').promises;
const path = require('path');


module.exports = {
  /**
   * Pool of msisdn's containing messages and timestamp.
   *
   * 'msisdn': {
   *    messages: [],
   *    timestap: '123456789'
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
      console.log(`'cache' already exists.`);

      this.pool = JSON.parse(
        await fs.readFile(this.cacheFilePath)
      );
    } catch (err) {
      console.log(`'cache' does not exist. Creating it...`);

      try {
        await fs.writeFile(this.cacheFilePath, '');
        console.log(`'cache'} created successfully...`);
      } catch (writeErr) {
        console.error(`Error creating 'cache'}'reated successfully...`, writeErr);
      }
    }
  },

  /**
   * Add new item to the pool
   * 
   * @param {String} msisdn calledId
   * @param {Array} messages messages history {role, content}
   */
  add: function (msisdn, messages) {
    if (this.pool[msisdn])
      throw new Error('Msisdn: ' + msisdn + ' already cached');

    this.pool[msisdn] = {
      messages,
      timestamp: new Date().getTime(),
    };
  },

  /**
   * Push a new message to the msisdn
   *
   * @param {String} msisdn calledId
   * @param {Object} message message to be pushed.
   */
  pushNewMessage: function (msisdn, message) {
    if (!this.pool[msisdn])
      throw new Error('Msisdn: ' + msisdn + ' is undefined in cache.');

    this.pool[msisdn] = {
      messages: [...this.pool[msisdn].messages, message],
      timestamp: new Date().getTime(),
    }
  },

  all: function () {
    return this.pool;
  },

  get: function (msisdn) {
    if (!this.pool[msisdn])
      throw new Error('Msisdn: ' + msisdn + ' is undefined in cache.');

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
