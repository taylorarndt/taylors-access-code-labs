# Taylor's Access Code Labs

I’m Taylor, and this is where I try out features I’d like to add to AccessCode. If you have an idea, run into a bug, or want to work on a feature with me, you’re welcome to open an issue or send a pull request. Feedback from people trying the Mac betas is especially welcome.

You can find my experimental Mac builds on the [Labs releases page](https://github.com/taylorarndt/taylors-access-code-labs/releases). The downloads farther down this page come from the [original AccessCode project](https://github.com/Community-Access/access-code).

AccessCode is an AI coding agent built to work well with VoiceOver and other screen readers. It is a version of [OpenCode](https://github.com/anomalyco/opencode), the open source coding agent, with accessibility fixes throughout the desktop app.

You chat with an AI model, and it reads, writes and runs code in your projects. You choose the model: a cloud service you already pay for, or a model running privately on your own Mac.

## Download

The current downloads, updated automatically when a release is published:

<!-- accesscode:downloads:start -->
### Mac (Apple silicon)

- **AccessCode 2.3.0, first public release** (latest): [dmg (arm64)](https://github.com/Community-Access/access-code/releases/download/accesscode-2.3.0/AccessCode-mac-arm64.dmg) · [zip (arm64)](https://github.com/Community-Access/access-code/releases/download/accesscode-2.3.0/AccessCode-mac-arm64.zip)
- **AccessCode Beta 2.3.2-beta.6** (beta): [dmg (arm64)](https://github.com/Community-Access/access-code/releases/download/accesscode-2.3.2-beta.6/AccessCode-Beta-mac-arm64.dmg) · [zip (arm64)](https://github.com/Community-Access/access-code/releases/download/accesscode-2.3.2-beta.6/AccessCode-Beta-mac-arm64.zip)

### Windows (in testing)

- **AccessCode 2.3.2 for Windows** (beta): [exe (installer arm64)](https://github.com/Community-Access/access-code/releases/download/accesscode-2.3.2-windows/accesscode-2.3.2-windows-arm64-installer.exe) · [zip (portable arm64)](https://github.com/Community-Access/access-code/releases/download/accesscode-2.3.2-windows/accesscode-2.3.2-windows-arm64-portable.zip) · [exe (installer x64)](https://github.com/Community-Access/access-code/releases/download/accesscode-2.3.2-windows/accesscode-2.3.2-windows-x64-installer.exe) · [zip (portable x64)](https://github.com/Community-Access/access-code/releases/download/accesscode-2.3.2-windows/accesscode-2.3.2-windows-x64-portable.zip)
<!-- accesscode:downloads:end -->

On a Mac, open the .dmg and drag AccessCode to Applications. It is signed and notarized, and it installs next to OpenCode, sharing your settings and conversations with it. It needs a Mac with Apple silicon.

Older versions are on the [Releases page](https://github.com/Community-Access/access-code/releases).

## Use any AI provider

AccessCode is not tied to one company or one kind of model. Connect as many providers as you like in Settings, Providers, and switch models in any chat.

**Cloud providers**

- Claude (Anthropic)
- ChatGPT, with your ChatGPT sign-in, or OpenAI with an API key
- GitHub Copilot
- Google Gemini
- OpenRouter, Vercel AI Gateway and many more
- OpenCode Go and OpenCode Zen, OpenCode's own optional plans

**Models on your own Mac**

Any server that speaks the OpenAI API works, so you can run models privately and offline with tools such as LM Studio, Ollama, MLX servers or TensorFold. Your code never leaves your Mac.

## What AccessCode adds

### Works with VoiceOver

- Every control has one clear name, and headings mark each part of the screen.
- Replies, "Working" and permission requests are read aloud as they happen.
- Settings has a sensible focus order, and each setting is read once.
- Tooltips no longer open or read twice when VoiceOver moves the pointer.
- Accessibility fixes from open OpenCode pull requests are included.

### Add extensions without editing files

Settings, Extensions has an Add button for:

- **Apps and services (MCP servers):** popular servers in categories, plus the MCP Registry and the Docker MCP Catalog. Servers that support it sign in through your browser. Keys you type are kept in the macOS Keychain.
- **Plugins:** OpenCode community plugins.
- **Skills:** from skills.sh.

Everything you add can be removed from the same page. If something is not listed, "Ask AI to add" or the /add command in any chat adds it for you.

### Accessibility settings

Settings, Accessibility lets you choose how chats sound and read:

- **Reply announcements:** Off, Reply ready (a short "Response ready"), or Read full reply (the default).
- **Announce copied replies:** confirms when a reply is copied to the clipboard.
- **Heading levels:** choose levels 3 to 6 for your messages and for replies. The chat title is level 2.
- **Test Announcements** and **Repeat Last Announcement** are on this page, in the command palette, and in the View, Accessibility menu.

## Windows (in testing)

Windows builds are in testing, and the current download is in the [Download](#download) section above. To build one yourself, follow the [Windows build instructions](./packages/desktop/README.md#windows-x64-installer). They make three versions:

- **Installer:** `dist\desktop\accesscode-desktop-win-x64.exe` installs AccessCode for the current user.
- **Unpacked app:** `dist\desktop\app\AccessCode Dev.exe` runs without installing and uses your normal profile.
- **Portable app:** `dist\portable\AccessCode-windows-x64\AccessCode Dev.exe` keeps its settings in an `AccessCode-data` folder beside it. Keep the whole folder together. See the [portable build notes](./packages/desktop/README.md#windows-portable-edition).

On Windows and Linux, menus have access keys: Alt+F for File, Alt+E for Edit, Alt+V for View and Alt+H for Help.

## Known limits

- The terminal interface (TUI) has not been changed yet.
- AccessCode does not update itself yet. Check the Releases page for new versions.
- Only Apple silicon Macs have released builds today. Windows is in testing.

## Staying close to OpenCode

AccessCode follows OpenCode closely and brings in each OpenCode release, so you get their new features and fixes along with the accessibility work. For how agents, models and settings work, see the [OpenCode documentation](https://opencode.ai/docs).

AccessCode is not built by the OpenCode team and is not affiliated with them.

## Feedback and contributing

Found something that does not work with your screen reader? [Open an issue](https://github.com/Community-Access/access-code/issues). Pull requests are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

## Contributors

<!-- accesscode:contributors:start -->
AccessCode is made by [Taylor Arndt](https://github.com/taylorarndt), with contributions from [Jeff Bishop](https://github.com/accesswatch), [digitARTI](https://github.com/digitARTI) and [pranam-s](https://github.com/pranam-s). Thank you!
<!-- accesscode:contributors:end -->
