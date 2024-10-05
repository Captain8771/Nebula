/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2024 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { addPreSendListener, removePreSendListener } from "@api/MessageEvents";
import { definePluginSettings } from "@api/Settings";
import { ErrorCard, Link } from "@components/index";
import { Devs } from "@utils/constants";
import { classes, Margins } from "@utils/index";
import definePlugin, { OptionType } from "@utils/types";
import { ReactNode } from "react";
import { Webpack } from "Vencord";
import { Forms } from "webpack/common/components";

const forwardModule = Webpack.findByPropsLazy("sendForward");
const forceLoadForward = Webpack.extractAndLoadChunksLazy(['"forward-modal"', "initialSelectedDestinations:"]);

export default definePlugin({
    name: "Nebula",
    description: "Implements the client side of Nebula, using forwarding to improve FakeNitro.\nRequires additional setup.\nPatches for allowing sending embeds are taken from FakeNitro.",
    authors: [Devs.captain],
    dependencies: ["MessageEventsAPI"],
    settings: definePluginSettings({
        backend_url: {
            type: OptionType.STRING,
            description: "URL of the Nebula backend",
            default: "http://127.0.0.1:8772",
            placeholder: "http://127.0.0.1:8772",
            isValid(setting: string) {
                return new RegExp("^https?:\/\/(?:\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\.\\d{1,3}|localhost|[a-z.]+)(?::\\d+)?\/?$").test(setting);
            }
        }
    }),
    patches: [
        {
            // stolen from fakenitro
            find: ".PREMIUM_LOCKED;",
            replacement: {
                match: /!\i\.\i\.canUseEmojisEverywhere\(\i\)/,
                replace: "($&&&false)"
            }
        },
        {
            find: ".PREMIUM_LOCKED;", // also stolen from fakenitro.
            replacement: {
                match: /(?<=\|\|)\i\.\i\.canUseAnimatedEmojis\(\i\)/,
                replace: "($&||true)"
            }
        }
    ],
    settingsAboutComponent(): ReactNode {
        return (
            <ErrorCard
                className={classes(Margins.top16, Margins.bottom16)}
                style={{ padding: "1em" }}
            >
                <Forms.FormTitle>NOTE!</Forms.FormTitle>
                <Forms.FormText>
                    Enabling this plugin is not enough to get Nebula to work.
                </Forms.FormText>
                <Forms.FormText>
                    You also need to <Link href="https://github.com/captain8771/Nebula">set up Nebula's backend</Link>!
                </Forms.FormText>
            </ErrorCard>

        );
    },
    async sendPatch(cId, msg: { content: string, [key: string]: any; }, extra) {
        let canUseAllEmojis = true;
        let emojis: string[] = [];
        for (const emoji of msg.validNonShortcutEmojis) {
            if (canUseAllEmojis) {
                // @ts-ignore: typescript yells at you for this but you can ignore it, and i'm pretty sure some official plugins do this too
                canUseAllEmojis = window.Vencord.Plugins.plugins.FakeNitro.canUseEmote(emoji, cId);
            }
            /*
            {
                    "roles": [],
                "require_colons": true,
                "name": "lore2",
                "managed": false,
                "id": "1288448097277448223",
                "available": true,
                "animated": false,
                "allNamesString": ":lore2:",
                "guildId": "1158002349713936394",
                "type": 1
            }
                */
            let emojiUrl = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'webp'}?size=1024`;
            emojis.push(`<${emoji.animated ? 'a' : ''}:${emoji.name.split("~")[0]}:${emoji.id}>,${emojiUrl}`);
        }
        if (!canUseAllEmojis) {
            await forceLoadForward();
            let emojiHeader = encodeURIComponent(emojis.join(";"));
            let msgHeader = encodeURIComponent(msg.content);
            let res = await fetch("http://127.0.0.1:8772/msg-emoji", {
                method: "post",
                headers: {
                    emojis: emojiHeader,
                    message: msgHeader
                }
            });

            if (!res.ok) return;
            msg.content = '';
            forwardModule.sendForward(await res.json(), cId, { withMessage: '' });
        } else {
            // assume its either a raw message component, or a normal message.
            if (!msg.content.startsWith("JSON::")) {
                return;
            }

            let content = msg.content.slice(6);
            let msgHeader = encodeURIComponent(content);
            let res = await fetch("http://127.0.0.1:8772/msg-raw", {
                method: "post",
                headers: {
                    message: msgHeader
                }
            });

            if (!res.ok) return;
            msg.content = '';
            forwardModule.sendForward(await res.json(), cId, { withMessage: '' });
        }
    },
    start() {
        addPreSendListener(this.sendPatch);
    },

    stop() {
        removePreSendListener(this.sendPatch);
    }
});
