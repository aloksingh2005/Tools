## Age Calculator Pro

Beautiful, fast, and accessible age calculator that computes your exact age with rich insights. Enter a date of birth to see years, months, and days, alternate time formats, life statistics, zodiac info, upcoming milestones, fun facts, and more. Supports English/Hindi, light/dark theme, and optional voice announcements.

### Demo
- Open `index.html` in any modern browser. No build step required.

### Highlights
- **Exact age breakdown**: years, months, days with proper month/day carry.
- **Alternate formats**: total days, hours, minutes, seconds lived.
- **Life stats (estimates)**: heartbeats, breaths, hours slept, meals eaten.
- **Birth info**: day of week, season, Western zodiac, Chinese zodiac, birthstone.
- **Milestones**: next three milestone birthdays with dates and days remaining.
- **Fun facts**: context-aware and localized fun facts about your age.
- **Localization**: English and Hindi with instant toggle and persisted preference.
- **Theme**: light/dark theme with persisted preference.
- **Voice announcements**: optional speech synthesis of results.
- **Keyboard shortcuts**: productivity-focused shortcuts for power users.
- **Share/Print/PDF**: Web Share API fallback to clipboard, print styles, PDF via “Save as PDF”.
- **Responsive + accessible**: mobile-friendly, reduced-motion support, focus outlines, high-contrast support.
- **SEO + social**: meta description/keywords and Open Graph tags included.

### Tech Stack
- **Vanilla HTML/CSS/JavaScript** only. No frameworks or dependencies.
- Uses the **Web Speech API** for optional voice announcements if supported by the browser.

### Project Structure
```text
age-calculator/
  ├─ index.html   # App markup, metadata, and layout
  ├─ style.css    # Responsive, themed, and accessible styling
  └─ script.js    # Logic: calculations, UI updates, localization, voice, UX
```

### How It Works
- The app sets the date input `max` to today and validates input ranges (after 1900, not in the future).
- On calculate:
  - Computes exact age by normalizing months/days.
  - Derives totals (days/hours/minutes/seconds) from the time delta.
  - Determines next birthday and days remaining.
  - Looks up day of week, Western zodiac, Chinese zodiac, season, and birthstone.
  - Estimates life stats using reasonable constants (documented in `script.js`).
  - Renders quick stats, detailed breakdown, alternate formats, life stats, birth info, milestones, and fun facts.
  - Optionally announces results using speech synthesis.

### Features in Detail
- **Localization (EN/HI)**: All user-facing strings are stored on elements via `data-en`/`data-hi` attributes and switched in-place. The HTML `lang` attribute is updated accordingly.
- **Preferences**: Theme, language, and voice are persisted in `localStorage` under keys `ageCalculatorTheme`, `ageCalculatorLanguage`, and `ageCalculatorVoice`.
- **Keyboard Shortcuts**:
  - `Ctrl/Cmd + Enter`: Calculate age
  - `Ctrl/Cmd + D`: Toggle dark mode
  - `Ctrl/Cmd + L`: Toggle language
  - `Ctrl/Cmd + V`: Toggle voice
  - `Escape`: Reset calculator
- **Sharing/Printing**:
  - Share uses the Web Share API with clipboard fallback.
  - Print view hides non-essential UI and applies print-friendly styles.
  - PDF export is provided via the browser’s “Save as PDF”.

### Running Locally
1. Clone or download the repository.
2. Open `index.html` directly in a modern browser, or serve the folder via a static server.

Optional quick server (choose one):
```bash
# Python 3
python -m http.server 8080

# Node (npx, no install)
npx serve -l 8080
```
Then visit `http://localhost:8080`.

### Deployment
- Any static hosting works: GitHub Pages, Netlify, Vercel, Cloudflare Pages, etc.
- Entry file is `index.html`; no build step or server required.

### Progressive Web App (optional)
- `script.js` registers a Service Worker at `/sw.js` if available. To enable offline support, add a minimal `sw.js` at your site root and serve over HTTPS.
- If you don’t plan to use a Service Worker, you can remove the registration block at the bottom of `script.js`.

### Accessibility
- Focus styles for keyboard users.
- Respects `prefers-reduced-motion` to reduce animation.
- High-contrast mode support via `prefers-contrast: high`.

### Privacy
- No analytics or external data collection.
- User preferences (theme/language/voice) are stored locally in `localStorage` only.

### Browser Support
- Modern Chromium, Firefox, Safari, and Edge.
- Voice announcements require Speech Synthesis support; gracefully disabled otherwise.

### Customization
- Colors, radius, and shadows are CSS variables in `:root` and `[data-theme="dark"]`.
- Localization can be extended by adding `data-xx` attributes and updating the language toggling.
- Life-stat multipliers (e.g., heartbeats/day) are constants in `script.js` and can be tuned.

### Roadmap Ideas
- Add `sw.js` for offline caching and installability.
- Persist last-entered DOB (opt-in) for quicker re-checks.
- Export to image/PNG of the results section.
- Add more locales and right-to-left support.
- Add unit tests for date calculations and edge cases (leap days).

### Acknowledgements
- Icons from Font Awesome CDN.
- Fonts via Google Fonts (Poppins).

### License
Specify your license here (e.g., MIT), or add a `LICENSE` file.


