import express, { Application, Express, NextFunction, Request, Response } from "express";
import cors from "cors";

const app: Express = express();
const BASE_URL = "https://discord.com/api/v10"
const GUILD_ID = "1291667384884531242";
const CHANNEL_ID = "1291670162793168937";
const TOKEN = process.env.BOT_TOKEN ?? ""; // TODO: load from file instead
const PORT = 8772

app.use(cors())

async function sendMSG(msg: any) {
    let res = await fetch(`${BASE_URL}/channels/${CHANNEL_ID}/messages`, {
        method: "post",
        headers: {
            authorization: `Bot ${TOKEN}`,
            "content-type": "application/json"
        },
        body: JSON.stringify(msg)
    })

    if (res.ok) return await res.json()
    else {
        console.log(JSON.stringify(await res.json()))
    }
}

app.post("/msg-raw", async (req: Request, res: Response, next: NextFunction) => {
    try {
        let messageContent: string = decodeURIComponent(req.headers.message?.toString()!);
        let m = await sendMSG(JSON.parse(messageContent));
        res.status(200);
        res.send({
            channel_id: CHANNEL_ID,
            id: m.id,
        });
    } catch (e: any) {
        next(e);
    }
});

app.post("/msg-emoji", async (req: Request, res: Response, next: NextFunction) => {
    try {
        let messageContent: string = decodeURIComponent(req.headers.message?.toString()!);
        const emojiURLs: string = decodeURIComponent(req.headers.emojis?.toString()!);
        
        let emojis: {[key: string]: string} = {};
        for (let pair of emojiURLs.split(";")) {
            const [name, url] = pair.split(",");
            emojis[name] = url;
        }

        let newEmojis: {[key: string]: string} = {};
        let emojiIDs: string[] = [];
        for (let [n, u] of Object.entries(emojis)) {
            let img = await fetch(u);
            let blob = await img.blob();
            let buffer = Buffer.from(await blob.arrayBuffer()).toString('base64');
            const animated = /<a:\w+:\d+>/.test(n);
            let datauri = `data:image/${animated ? "gif" : "webp"};base64,${buffer}`;

            const emoji_name_regex = /<a?:(\w+):\d+>/i;
            if (!emoji_name_regex.test(n))
                continue; // probably default emoji

            let name = emoji_name_regex.exec(n)![1];
            let res = await fetch(`${BASE_URL}/guilds/${GUILD_ID}/emojis`, {
                body: JSON.stringify({
                    name: name,
                    image: datauri,
                    roles: []
                }),
                method: "post",
                headers: {
                    authorization: `Bot ${TOKEN}`,
                    "content-type": "application/json"
                }
            })
            let jres = await res.json();
            emojiIDs.push(jres.id);
            newEmojis[n] = `<${animated ? "a" : ""}:${jres.name}:${jres.id}>`;
        }

        for (let [oldE, newE] of Object.entries(newEmojis)) {
            messageContent = messageContent.replace(new RegExp(`${oldE}`, "gm"), newE);
        }

        let m = await sendMSG({content: messageContent})

        if (m != undefined) {
            res.status(200);
            res.send({
                channel_id: CHANNEL_ID,
                id: m.id,
            });
        } else {
            res.status(500)
            res.send({abort:true})
        }

        setTimeout(() => {
            for (let id of emojiIDs) {
                fetch(`${BASE_URL}/guilds/${GUILD_ID}/emojis/${id}`, {
                    method: "delete",
                    headers: {
                        authorization: `Bot ${TOKEN}`
                    }
                })
            }
        },100);
    } catch (e: any) {
        next(e);
    }

});



app.listen(PORT)