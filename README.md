# garchen-performance-test

## Installation
```bash
yarn
```

## Test1 - sql.js vs sqlite ( insert one by one )
```bash
node src/test1-sqljs.js
```

```bash
node src/test1-sqlite.js
```

## Test2 - sql.js vs sqlite ( batch insert )
```bash
node src/test2-sqljs.js
```

```bash
node src/test2-sqlite.js
```

### Test3 - Select time based on large file without index vs with index
```bash
node src/test-large-file.js
```

```bash
sqlite3 src/models/large-file.sqlite3
```

```bash
.timer on
select pageNum from Entry where folderId = 1 order by pageNum DESC limit 10;

create index my_index on Entry(folderId, pageNum);
select pageNum from Entry where folderId = 1 order by pageNum DESC limit 10;
```
