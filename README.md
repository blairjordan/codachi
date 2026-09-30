# Codachi

![codachi logo](https://github.com/blairjordan/codachi/raw/main/media/codachi-logo.png)

Codachi brings cute, animated monster pets to your workspace.

Watch them hatch from eggs, run around while you code, and evolve as they gain experience from your coding activity.

![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/pegleg.codachi)
![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/Pegleg.codachi)
![Codachi Twitter](https://img.shields.io/twitter/url?label=codachi_monster&style=social&url=https%3A%2F%2Ftwitter.com%2Fcodachi_monster)
![Codachi Stars](https://img.shields.io/github/stars/blairjordan/codachi?style=social)

## Screenshots

### Panel Mode

![VS Code Pet Example 1](https://github.com/blairjordan/codachi/raw/main/media/screenshot1.gif)

![VS Code Pet Example 2](https://github.com/blairjordan/codachi/raw/main/media/screenshot2.gif)

### Explorer Mode

![VS Code Pet in Explorer](https://github.com/blairjordan/codachi/raw/main/media/screenshot3.gif)

## Features

- Hatch random pets with original designs and animations.
- Gain XP by writing more code.
- When enough XP is gained, your monster will level up!
- Choose between Panel mode or Explorer mode to display your pet.

## Getting Started

### Codachi-Inspired Codex Pets

We have a few Codachi-inspired pet designs for Codex and ChatGPT in `media/dot/`.

![Codachi-inspired Codex pet sprite sheet](media/dot/m1d1-dot-sprites.png)

![Codachi-inspired bird Codex pet sprite sheet](media/dot/m51d-dot-sprites.png)

The original transparent PNG sprite sheets are included in `media/dot/`:

- Blue monster: `m1d1-dot-sprites.png`
- Bird: `m51d-dot-sprites.png`

To use a design, download its PNG and provide it to your custom-pet setup workflow. In the ChatGPT desktop app, start from **Settings > Pets > Create pet** and provide the sprite sheet with a request such as:

> Set up this existing sprite sheet as my custom pet. Preserve the supplied artwork and animation frames.

Once setup finishes, return to **Settings > Pets**, select **Refresh**, and choose your pet. Enter `/pet` to show it.

Both supplied sheets are 1536 × 2288 pixels. The documented web **Upload pet** format is 1536 × 1872, so these originals need format adaptation before that upload workflow; direct import of these sheets has not been verified.

In Codex CLI, use `/pets` to choose a compatible installed pet in a supported terminal.

Official pet setup and terminal requirements:

https://learn.chatgpt.com/docs/pets

### Panel Mode (Default)

Launch VS Code Quick Open (`Ctrl` + `Shift` + `P`), paste the following command, and press Enter.

```
Codachi: Show Panel
```

This will show the Codachi panel. Your pet will wander around here.

### Explorer Mode

To use Explorer mode instead, run:

```
Codachi: Open Explorer View
```

Your pet will now appear in the Explorer panel. This keeps your pet visible while you work.

### Spawning a New Pet

To spawn a new pet, hit `Ctrl` + `Shift` + `P`, paste the following command, and press Enter:

```
Codachi: New Pet
```

Your pet will appear (inside an egg). Start typing to hatch your pet.

Your pet will gain XP as you code in either mode.

### Switching Between Modes

You can switch between Panel and Explorer modes in two ways:

1. **Via Settings**:

   - Open VS Code Settings (`Ctrl` + `,`)
   - Search for "codachi.position"
   - Select either "panel" or "explorer"

2. **Via Commands**:
   - Use `Codachi: Show Panel` to switch to Panel mode
   - Use `Codachi: Open Explorer View` to switch to Explorer mode

### Enabling the XP Bar

By default, the XP bar is hidden. To enable it:

   - Open VS Code Settings (`Ctrl` + `,`)
   - Search for `codachi.showXP`
   - Check the box to enable the XP bar

The XP counter will appear in the top left corner of your Codachi view, showing your current XP and the total XP needed to reach the next level.
