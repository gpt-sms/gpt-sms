const Cache = require('./cache');

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const createOne = async (item) => {
  await supabase
    .from('msisdn')
    .insert(item);

  console.log(`${item.msisdn}: created in supabase with success`)
}

const updateOne = async (msisdn, msgs) => {
  const messages = [...Cache.get(msisdn).messages, ...msgs];

  await supabase
    .from("msisdn")
    .update({ msgs: messages })
    .eq("msisdn", msisdn);

  console.log(`${msisdn}: updated in supabase with success`)
}

module.exports = {
  createOne,
  updateOne,
};
