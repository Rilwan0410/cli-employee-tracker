const Table = require("nodejs-console-table");
module.exports = function createTerminalTable(data) {
  const table = new Table(data).table;

  console.log(table);
};
