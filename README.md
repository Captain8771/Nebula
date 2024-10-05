# Nebula
Nebula is a proof-of-concept for automated forwarding of messages. with this, one can do stuff like bypass the need for nitro when uploading files, or increase your filesize limit back up to 25mb (when i get around to it). you can aso send embeds.

## how it works
Nebula consists of two sides: the server side, and client side, talking to each other over HTTP. i have detailed the exact steps below, in order of when it happens:

**Client Side**: upon sending, check if message has unusable emojis

**Client Side**: if there are unusable emojis, contact the server with a list of emojis and the message content

**Server Side**: clones all the emojis to an internal server

**Server Side**: replaces the emojis in the message content with the cloned emojis

**Server Side**: sends the updated message content to an internal channel

**Server Side**: sends the client the necessary information to forward that message

**Server Side**: deletes the cloned emojis

**Client Side**: cancels sending the original message

**Client Side**: forwards the message to the specified location.

## how to use it 
**Server**:
as of writing this (before Nebula even released publicly!) there are no custom backends that implement the Nebula API, so you are limited to the official one. [click here to see how to use it!](./server-side/README.md)

**Client**:
- [Vencord](https://vencord.dev/): to use Nebula on Vencord, as of writing this you need to install the plugin manually. see: [the readme of the vencord plugin](./vencord-side/README.md)

###### Note: if you do make a Nebula-implementing plugin for another client mod, be sure to shoot me a message at `niko.oneshot.real`, or open an issue/pull request on this repo, and i'll throw it into the list!

