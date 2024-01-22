const Table = require("nodejs-console-table");
function createTable(data) {
  const table = new Table(data).table;

  console.log(table);
}

function capitalize(word) {
  let newWord = [];
  word.split(" ").forEach((word) => {
    let firstLetter = word[0].toUpperCase();

    let restOfWord = word.slice(1).toLowerCase();

    let fullWord = firstLetter + restOfWord;

    newWord.push(fullWord);
  });

  newWord = newWord.join(" ");
  word = newWord;
//   console.log(word);
  return word
}

module.exports = {
  capitalize,
  createTable,
};
