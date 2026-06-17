# PDF Tools Collection

A comprehensive suite of 17 browser-based PDF manipulation tools that allow you to convert, edit, protect, and optimize PDF documents. All processing happens locally in your browser - your files never leave your computer!

## Table of Contents
- [Available Tools](#available-tools)
- [How to Use](#how-to-use)
- [Features](#features)
- [Security and Privacy](#security-and-privacy)
- [Technology Stack](#technology-stack)
- [File Structure](#file-structure)
- [License](#license)
- [Support](#support)

## Available Tools

### 🔁 Conversion Tools
- **[Images to PDF](images_to_pdf.html)** - Convert JPG/PNG images to a multi-page PDF document with drag-and-drop support
- **[PDF to Images](pdf_to_image.html)** - Extract pages from PDF files as PNG/JPG images with batch download
- **[Extract Text from PDF](pdf_to_file.html)** - Extract text content from PDF files and save as plain text or Word-compatible RTF
- **[HTML to PDF](html_to_pdf.html)** - Convert HTML content to PDF documents with full CSS styling support

### ✂️ Editing Tools
- **[Merge PDFs](merge_pdfs.html)** - Combine multiple PDF files into a single document with drag-and-drop reordering
- **[Split PDF](split_pdf.html)** - Divide a PDF file into multiple smaller documents by page ranges
- **[Extract Pages](extract_pages.html)** - Select and extract specific pages (including non-consecutive pages) from a PDF
- **[Rearrange Pages](rearrange_pdf.html)** - Reorder pages within a PDF document using an intuitive drag-and-drop interface
- **[Remove Pages](remove_pdf.html)** - Delete specific pages from a PDF document
- **[Rotate PDF](rotate_pdf.html)** - Rotate pages in a PDF document (90°, 180°, 270°)

### 🛡️ Security & Optimization Tools
- **[Add Watermark](add_watermark.html)** - Add text or image watermarks to protect your PDF documents
- **[Compress PDF](compress_pdf.html)** - Reduce the file size of PDF documents while maintaining quality
- **[Unlock PDF](unlock_pdf.html)** - Remove password protection from PDF files you have permission to unlock

### ✨ Advanced Tools
- **[Sign PDF](sign_pdf.html)** - Add your digital signature to PDFs by drawing or typing
- **[Add Page Numbers](add_page_numbers.html)** - Add customizable page numbering with various formats and positions
- **[Edit Metadata](edit_metadata.html)** - Edit PDF document properties (title, author, subject, keywords, dates)
- **[PDF Insights](pdf_info.html)** - Inspect PDF metadata, page dimensions, and useful document statistics

## How to Use

### Running Locally with Python HTTP Server

1. **Prerequisites**: Make sure you have Python installed on your system
2. **Navigate to the project directory**:
   ```bash
   cd path/to/merge_pdf
   ```
3. **Start the HTTP server**:
   ```bash
   python -m http.server 8000
   ```
4. **Open your browser** and go to `http://localhost:8000`
5. **Access tools** through the main index page or directly via individual HTML files

### Alternative Methods

- **Using Node.js** (if installed):
  ```bash
  npx http-server
  ```
- **Using VS Code Live Server**: Right-click on `index.html` and select "Open with Live Server"

## Features

### 🌐 Browser-Based Processing
- No server uploads required
- All operations happen locally in your browser
- Works offline once loaded

### 🖱️ User-Friendly Interface
- Modern, responsive design
- Drag-and-drop file handling
- Real-time previews where applicable
- Intuitive controls and clear feedback

### 🔧 Comprehensive Tool Set
- Covers all essential PDF operations
- Tools work independently or in combination
- Consistent design language across all tools

### ⚡ Performance Optimized
- Efficient file handling
- Minimal loading times
- Optimized for large documents

## Security and Privacy

### 🔒 Zero Data Transfer
- **Files never leave your computer**
- No server-side processing
- No tracking or data collection
- No file storage on external servers

### 🛡️ Client-Side Processing
- All operations executed in your browser
- Uses modern browser security features
- No third-party data sharing

### 🕵️ Privacy First
- No analytics or tracking scripts
- No cookies for user tracking
- No personal data collection

## Technology Stack

### Frontend
- **HTML5** - Structure and content
- **CSS3** - Styling and responsive design
- **JavaScript (ES6+)** - Functionality and interactivity
- **Font Awesome** - Iconography

### Libraries
- **[pdf-lib](https://pdf-lib.js.org/)** - PDF creation and manipulation
- **[PDF.js](https://mozilla.github.io/pdf.js/)** - PDF rendering and text extraction
- **[JSZip](https://stuk.github.io/jszip/)** - ZIP file creation for batch downloads
- **[html2pdf.js](https://github.com/eKoopmans/html2pdf.js)** - HTML to PDF conversion

### Utilities
- **FileSaver.js** - Client-side file saving

## File Structure

```
PDF-Tools/
├── index.html              # Main landing page with all tools
│
├── Conversion Tools:
├── images_to_pdf.html      # Convert images to PDF
├── pdf_to_image.html       # Convert PDF to images
├── pdf_to_file.html        # Extract text from PDF
├── html_to_pdf.html        # Convert HTML to PDF
│
├── Editing Tools:
├── merge_pdfs.html         # Combine multiple PDFs
├── split_pdf.html          # Split PDF into parts
├── extract_pages.html      # Extract specific pages
├── rearrange_pdf.html      # Reorder PDF pages
├── remove_pdf.html         # Delete pages from PDF
├── rotate_pdf.html         # Rotate PDF pages
│
├── Security & Optimization:
├── compress_pdf.html       # Reduce PDF file size
├── add_watermark.html      # Add watermarks to PDF
├── unlock_pdf.html         # Remove PDF password
│
├── Advanced Tools:
├── sign_pdf.html           # Add digital signatures
├── add_page_numbers.html   # Add page numbering
├── edit_metadata.html      # Edit PDF properties
├── pdf_info.html           # Show metadata and document insights
├── premium-theme.css       # Shared premium UI theme
├── premium-ui.js           # Shared UI behavior enhancements
│
└── README.md               # This documentation
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**MIT License Summary**:
- Free for personal and commercial use
- Modify and distribute freely
- Must include original copyright and license notice
- Provided "as is" without warranty

## Support

### 📧 Contact
For questions, suggestions, or issues, please reach out to the project maintainer.

### 🐛 Reporting Issues
If you encounter any problems:
1. Check the browser console for error messages
2. Ensure you're using a modern browser (Chrome, Firefox, Edge, Safari)
3. Verify all files are in the same directory
4. Report issues with detailed steps to reproduce

### 💡 Feature Requests
We welcome suggestions for new tools or improvements to existing ones. Please open an issue with your feature request.

### 🔄 Updates
Regular updates may include:
- Bug fixes
- Performance improvements
- New tools
- UI/UX enhancements

---
*Made with ❤️ for the open-source community*