const batchInsert = require('./helpers/batchInsert');

(async function main() {

  const client = 'sql.js';

  await batchInsert({
    client,
    filename: `test2-${client}.sqlite3`
  });
})();
