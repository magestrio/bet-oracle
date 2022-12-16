import Router from "koa-router";

import logger from "koa-logger";
import json from "koa-json";

import { Signature, isReady, PrivateKey, Field } from "snarkyjs";
import { finished } from "stream";
const Koa = require('koa');
const fs = require("fs");
const cors = require('@koa/cors');

const PORT = process.env.PORT || 3005;

const app = new Koa();
const router = new Router();

const saveFile = 'data.json';
const templateFile = 'template.json'

const privateKeyBase58 = "EKDiTFTtcRbeJk6gN8efH3qKwKMgK1UM9xWzLrjTymv9wytYvhY2";

type ISignature = {
    signature: {
        r: string;
        s: string
    }
}

type BetOption = {
    id: number;
    name: string;
    description: string
};

type OngoingBet = ISignature & {
    id: number;
    name: string;
    description: string;
    bet_start_date: number;
    bet_end_date: number
    bet_options: BetOption[]
};

type FinishedBet = OngoingBet & {
    winner?: number
}

async function generateDataFromTemplate() {
    await isReady;

    let privateKey = PrivateKey.fromBase58(privateKeyBase58);

    if (!fs.existsSync(templateFile)) {
        throw Error("Template file does not exist");
    }

    // Clean up file
    fs.writeFileSync(saveFile, '');

    const betsFile = fs.readFileSync(templateFile, 'utf8');
    let data: { ongoing_bets: OngoingBet[] } = JSON.parse(betsFile);

    for (const ongoing_bet of data.ongoing_bets) {
        console.log(ongoing_bet);

        let fields = ongoing_bet.bet_options.map(bet_option => Field(bet_option.id))

        ongoing_bet.bet_start_date = Date.now() - (7 * 24 * 60 * 60 * 1000);
        ongoing_bet.bet_end_date = Date.now() + (7 * 24 * 60 * 60 * 1000);

        const signature = Signature.create(privateKey, [
            Field(ongoing_bet.id),
            Field(ongoing_bet.bet_start_date),
            Field(ongoing_bet.bet_end_date),
        ]
            .concat(fields))

        ongoing_bet.signature = {
            r: signature.r.toString(),
            s: signature.s.toJSON().toString()
        }

        console.log("done")
    }

    const ongoing_bets = data.ongoing_bets;

    fs.writeFileSync(saveFile,
        JSON.stringify({
            ongoing_bets
        }),
        'utf8'
    )
}

function getAllBets(): any {
    return JSON.parse(fs.readFileSync(saveFile, 'utf8'));
}

function revealBet(ongoingBet: OngoingBet, privateKey: PrivateKey): FinishedBet {
    let finishedBet: FinishedBet = ongoingBet

    let fields = finishedBet.bet_options.map(bet_option => Field(bet_option.id))
    
    finishedBet.winner = ongoingBet.id == 5 ? 0 : Math.floor(Math.random() * 3);;

    const signature = Signature.create(privateKey, [
        Field(finishedBet.id),
        Field(finishedBet.bet_start_date),
        Field(finishedBet.bet_end_date),
    ]
        .concat(fields)
        .concat(Field(finishedBet.winner!).toFields()))

    finishedBet.signature = {
        r: signature.r.toString(),
        s: signature.s.toJSON().toString()
    }

    return finishedBet;
}

async function revealBets(all: boolean, id: number) {
    await isReady;

    let privateKey = PrivateKey.fromBase58(privateKeyBase58);

    const betsFile = fs.readFileSync(saveFile, 'utf8')
    let dataO: { ongoing_bets: OngoingBet[] } = JSON.parse(betsFile);
    let dataF: { finished_bets: FinishedBet[] } = JSON.parse(betsFile);

    if (all) {
        if (dataO.ongoing_bets === undefined) {
            return;
        }
        if (dataF.finished_bets === undefined) {
            dataF.finished_bets = []
        }

        for (const ongoing_bet of dataO.ongoing_bets) {
            const revealedBet = revealBet(ongoing_bet, privateKey)
            dataF.finished_bets.push(revealedBet);
        }

        fs.writeFileSync(saveFile,
            JSON.stringify({
                finished_bets: dataF.finished_bets
            }),
            'utf8'
        )
    } else {
        let resultBet: OngoingBet | null = null

        for (const ongoing_bet of dataO.ongoing_bets) {
            if (ongoing_bet.id == id) {
                resultBet = ongoing_bet;
                break;
            }
        }

        if (resultBet !== null && resultBet !== undefined) {
            const revealedBet = revealBet(resultBet, privateKey);
            if (dataF.finished_bets === undefined) {
                dataF.finished_bets = []
            }
            dataF.finished_bets.push(revealedBet);

            fs.writeFileSync(saveFile,
                JSON.stringify({
                    ongoing_bets: dataO.ongoing_bets.filter(bet => bet.id != id),
                    finished_bets: dataF.finished_bets
                }),
                'utf8'
            )
        }
    }
}

router.get('/', async (ctx, next) => {
    ctx.body = 'Hello';
    await next();
});

router.get('/bets', async (ctx, next) => {
    ctx.body = getAllBets();
    await next();
});

router.get('/generate', async (ctx, next) => {
    console.log('Generate new data');
    ctx.body = await generateDataFromTemplate();
    await next();
});

router.get('/reveal', async (ctx, next) => {
    const id = ctx.query.id;
    if (id !== undefined) {
        await revealBets(false, Number(id));
    } else {
        await revealBets(true, -1);
    }

    await next();
});

app.use(cors());
app.use(json());
app.use(router.routes()).use(router.allowedMethods());
app.listen(PORT, () => {
    console.log(`Oracle Server listening on port ${PORT}!`)
});