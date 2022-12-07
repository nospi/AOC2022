const fs = require('fs').promises
const mkdirp = require('mkdirp')
const path = require("path")
const axios = require("axios")
const { loadInput } = require('./utils')
const JSSoup = require("jssoup").default
const moment = require("moment")
const { NodeHtmlMarkdown } = require("node-html-markdown")

const COOKIE = `session=${process.env.SESSION}`

const REQUEST_OPTS = {
    headers: {
        Cookie: COOKIE,
    },
}

const parseArgs = () => {
    var args = process.argv.slice(2)

    var parsed = {
        test: false,
        mode: "solve",
    }

    while (args.length) {
        const arg = args.shift()
        switch (arg) {
            case "-v":
            case "--verbose":
                parsed.verbose = true
                break
            case "-d":
            case "--day":
                parsed.day = args.shift()
                break
            case "-f":
            case "--fetch":
            case "fetch":
                parsed.mode = "fetch"
                break
            case "-s":
            case "--solve":
            case "solve":
                parsed.mode = "solve"
                break
            case "-t":
            case "--test":
            case "test":
                parsed.mode = "solve"
                parsed.test = true
                break
            case "-i":
            case "--inspect":
            case "inspect":
                parsed.mode = "inspect"
                break
            case "-u":
            case "--update":
            case "update":
                parsed.mode = "update"
                break;
            default:
                if (!parsed.day)
                    parsed.day = parseInt(arg)
        }
    }

    return parsed
}

const args = parseArgs()

const getDailyChallenge = (day) => {
    const url = `https://adventofcode.com/2022/day/${day}`
    return axios
        .get(url, REQUEST_OPTS)
        .then(response => {
            const soup = new JSSoup(response.data)
            const tag = soup.findAll('article')
            const html = tag.map(tag => tag.prettify()).join()
            return html
        })
        .then((html) => {
            const htmlPath = path.join("challenges", `${day}`, "challenge.html")
            const markdownPath = path.join("challenges", `${day}`, "challenge.md")
            return mkdirp(path.dirname(htmlPath))
                .then(() => {
                    return Promise.all([
                        fs.writeFile(htmlPath, html),
                        fs.writeFile(markdownPath, NodeHtmlMarkdown.translate(html)),
                    ])
                })
                .then(() => {
                    console.info("Saved challenge document to HTML and markdown")
                })
        })

}

const getDailyInput = (day) => {
    const url = `https://adventofcode.com/2022/day/${day}/input`
    return axios
        .get(url, REQUEST_OPTS)
        .then(response => {
            return response.data
        })
        .then((data) => {
            const fullPath = path.join("challenges", `${day}`, "input.txt")
            return mkdirp(path.dirname(fullPath))
                .then(() => {
                    return fs.writeFile(fullPath, data)
                })
        })
}

const update = (day) => {
    return getDailyChallenge(day)
        .then(() => {
            console.info(`Daily challenge info updated for day ${day}`)
        });
}

const fetch = (day) => {
    getDailyChallenge(day)
        .then(() => {
            console.info(`Daily challenge collected for day ${day}`)
            return getDailyInput(day)
                .then(() => {
                    console.info(`Daily challenge input collected for day ${day}`)
                })
        })
        .then(() => {
            const fullPath = path.join("challenges", `${day}`, "solve.js")
            return fs.access(fullPath)
                .then(() => {
                    console.info(`Solution file already exists for day ${day}`)
                })
                .catch(() => {
                    return fs.copyFile("./solution_template.js", fullPath)
                        .then(() => {
                            console.info(`Solution file generated for day ${day}`)
                        })
                })
        })
        .then(() => {
            const fullPath = path.join("challenges", `${day}`, "test.txt")
            return fs.access(fullPath)
                .then(() => {
                    console.info(`Test file already exists for day ${day}`)
                })
                .catch(() => {
                    return fs.writeFile(fullPath, "")
                        .then(() => {
                            console.info(`Empty test input file generated for day ${day}`)
                        })
                })
        })
        .catch((e) => {
            console.error(`Something went wrong trying to fetch data for day ${day}`)
            if (args.verbose) console.debug(e)
        })
}

const inspect = (day) => {
    const fullPath = path.join("challenges", `${day}`)
    fs.readdir(fullPath)
        .then(files => {
            console.info(files)
        })
        .catch((e) => {
            console.error(`Something went wrong trying to inspect data for day ${day}`)
            if (args.verbose) console.debug(e)
        })
}

const solve = (day, test) => {
    const scriptPath = path.join("challenges", `${day}`, "solve.js")
    try {
        const { mapInput, solve1, solve2 } = require(`./${scriptPath}`)
        return loadInput(day, test)
            .then(mapInput)
            .then((mapped) => {

                const t1 = moment()
                const r1 = solve1(JSON.parse(JSON.stringify(mapped)))
                const t2 = moment()
                const r2 = solve2(JSON.parse(JSON.stringify(mapped)))
                const t3 = moment()

                const d1 = t2 - t1
                const d2 = t3 - t2

                console.info(r1)
                console.info(`${d1}ms`)

                console.info(r2)
                console.info(`${d2}ms`)
            })
    } catch (e) {
        console.error(`Something went wrong trying to solve the puzzles for day ${day}`)
        if (args.verbose) console.debug(e)
    }
}

if (!args.day) return

switch (args.mode) {
    case "fetch":
        fetch(args.day)
        break

    case "inspect":
        inspect(args.day)
        break

    case "solve":
        solve(args.day, args.test)
        break

    case "update":
        update(args.day);
        break;
}