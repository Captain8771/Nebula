# Nebula Vencord Compat
since Nebula can't be used without a client mod, for hopefully obvious reasons, you need a plugin for your client mod of choice that implements Nebula support.

to install Nebula on Vencord, you're gonna need a development install. [TODO: Explain what a dev install is and how to get one.]

once you've done all that, drop `index.ts` from this folder into `vencord/src/plugins/Nebula` (create the folder if it doesnt exist), recompile, reload discord, and you should be done.

as of writing this (Nebula v1.0), the plugin alone will not be enough to get Nebula functional. you're gonna need what is in the server-side folder of this repository. head over there and read the instructions!
