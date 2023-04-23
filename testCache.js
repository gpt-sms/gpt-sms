const Cache = require('./src/cache');

const start = async () => {
  await Cache.init();

  // Cache.add(
  //   '123',
  //   [
  //     { role: 'system', content: 'You are an assistant!' },
  //   ]
  // );


  // Cache.pushNewMessage('123', {
  //   role: 'user', content: 'Help me',
  // })

  // Cache.pushNewMessage('123', { role: 'user', content: 'Help me' })

  console.log('items', Cache.get('322'));

  // await Cache.persist();
}

start();
