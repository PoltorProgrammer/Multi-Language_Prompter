# 🌍 Multilingual Subtitle Prompter

A fullscreen **subtitle-style multilingual prompter** with intelligent timing, dynamic flag display, and smooth typewriter animations. Ideal for presentations, speeches, language learning, and live translation demos.

---

## 🚀 Features

* 📝 **Subtitle-style display** — One sentence at a time in multiple languages
* 🧱 **8-row layout** — 2 rows per language (Main, English, Chinese, Russian)
* 🚩 **Dynamic flag switching** — Flag changes based on spoken language
* ⏱️ **Smart timing** — Pauses automatically based on punctuation
* ⌨️ **Typewriter animation** — Character-by-character rendering
* 🔁 **Auto-looping** — Runs continuously through all phrases
* 🖥 **Fullscreen mode** — Press `F` to toggle
* ⚙️ **Easy customization** — Timing variables at the top of `script.js`

---

## 📁 File Structure

```
presentation-prompter/
├── index.html          # Main HTML structure
├── style.css           # Styling and layout
├── script.js           # Timing logic and animations
├── content.json        # Multilingual text content
└── README.md           # This file
```

---

## ⚙️ Setup

### ▶️ Run the Prompter

Just open `index.html` in any modern browser.

> ⚠️ **Note:** Flag images load from Wikipedia — an internet connection is required.

### 🖥 Enter Fullscreen

Press **`F`** to toggle fullscreen mode.

---

## 🧠 How It Works

### Screen Layout (Fixed Height %)

| Section              | Height |
| -------------------- | ------ |
| Main Language        | 28%    |
| English              | 24%    |
| Chinese (Simplified) | 24%    |
| Russian              | 24%    |

Each section contains:

* **2 text rows** (each = 50% of section height)
* **Text area:** 75% width (left-aligned)
* **Flag area:** 25% width (centered)
* **No wrapping** — only one line per row
* **Vertical centering** for each text row

---

### 🧾 Token-by-Token Display

* Standard languages → **word-by-word**
* Chinese → **character-by-character (2× faster)**
* All languages update **simultaneously**

---

### 📜 Scrolling Logic

When text reaches **66.67% width**, row 2 moves up to row 1:

```
Row 2 reaches 2/3 screen width  →  shifts to Row 1
```

```
┌────────────────────────────────────────────┬──────────┐
│ Row 1: (empty)                 |           │          │
├────────────────────────────────────────────┤    EN    │
│ Row 2: I've already lived in fo|ur         │          │
└────────────────────────────────────────────┴──────────┘
```

...then shifts up:

```
┌────────────────────────────────────────────┬──────────┐
│ Row 1: I've already lived in fo|ur         │          │
├────────────────────────────────────────────┤    EN    │
│ Row 2: different countries and |           │          │
└────────────────────────────────────────────┴──────────┘
```

---

### ⚑ Dynamic Flag Rules

| Logic            | Flag                   |
| ---------------- | ---------------------- |
| `zh-tw`          | Taiwan 🇹🇼            |
| Any other `zh-*` | China 🇨🇳             |
| Others           | Based on language code |

After each phrase → **1000ms pause**, then moves to the next.

---

## ⏱ Timing Configuration

Defined at the top of `script.js`:

```javascript
const CHAR_DELAY = 50;               // Base delay
const PAUSE_BETWEEN_PHRASES = 1000;  // Pause after phrase completes
```

| Language                  | Delay                    |
| ------------------------- | ------------------------ |
| English, Spanish, Russian | `CHAR_DELAY * 2` (100ms) |
| Chinese                   | `CHAR_DELAY` (50ms)      |

---

## 📦 Content Structure (`content.json`)

### Structure

```json
{
  "language": "es",
  "main": "Your Spanish text here.",
  "en": "Your English translation.",
  "zh": "Your Chinese translation.",
  "ru": "Your Russian translation."
}
```

### Supported Language Codes

| Code  | Language              |
| ----- | --------------------- |
| es    | Spanish               |
| en    | English               |
| it    | Italian               |
| pt    | Portuguese            |
| fr    | French                |
| de    | German                |
| ru    | Russian               |
| zh-tw | Chinese (Traditional) |
| zh-ch | Chinese (Simplified)  |

---

## 🖥 Display Layout

```
┌──────────────────────────────────────────────────────┬─────────────┐
│ Main Language (Row 1)                                │    FLAG     │
│ Main Language (Row 2)                                │   25% Box   │
├──────────────────────────────────────────────────────┼─────────────┤
│ English (Row 1 & 2)                                  │     GB      │
├──────────────────────────────────────────────────────┼─────────────┤
│ Chinese (Row 1 & 2)                                  │  CN or TW   │
├──────────────────────────────────────────────────────┼─────────────┤
│ Russian (Row 1 & 2)                                  │     RU      │
└──────────────────────────────────────────────────────┴─────────────┘
```

---

## 🧭 Future Improvements (Ideas)

* 🎙 Voice-to-text integration
* 🎨 Theme customizer (dark/light mode)
* 📦 Electron desktop app
* 🎧 Audio playback sync
