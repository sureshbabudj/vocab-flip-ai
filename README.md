# VocabFlip AI App

A modern Anki-style flash card app for learning German vocabulary, built with React, Zustand (with local storage), Tailwind CSS, and [webllm](https://github.com/mlc-ai/web-llm) for AI-powered translations.

## Features

- ⚡ **AI-powered translation**: Instantly translate German words/phrases and get rich linguistic details using webllm (runs locally in your browser).
- 🃏 **Flash card system**: Add, reveal, and delete cards. Each card shows the German word, and flips to reveal the translation, example, verb forms, synonyms, and more.
- 💾 **Persistent storage**: All cards are saved in your browser (localStorage) using Zustand's persist middleware.
- 🎨 **Beautiful UI**: Responsive, modern design with Tailwind CSS. Flip effect, blockquote examples, and more.
- 🚀 **IndexedDB model caching**: Fast model loading after the first use.

## Setup

1. **Install dependencies**

   ```sh
   npm install
   ```

2. **Start the development server**
   ```sh
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

## Usage

- **Add a card**: Enter a German word or phrase and click "Add". The app will fetch the translation and details using webllm.
- **Flip a card**: Click on a card to flip and reveal the translation and details. Click again to hide.
- **Delete a card**: Click the "×" button on the front of a card to remove it from your deck.
- **All cards are saved**: Your flash cards persist across page reloads and browser restarts.

## Tech Stack

- [React](https://react.dev/)
- [Zustand](https://github.com/pmndrs/zustand) (with persist)
- [Tailwind CSS](https://tailwindcss.com/)
- [webllm](https://github.com/mlc-ai/web-llm) (browser LLM for translation)

## Customization

- You can change the default model or prompt in `src/webllmUtil.ts`.
- Tailwind styles can be customized in `tailwind.config.js` and `src/index.css`.

## Credits

- Inspired by [Anki](https://apps.ankiweb.net/) and the [webllm examples](https://github.com/mlc-ai/web-llm/blob/main/examples/).

---

Happy learning! 🇩🇪
