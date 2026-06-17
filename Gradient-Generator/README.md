# Gradient Background Generator

A powerful, feature-rich CSS gradient generator that allows you to create beautiful linear and radial gradients with an intuitive UI. Export your gradients as CSS, download as PNG, or save your favorites for later use.

## 🌟 Features

- **Linear & Radial Gradients**: Switch between linear and radial gradient types
- **Customizable Colors**: Add up to 6 color stops with precise positioning
- **Angle Control**: Adjust gradient direction with slider or numerical input (0-360°)
- **Radial Positioning**: Control the center point of radial gradients
- **Real-time Preview**: See your gradient update as you make changes
- **Multiple Export Options**:
  - Copy CSS code with vendor prefixes
  - Download as PNG image
  - Copy as CSS variables
  - Copy as SCSS mixin
- **Preset Library**: Access popular gradients or save your own favorites
- **Dark/Light Theme**: Toggle between color schemes based on your preference
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Keyboard Shortcuts**: Speed up your workflow with hotkeys
- **URL Sharing**: Share your exact gradient via URL
- **Import/Export Presets**: Save and load your favorite gradients

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start creating beautiful gradients!

No build process or dependencies required - it's pure HTML, CSS, and JavaScript.

## 🎨 How to Use

1. **Choose Gradient Type**: Toggle between Linear and Radial gradients
2. **Adjust Direction**:
   - For Linear: Use the slider or input field to set the angle (0-360°)
   - For Radial: Select a position from the dropdown (Center, Top Left, etc.)
3. **Customize Colors**:
   - Click color boxes to change colors using the color picker
   - Edit hex values directly in the text fields
   - Drag sliders to adjust color stop positions
   - Add up to 6 colors using the "+" button
   - Remove colors with the "×" button (minimum 2 colors)
4. **Export Your Gradient**:
   - **Copy CSS**: Get the CSS background property with vendor prefixes
   - **Download PNG**: Save your gradient as a PNG image
   - **Copy as Variables**: Get CSS custom properties format
   - **Copy SCSS**: Get SCSS mixin format
5. **Save Favorites**: Click "Save Current" to add your gradient to the favorites tab
6. **Browse Presets**: Check the Popular, Favorites, and Recent tabs for inspiration

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---------|--------|
| Ctrl/Cmd + C | Copy CSS |
| Ctrl/Cmd + R | Randomize gradient |
| Ctrl/Cmd + S | Save to favorites |
| Ctrl/Cmd + D | Download PNG |
| Space | Randomize gradient (when not in input) |
| Arrow Left/Right | Adjust angle (linear gradients) |

## 🧠 Technical Details

### Project Structure

```
gradient-background-generator/
├── index.html
├── styles.css
└── app.js
```

### Core Components

1. **GradientGenerator Class**: The main application controller
2. **State Management**: Handles gradient type, colors, angles, and presets
3. **UI Components**:
   - Real-time preview panel
   - Color stop controls
   - CSS output display
   - Preset library with tabs
   - Responsive layout
4. **Persistence**: Uses localStorage for saving favorites and theme preference
5. **URL Sharing**: Encodes gradient parameters in the URL hash

### CSS Features

- CSS Variables for theming
- Responsive design with mobile-first approach
- Custom properties for consistent styling
- Accessibility features (focus states, reduced motion)
- Dark mode support

## 🎯 Use Cases

- **Web Designers**: Create beautiful backgrounds for websites
- **Developers**: Generate CSS gradients without manual calculation
- **Content Creators**: Design visually appealing backgrounds for social media
- **Students**: Learn about CSS gradients through experimentation
- **UI/UX Professionals**: Prototype interface elements with gradients

## 🌓 Theme Support

The application automatically respects your system preference for light or dark mode, but you can also manually toggle between themes using the moon/sun icon in the header.

## 📱 Responsive Design

The interface adapts to different screen sizes:
- Desktop: Two-column layout with controls on the right
- Tablet: Single column layout
- Mobile: Stacked elements with full-width buttons

## 🔧 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

If you encounter any issues or have questions:
1. Check the browser console for error messages
2. Ensure you're using a modern browser
3. Clear your browser cache and try again
4. Submit an issue on GitHub if problems persist

## 🙏 Acknowledgments

- Inspired by popular gradient generators like CSS Gradient and UIGradients
- Color algorithms based on standard HSL to RGB conversion
- UI design principles from modern design systems

---

**Made with ❤️ for designers and developers everywhere**