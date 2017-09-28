const initDb = require('./../models');
const sampleEntry = require('./../constants/sampleEntry');
const {splitEvery} = require('ramda');
const seedRandom = require('seed-random');

const TOTAL = 300000;
const BATCH_SIZE = 1000;
const CHUNK_SIZE = 200;

function genBatchInsertQuery({rows, client, db}) {

  if ('sql.js' === client) {
    return splitEvery(CHUNK_SIZE, rows)
      .map((rows) => {

        const insertSql = rows.map(({folderId, sourceEntry, pageNum, data}) => {
          return `INSERT INTO Entry (folderId, sourceEntry, pageNum, data) VALUES (${folderId}, '${sourceEntry}', ${pageNum}, '${data}');`;
        }).join('\n');

        return `
          BEGIN TRANSACTION;
          ${insertSql}
          COMMIT;
        `;
      })
      .join('\n');
  }
  return db.knex.batchInsert('Entry', rows, CHUNK_SIZE);
}

module.exports = async function batchInsert({client, filename, total = TOTAL}) {

  const {db} = await initDb({filename, client});
  const entryData = JSON.stringify(sampleEntry);
  const startAt = Date.now();
  const random = seedRandom(startAt);
  const rows = [];

  for (let i = 1; i <= total; i++) {
    const sourceEntry = `${sampleEntry['source-entry-bo']}-${i}`;

    rows.push({
      folderId: (i % 20) + 1,
      sourceEntry,
      data: entryData,
      pageNum: Math.round(random() * 1000)
    });

    if (rows.length >= BATCH_SIZE) {
      const query = genBatchInsertQuery({rows, client, db});
      await db.raw(query);
      rows.length = 0;

      const msUsed = Date.now() - startAt;
      const rps = Math.round(i / (msUsed / 1000));
      console.log(`(${i} / ${total}) ${rps} rps`);
    }
  }
  db.close();
};
