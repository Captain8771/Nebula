# Nebula Vencord Compat
since Nebula can't be used without a client mod, for hopefully obvious reasons, you need a plugin for your client mod of choice that implements Nebula support.

to install Nebula on Vencord, you're gonna need a development install. see [the official guide](https://docs.vencord.dev/installing/) on how to get one.
<!--
TODO: See if its possible to safely integrate Nebula's backend into the plugin (plugin launching the backend? backend code thrown into plugin?) and if so, open a PR on vencord's side.

this isn't really a high-priority but it's something to keep in mind.
-->

once you've done all that, drop `index.ts` from this folder into `vencord/src/plugins/Nebula` (create the folder if it doesnt exist), recompile, reload discord, and you should be done.

as of writing this (Nebula v1.0), the plugin alone will not be enough to get Nebula functional. you're gonna need what is in the server-side folder of this repository. head over there and read the instructions!
