const fs = require("fs").promises;
const path = require("path");

const log = (...args) => {
    console.log(...args);
    const items = args.map(a => `<li>${a}</li>`);
    const output = document.getElementById("output");
    output.write(...items);
};

const loadInput = (day, test) => {
    return fs.readFile(path.join("challenges", `${day}`, test ? "test.txt" : "input.txt"), "utf-8")
}

const sum = (p, c) => parseInt(p) + parseInt(c);

const sortDesc = (a, b) => b - a;

const sortAsc = (a, b) => a - b;

module.exports = {
    log,
    loadInput,
    sum,
    sortDesc,
    sortAsc,
};