const fs = require('fs').promises;
const mkdirp = require('mkdirp');
const path = require("path");
const axios = require("axios");
const { loadInput } = require('./utils');
const JSSoup = require("jssoup").default;
const moment = require("moment");
const { parse } = require('path');

const COOKIE = "session=53616c7465645f5f877ea57653456e0dfb4d8ca5179bdb4e9e95a30661e976ff8ef3556dd34dd0194d9c4b150b065fd77037f27cfea33e9bc347923acef558ab"

const REQUEST_OPTS = {
    headers: {
        Cookie: COOKIE,
    },
};

const getDailyChallenge = (day) => {
    const url = `https://adventofcode.com/2022/day/${day}`;
    return axios
        .get(url, REQUEST_OPTS)
        .then(response => {
            const soup = new JSSoup(response.data)
            const tag = soup.findAll('article')
            const html = tag.map(tag => tag.prettify()).join()
            return html
        })
        .then((html) => {
            const fullPath = path.join("challenges", `${day}`, "challenge.html");
            return mkdirp(path.dirname(fullPath))
                .then(() => {
                    return fs.writeFile(fullPath, html)
                });
        })
        .then((writeFileResult) => {
            console.debug('writeFileResult', writeFileResult);
        })
}

const getDailyInput = (day) => {
    const url = `https://adventofcode.com/2022/day/${day}/input`
    return axios
        .get(url, REQUEST_OPTS)
        .then(response => {
            return response.data;
        })
        .then((data) => {
            const fullPath = path.join("challenges", `${day}`, "input.txt");
            return mkdirp(path.dirname(fullPath))
                .then(() => {
                    return fs.writeFile(fullPath, data);
                })
        })
        .then((writeFileResult) => {
            console.debug('writeFileResult', writeFileResult);
        })
}

// const createDailyDirectories = () => {
//     var promises = []
//     for (var i = 1; i <= 25; i++) {
//         promises.push(mkdirp(`./challenges/${i}`))
//     }
//     return Promise.all(promises);
// }


// createDailyDirectories()
//     .then(() => {
//         console.info("Created 25 directories for AOC");
//     })
//     .catch((e) => {
//         console.error("Faild to create directories for AOC:", e);
//     });



const parseArgs = () => {
    var args = process.argv.slice(2);

    var parsed = {
        test: false,
        mode: "solve",
    };

    while (args.length) {
        const arg = args.shift();
        switch (arg) {
            case "-d":
            case "--day":
                parsed.day = args.shift();
                break;
            case "-f":
            case "--fetch":
            case "fetch":
                parsed.mode = "fetch";
                break;
            case "-s":
            case "--solve":
            case "solve":
                parsed.mode = "solve";
                break;
            case "-t":
            case "--test":
            case "test":
                parsed.mode = "solve";
                parsed.test = true;
                break;
            case "-i":
            case "--inspect":
            case "inspect":
                parsed.mode = "inspect";
                break;
            default:
                if (!parsed.day)
                    parsed.day = parseInt(arg);
        }
    }

    return parsed;
}

const fetchData = (day) => {
    getDailyChallenge(day)
        .then(() => {
            console.info(`Daily challenge collected for day ${day}`);
            return getDailyInput(day);
        })
        .then(() => {
            console.info(`Daily challenge input collected for day ${day}`);
            const fullPath = path.join("challenges", `${day}`, "solve.js");
            return fs.access(fullPath)
                .then(() => {
                    console.info(`Solution file already exists for day ${day}`);
                })
                .catch(() => {
                    return fs.copyFile("./solution_template.js", fullPath)
                        .then(() => {
                            console.info(`Solution file generated for day ${day}`);
                        })
                })
        })
        .then(() => {
            const fullPath = path.join("challenges", `${day}`, "test.txt");
            return fs.access(fullPath)
                .then(() => {
                    console.info(`Test file already exists for day ${day}`);
                })
                .catch(() => {
                    return fs.writeFile(fullPath, "")
                        .then(() => {
                            console.info(`Empty test input file generated for day ${day}`);
                        })
                });
        })
        .catch((e) => {
            console.error(`Something went wrong trying to fetch data for day ${day}`);
            console.debug(e);
        })
}

const inspect = (day) => {
    const fullPath = path.join("challenges", `${day}`);
    fs.readdir(fullPath)
        .then(files => {
            console.info(files);
        })
        .catch((e) => {
            console.error(`Something went wrong trying to inspect data for day ${day}`);
            console.debug(e);
        });
}

const solve = (day, test = false) => {

    const scriptPath = path.join("challenges", `${day}`, "solve.js");
    const { mapInput, solve1, solve2 } = require(`./${scriptPath}`);

    return loadInput(day, test)
        .then(mapInput)
        .then((mapped) => {

            const t1 = moment();
            const r1 = solve1(mapped);
            const t2 = moment();
            const r2 = solve2(mapped);
            const t3 = moment();

            const d1 = t2 - t1;
            const d2 = t3 - t2;

            console.info(r1);
            console.info(`${d1}ms`);

            console.info(r2);
            console.info(`${d2}ms`);
        })
        .catch((e) => {
            console.error(`Something went wrong trying to solve the puzzles for day ${day}`)
            console.debug(e);
        })
}

const args = parseArgs();

if (!args.day) return;

switch (args.mode) {
    case "fetch":
        fetchData(args.day)
        break;

    case "inspect":
        inspect(args.day);
        break;

    case "solve":
        solve(args.day, args.test);
        break;
}