const rimraf = require('rimraf');
const Trilogy = require('trilogy');
const path = require('path');
const fs = require('fs');
const log = require('karmapa-log');
const {indexBy, prop} = require('ramda');

module.exports = async function initDb({filename, client}) {

  const dbPath = path.resolve(__dirname, filename);

  rimraf.sync(dbPath);
  fs.closeSync(fs.openSync(dbPath, 'wx'));
  log.info(`Created ${filename}`);

  const options = {client};

  if (process.env.LOG_QUERY) {
    options.verbose = (sql) => log.info(`sql: ${sql}`);
  }

  const db = new Trilogy(dbPath, options);

  const promises = fs.readdirSync(__dirname)
    .filter((filename) => filename.endsWith('.js') && (! filename.startsWith('.')) && ('index.js' !== filename))
    .map((filename) => {
      const {name, schema, options} = require(path.resolve(__dirname, filename));
      return db.model(name, schema, options);
    });

  const models = indexBy(prop('name'), (await Promise.all(promises)));
  return {db, models};
};
