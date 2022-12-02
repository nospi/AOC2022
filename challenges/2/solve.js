// A = ROCK
// B = PAPER
// C = SCISSORS

// X = ROCK
// Y = PAPER
// Z = SCISSORS

// SCORE VALUES:
// ROCK = 1
// PAPER = 2
// SCISSORS = 3

const SCORE_TABLE = {
    X: 1,
    Y: 2,
    Z: 3,
};

const WIN = { A: "Y", B: "Z", C: "X" }
const LOSE = { A: "Z", B: "X", C: "Y" }
const DRAW = { A: "X", B: "Y", C: "Z" }

const resolveCombination = (a, b) => {
    switch (a) {
        case "A":
            return (b == "X") ? 3 : (b == "Y" ? 6 : 0)
        case "B":
            return (b == "Y") ? 3 : (b == "Z" ? 6 : 0)
        case "C":
            return (b == "Z") ? 3 : (b == "X" ? 6 : 0)
    }
}

module.exports = {

    mapInput: (input) => {
        const lines = input.split("\n");
        const mapped = lines.map(line => {
            const split = line.split(" ");
            return {
                opponent: split[0],
                response: split[1],
            };
        });
        return mapped;
    },

    solve1: (input) => {
        const roundScores = input.map(({ opponent, response }) => {
            let score = SCORE_TABLE[response];
            const winLoseDraw = resolveCombination(opponent, response)
            return score + winLoseDraw;
        })
        const total = roundScores.reduce(((p, c) => {
            if (!isNaN(c))
                return p + c;
            return p;
        }), 0)
        return total;
    },

    solve2: (input) => {

        const roundScores = input.map(({ opponent, response }) => {
            // response actually == winLoseDraw
            let reply;
            let score;
            switch (response) {
                case "X": // lose
                    reply = LOSE[opponent];
                    score = 0;
                    break;
                case "Y": //draw
                    reply = DRAW[opponent];
                    score = 3;
                    break;
                case "Z": // win
                    reply = WIN[opponent];
                    score = 6;
                    break;
            }
            return SCORE_TABLE[reply] + score;
        });
        const total = roundScores.reduce(((p, c) => {
            if (!isNaN(c))
                return p + c;
            return p;
        }), 0)
        return total;
    },

}