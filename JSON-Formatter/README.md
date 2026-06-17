# JSON Formatter & Validator

A powerful, easy-to-use online tool for formatting, validating, and minifying JSON data. This tool runs entirely in your browser with no server-side processing, ensuring your data privacy and security.

## Features

- **JSON Formatting**: Beautify your JSON with proper indentation and line breaks
- **JSON Minification**: Compress JSON by removing unnecessary whitespace
- **Real-time Validation**: Instant validation with detailed error messages
- **Syntax Highlighting**: Visual enhancement for better readability
- **Dark/Light Theme**: Toggle between themes based on your preference
- **Statistics Panel**: View detailed information about your JSON structure
- **Export Options**: Copy to clipboard or download as a .json file
- **Keyboard Shortcuts**: Speed up your workflow with handy shortcuts
- **Offline Support**: Works even without an internet connection
- **Responsive Design**: Fully functional on desktop and mobile devices

## How to Use

1. **Paste JSON**: Enter your JSON data in the editor panel
2. **Automatic Validation**: The tool validates your JSON in real-time
3. **Format/Minify**: Use the buttons to format or compress your JSON
4. **Copy/Download**: Easily copy to clipboard or download as a file

### Keyboard Shortcuts

- `Ctrl/Cmd + Enter`: Format JSON
- `Ctrl/Cmd + M`: Minify JSON
- `Ctrl/Cmd + S`: Download JSON
- `Ctrl/Cmd + Shift + C`: Copy to clipboard
- `Ctrl/Cmd + D`: Toggle dark/light theme

## Technical Details

### Core Functionality

- **Validation**: Uses JavaScript's native `JSON.parse()` for validation
- **Formatting**: Implements `JSON.stringify()` with custom indentation
- **Minification**: Removes all unnecessary whitespace with `JSON.stringify()`
- **Statistics**: Analyzes JSON structure to count objects and arrays
- **Persistence**: Saves your work in browser's localStorage

### UI Components

- **JSON Editor**: Main text area with syntax highlighting
- **Statistics Panel**: Displays size, lines, objects, and arrays count
- **Action Buttons**: Format, minify, copy, download, and clear functions
- **Theme Toggle**: Switch between light and dark modes
- **FAQ Section**: Helpful information about JSON and the tool

### Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Custom properties for theming, flexbox, and grid layouts
- **JavaScript**: Core functionality and DOM manipulation
- **Prism.js**: Syntax highlighting (CDN loaded)
- **LocalStorage**: Data persistence across sessions

## Privacy & Security

- **Client-side Processing**: All operations happen in your browser
- **No Server Communication**: Your JSON data never leaves your device
- **No Data Storage**: We don't store or log any of your data
- **Secure**: Perfect for sensitive or confidential JSON data

## Browser Support

This tool works on all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Installation

This is a static web application that can be run directly in any modern browser:

1. Clone or download this repository
2. Open `index.html` in your browser
3. Start formatting JSON immediately

No build process or dependencies required!

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have suggestions for improvement, please open an issue on this repository.