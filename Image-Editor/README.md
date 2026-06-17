# Image Editor

A comprehensive web-based image editing tool that allows users to resize, rotate, crop, apply filters, and add text overlays to images. Built with HTML, CSS, and JavaScript using the Canvas API and Cropper.js library.

## Project Overview

This image editor provides a complete set of tools for basic and advanced image manipulation directly in the browser. Users can upload images, apply various transformations and filters, add text overlays, and download the edited results. The editor features a responsive design with dark mode support and persistent settings using local storage.

## File Structure

```
.
├── index.html      # Main HTML structure and UI elements
├── script.js       # Core functionality and image processing logic
├── style.css       # Styling and layout definitions
└── README.md       # This documentation file
```

### File Descriptions

#### index.html
The main HTML file that defines the structure of the image editor interface. It includes:
- Drag and drop upload area
- Canvas element for image display and manipulation
- Control panels for resizing, rotating, cropping, and downloading
- Filter controls (basic and advanced)
- Text overlay controls
- Layers panel (UI elements)
- External library references (Cropper.js, Font Awesome)

#### script.js
The core JavaScript file containing all the image processing and manipulation logic:
- Image upload and drag & drop handling
- Canvas drawing and manipulation functions
- Image transformations (resize, rotate, crop)
- Filter applications (grayscale, brightness, contrast, etc.)
- Text overlay management with drag functionality
- Preset filters (Vintage, Sepia, Clarendon, etc.)
- Local storage integration for saving settings
- Dark mode toggle functionality

#### style.css
The stylesheet that defines the look and feel of the application:
- Responsive layout using Flexbox
- Dark mode styling
- Control panel and button styling
- Canvas and drag area styling
- Text and filter controls styling
- Layers panel styling

## How to Run

1. Simply open `index.html` in any modern web browser
2. No server required - works completely client-side
3. All data is processed locally in the browser

### Deployment
To deploy this application:
1. Upload all files to a web server
2. Ensure the web server is configured to serve static files
3. Access the application through your browser by navigating to the appropriate URL

## Dependencies

- [Cropper.js](https://github.com/fengyuanchen/cropperjs) - For image cropping functionality
- [Font Awesome](https://fontawesome.com/) - For UI icons

These dependencies are loaded via CDN in the [index.html](file:///c%3A/Users/Alok%20Kumar/Desktop/Personal%20Project/Tools/Image%20Editor/index.html#L8-L13) file.

## Key Features

### Image Manipulation
- **Upload**: Drag & drop or click to upload images
- **Resize**: Custom width and height controls
- **Rotate**: 90-degree increments rotation
- **Crop**: Interactive cropping tool with aspect ratio control
- **Reset**: Revert to original image state

### Filter System
- **Basic Filters**: Grayscale, brightness, and contrast adjustments
- **Advanced Filters**: Blur, sharpen, saturation, hue rotation, warmth, fade, highlights, shadows, grain, and vignette
- **Preset Filters**: One-click professional filters (Vintage, Sepia, Clarendon, Inkwell, Lo-Fi, Toaster, Walden)

### Text Overlays
- Add customizable text with color and size controls
- Drag text to reposition
- Select and delete text overlays

### UI Features
- Dark/light mode toggle with persistent settings
- Responsive layout that works on different screen sizes
- Intuitive control panels organized by function
- Visual feedback for selected text elements

### Data Management
- Local storage for saving edited images and UI preferences
- Direct download of edited images as PNG files

## Code Quality and Structure

### Strengths
1. **Well-organized code**: Functions are grouped logically with clear comments
2. **Modular approach**: Separate functions for different image processing operations
3. **User-friendly interface**: Intuitive controls with visual feedback
4. **Responsive design**: Adapts to different screen sizes
5. **Persistent settings**: Uses localStorage to remember user preferences
6. **Comprehensive feature set**: Covers basic to advanced image editing needs

### Potential Improvements
1. **Layer Implementation**: The layers panel UI is present but not fully implemented in the JavaScript logic
2. **Performance Optimization**: Some filter operations could be optimized for large images
3. **Error Handling**: Could benefit from more robust error handling for edge cases
4. **Accessibility**: Adding ARIA labels and keyboard navigation support
5. **Code Documentation**: While comments exist, more detailed JSDoc-style documentation would improve maintainability
6. **Mobile Support**: Touch event handling could be enhanced for better mobile experience
7. **File Format Support**: Currently limited to image formats supported by the browser's FileReader API

## Browser Compatibility

This application works in all modern browsers that support:
- Canvas API
- FileReader API
- localStorage
- ES6 JavaScript features

Tested in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the [MIT License](LICENSE).