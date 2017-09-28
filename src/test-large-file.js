const batchInsert = require('./helpers/batchInsert');

(async function main() {

  const client = 'sqlite3';

  await batchInsert({
    client,
    filename: `large-file.sqlite3`,
    total: 300000 * 10
  });
})();
