const batchInsert = require('./helpers/batchInsert');

(async function main() {

  const client = 'sqlite3';

  await batchInsert({
    client,
    filename: `test2-${client}.sqlite3`
  });
})();
