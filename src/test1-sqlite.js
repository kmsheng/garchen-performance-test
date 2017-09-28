const insertOneByOne = require('./helpers/insertOneByOne');

(async function main() {

  const client = 'sqlite3';

  await insertOneByOne({
    client,
    filename: `test1-${client}.sqlite3`
  });
})();
