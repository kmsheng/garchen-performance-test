const initDb = require('./../models');
const sampleEntry = require('./../constants/sampleEntry');
const seedRandom = require('seed-random');

const TOTAL = 300000;

module.exports = async function insertOneByOne({client, filename}) {

  const {db, models} = await initDb({filename, client});
  const {Entry} = models;
  const entryData = JSON.stringify(sampleEntry);
  const startAt = Date.now();
  const random = seedRandom(startAt);

  for (let i = 1; i <= TOTAL; i++) {
    const sourceEntry = `${sampleEntry['source-entry-bo']}-${i}`;
    await Entry.create({
      folderId: (i % 20) + 1,
      sourceEntry,
      data: entryData,
      pageNum: Math.round(random() * 1000)
    });
    if (0 === (i % 500)) {
      const msUsed = Date.now() - startAt;
      const rps = Math.round(i / (msUsed / 1000));
      console.log(`(${i} / ${TOTAL}) ${rps} rps`);
    }
  }
  db.close();
};
