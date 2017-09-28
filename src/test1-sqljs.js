const insertOneByOne = require('./helpers/insertOneByOne');

(async function main() {

  const client = 'sql.js';

  await insertOneByOne({
    client,
    filename: `test1-${client}.sqlite3`
  });
})();
