# Font Preview Tool

## Project Overview

The Font Preview Tool is a web-based application that allows users to preview and test Google Fonts instantly. Users can type custom text and see it rendered in various Google Fonts with real-time customization options for font size, text color, and background color. The tool also provides functionality to copy CSS code for implementing fonts in projects and export font previews as images.

## File Structure

- [index.html](file:///c:/Users/Alok%20Kumar/Desktop/Personal%20Project/Tools/Font%20Preview/index.html) - Main HTML structure and layout of the application
- [style.css](file:///c:/Users/Alok%20Kumar/Desktop/Personal%20Project/Tools/Font%20Preview/style.css) - Styling and responsive design for all UI components
- [script.js](file:///c:/Users/Alok%20Kumar/Desktop/Personal%20Project/Tools/Font%20Preview/script.js) - Core functionality and interactivity of the font preview tool

## How to Run the Project

1. Clone or download the repository
2. Open [index.html](file:///c:/Users/Alok%20Kumar/Desktop/Personal%20Project/Tools/Font%20Preview/index.html) in a web browser
3. No build process or server required - works directly in the browser

Alternatively, you can host the files on any static web server:
- Apache
- Nginx
- GitHub Pages
- Netlify
- Vercel

## Dependencies and Requirements

### External Libraries
- [html2canvas](https://html2canvas.hertzen.com/) - Used for exporting font previews as images
  - CDN: `https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js`

### Google Fonts
The application uses Google Fonts API to load and display fonts:
- Preloaded fonts: Inter, Roboto, Open Sans, Lato, Montserrat, Poppins, Source Sans Pro, Nunito, Raleway, Ubuntu, Playfair Display, Merriweather, Oswald, PT Sans, Libre Baskerville, Crimson Text, Fira Sans, Work Sans, DM Sans, Space Grotesk
- Dynamically loaded fonts: Bebas Neue, Dancing Script, Pacifico, Lobster, Righteous, Fredoka One, Comfortaa, Quicksand, Rubik, Mukti

### Browser Requirements
- Modern web browser with JavaScript enabled
- Internet connection (required for loading Google Fonts)

## Key Features

### Font Preview & Customization
- Real-time preview of 20+ Google Fonts
- Customizable text input (up to 500 characters)
- Adjustable font size (10px to 100px)
- Text color picker
- Background color picker
- Font categorization (Sans Serif, Serif, Display, Monospace)

### Organization & Filtering
- Font category filtering
- Font search functionality
- Favorite fonts feature with local storage persistence
- Featured/popular fonts highlighting

### Export & Sharing
- Export font previews as PNG images
- Export CSS code for all displayed fonts
- Copy individual font CSS imports with one click
- Keyboard shortcuts for quick actions

### User Experience
- Dark/light mode toggle with persistent settings
- Responsive design for mobile and desktop
- Toast notifications for user feedback
- Loading indicators during operations
- Reset to default settings option

## Technical Implementation Details

### HTML Structure
- Semantic HTML5 markup
- Accessible form controls with proper labeling
- Meta tags for SEO and social sharing
- Preloaded Google Fonts for performance
- Favicon using inline SVG

### CSS Architecture
- CSS Variables (Custom Properties) for theming
- Responsive grid layout using CSS Grid and Flexbox
- Mobile-first responsive design with media queries
- Dark mode support using `[data-theme="dark"]` attribute
- CSS animations and transitions for enhanced UX
- BEM-like naming convention for maintainability
- Print styles for exporting

### JavaScript Functionality
- ES6 Class-based architecture
- Local Storage API for persisting user preferences
- Event delegation for efficient event handling
- Dynamic DOM manipulation for font previews
- Asynchronous operations for image export
- Keyboard shortcut support (Ctrl+K for search, Ctrl+R for reset, Ctrl+E for export)
- Error handling and user feedback through toast notifications

### Performance Considerations
- Font preloading for improved rendering
- Efficient DOM updates using targeted element selection
- Lazy loading of additional fonts
- CSS containment and hardware acceleration
- Optimized event listeners

### Security Features
- Content Security Policy considerations
- Sanitized user inputs
- Secure clipboard API usage

## Keyboard Shortcuts
- `Ctrl+K` / `Cmd+K` - Focus search input
- `Ctrl+R` / `Cmd+R` - Reset to defaults
- `Ctrl+E` / `Cmd+E` - Open export modal

## Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing
This is a client-side only application with no build process. To contribute:
1. Fork the repository
2. Make changes to HTML, CSS, or JavaScript files
3. Test in multiple browsers
4. Submit a pull request

## License
This project is open source and available under the MIT License.