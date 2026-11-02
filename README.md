# After the Answer

An original science-fiction narrative game about choice, understanding, and the governance of time. Vika is sent to correct history; Noyi, a woman from a hidden era, tries to preserve the processes that correct answers leave behind.

## Play

1. Clone or download this repository.
2. Open `start.html` in a recent Chrome, Edge, or Firefox.
3. If the browser restricts local files, run `Start-local-server.command` on macOS, or run:

```sh
python3 -m http.server 56607 --bind 127.0.0.1 --directory game
```

Then open <http://127.0.0.1:56607/v75/start.html?lang=en>.

English is the default public presentation. The game also includes Simplified Chinese, Arabic, Hindi, and Japanese. Arabic uses right-to-left layout. Translations other than the Chinese controlling text remain working drafts awaiting native-speaker review.

## Novella

- [Complete English working translation](novel/After-the-Answer.en.md)
- [中文版小说](novel/After-the-Answer.zh-Hans.md)

The Chinese production manuscript is the controlling text for the adaptation. The complete English edition is an AI-assisted working translation and still requires a native literary line edit before publication.

## Release scope

This public repository contains only the playable V7.5 runtime, required artwork, offline launcher, checksums, and the two novella editions. It excludes development memory, private source archives, tests, reviews, generation prompts, intermediate art, and repository history from the private production project.

This is a complete playable development build, not a release-certified commercial product. Art, sound, character animation, translations, and playtesting remain in progress. Saves remain in the player's browser and are not uploaded.

`SHA256SUMS.txt` records checksums for the shipped runtime and both novella files.

## Rights

Copyright is reserved by the project creator. Publication of this repository does not grant permission to redistribute, sell, relicense, train on, or create derivative works from the story, game, or artwork. No open-source license is granted at this stage.
