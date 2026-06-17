# Color Palette & Gradient Generator

A powerful, browser-based tool for generating color palettes, CSS gradients, and accessibility checking. This application helps designers and developers create beautiful color schemes and gradients for their projects.

## Features

### 🎨 Color Palette Generator
- Generate color palettes with various harmony rules:
  - Random Colors
  - Monochromatic
  - Complementary
  - Triadic
  - Analogous
  - Split Complementary
- Add/remove custom colors
- Drag and drop to reorder colors
- Copy color codes in HEX, RGB, and HSL formats
- Save palettes for later use
- Export palettes as PNG images
- Extract colors from uploaded images

### 🌈 Gradient Generator
- Create CSS gradients with multiple color stops
- Support for linear, radial, and conic gradients
- Customizable gradient directions
- Animate gradients with a single click
- Copy generated CSS code with one click

### ♿ Accessibility Tools
- **Contrast Checker**: Verify text/background color contrast ratios for WCAG compliance
- **Color Blindness Simulator**: Preview how your palette appears to users with different types of color vision deficiency

### 🛠 Additional Features
- Dark/light mode toggle
- Undo/redo functionality
- Keyboard shortcuts
- Fully responsive design
- Local storage for saving palettes
- PWA (Progressive Web App) support

## Usage

### Color Palette Generation
1. Select a harmony type from the dropdown menu
2. Click "Generate Palette" to create a new color scheme
3. Add additional colors with the "Add Color" button
4. Click on any color to copy its HEX code
5. Use the format buttons to copy RGB or HSL values

### Gradient Creation
1. Choose gradient type (linear, radial, or conic)
2. Select direction for linear gradients
3. Add or remove color stops as needed
4. Adjust color positions using the percentage inputs
5. Copy the generated CSS code for use in your projects

### Accessibility Checking
1. **Contrast Checker**: Select foreground and background colors to check contrast ratios
2. **Color Blindness Simulation**: Choose a color vision deficiency type to see how your palette appears

## Keyboard Shortcuts

- `Ctrl+Z` / `Cmd+Z`: Undo
- `Ctrl+Y` / `Cmd+Y`: Redo
- `Ctrl+G` / `Cmd+G`: Generate new palette
- `Ctrl+D` / `Cmd+D`: Toggle dark mode

## Technical Details

### Built With
- HTML5
- CSS3 (with modern features like CSS variables and flexbox)
- Vanilla JavaScript (ES6+)
- No external dependencies

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires support for:
  - CSS Grid/Flexbox
  - CSS Variables
  - ES6 JavaScript features
  - LocalStorage API

### Architecture
- Single-page application
- Object-oriented JavaScript with class-based structure
- Responsive design with mobile-first approach
- Semantic HTML for accessibility
- CSS custom properties for theming

## Installation

No installation required! Simply open `index.html` in a modern web browser.

For local development:
```bash
git clone <repository-url>
cd color-palette-generator
# Open index.html in your browser
```

## File Structure

```
.
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── script.js           # Application logic and functionality
└── README.md           # This file
```

## How It Works

### Color Generation
The application uses HSL (Hue, Saturation, Lightness) color space for generating harmonious color palettes:
- **Monochromatic**: Variations of a single hue with different saturation and lightness values
- **Complementary**: Colors opposite each other on the color wheel
- **Triadic**: Three colors evenly spaced around the color wheel
- **Analogous**: Colors adjacent to each other on the color wheel
- **Split Complementary**: A base color and two colors adjacent to its complement

### Color Manipulation
- Converts between HEX, RGB, and HSL color formats
- Calculates contrast ratios for accessibility compliance
- Simulates color blindness using simplified transformation matrices

### Data Persistence
- Uses localStorage to save palettes between sessions
- Implements history tracking for undo/redo functionality
- Stores user preferences (dark mode setting)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

Created with ❤️ for designers and developers.

## Support

For support, please open an issue on the repository or contact the maintainer.