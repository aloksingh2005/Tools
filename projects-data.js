const projectsData = [
    // Developer Tools
    {
        name: "JSON Formatter",
        category: "Developer Tools",
        description: "A powerful, easy-to-use online tool for formatting, validating, and minifying JSON data. This tool runs entirely in your browser with no server-side processing, ensuring your data privacy and security.",
        tags: ["JavaScript", "JSON", "Formatter"],
        demo: "https://aloksingh2005.github.io/JSON-Formatter/",
        pinned: true,
        stars: 38,
        language: "JavaScript"
    },
    {
        name: "TempMail",
        category: "Developer Tools",
        description: "A secure and lightweight temporary email service that lets users generate disposable email addresses instantly for OTPs, testing, signups, and privacy protection. Fast, clean, and easy to use with real-time inbox support.",
        tags: ["JavaScript", "Temp Mail", "Email"],
        demo: "https://aloksingh2005.github.io/TempMail/",
        pinned: true,
        stars: 38,
        language: "JavaScript"
    },
    {
        name: "Text Processing Suite",
        category: "Developer Tools",
        description: "A powerful, browser-based text processing tool that provides real-time statistics and various text manipulation features. All processing happens locally in your browser - no data is sent to any server.",
        tags: ["JavaScript", "Text Processing", "Utilities"],
        demo: "https://aloksingh2005.github.io/Text-Processing-Suite/",
        stars: 29,
        language: "JavaScript"
    },
    {
        name: "Font Preview",
        category: "Developer Tools",
        description: "The Font Preview Tool is a web-based application that allows users to preview and test Google Fonts instantly. Users can type custom text and see it rendered in various Google Fonts with real-time customization options for font size, text color, and background color. The tool also provides functionality to copy CSS code for implementing fonts in projects and export font previews as images.",
        tags: ["CSS", "Fonts", "Design"],
        demo: "https://aloksingh2005.github.io/Font-Preview/",
        stars: 33,
        language: "CSS"
    },
    {
        name: "Color Palette Generator",
        category: "Developer Tools",
        description: "A powerful, browser-based tool for generating color palettes, CSS gradients, and accessibility checking. This application helps designers and developers create beautiful color schemes and gradients for their projects.",
        tags: ["JavaScript", "CSS", "Colors"],
        demo: "https://aloksingh2005.github.io/Color-Palette-Gradient/",
        pinned: true,
        stars: 67,
        language: "JavaScript"
    },

    // Productivity & Utilities
    {
        name: "SnapShare",
        category: "Productivity",
        description: "A secure temporary file sharing platform with password protection, auto-expiry, one-time viewing, and download restrictions built using Express, Vite, and TypeScript.",
        tags: ["TypeScript", "Express", "Vite", "File Sharing", "Security"],
        demo: "https://snapshare-i9u7.onrender.com/",
        pinned: true,
        featured: true,
        stars: 50,
        language: "TypeScript"
    },
    {
        name: "Word Counter",
        category: "Productivity & Utilities",
        description: "A feature-rich, client-side word counter application that provides real-time text analysis with a clean, responsive interface. This tool helps writers, students, and content creators quickly analyze their text with essential statistics.",
        tags: ["JavaScript", "Text Analysis", "Counter"],
        demo: "https://aloksingh2005.github.io/Word-Counter/",
        stars: 22,
        language: "JavaScript"
    },
    {
        name: "Age Calculator",
        category: "Productivity & Utilities",
        description: "Age Calculator Pro",
        tags: ["JavaScript", "Date", "Calculator"],
        demo: "https://aloksingh2005.github.io/Age-Calculator/",
        stars: 28,
        language: "JavaScript"
    },
    {
        name: "Todo App",
        category: "Productivity & Utilities",
        description: "A modern, feature-rich todo list application with a clean interface. Manage your daily tasks efficiently with categories, priority levels, and local storage.",
        tags: ["JavaScript", "Task Management", "Productivity"],
        demo: "https://aloksingh2005.github.io/Promptly/",
        stars: 36,
        language: "JavaScript"
    },

    // Games & Fun
    {
        name: "Number Counting",
        category: "Games & Fun",
        description: "A fun and interactive number counting application perfect for learning and practicing number skills.",
        tags: ["JavaScript", "Educational", "Interactive"],
        demo: "https://aloksingh2005.github.io/Number-Count/",
        stars: 15,
        language: "JavaScript"
    },

    // Media Tools
    {
        name: "Image Compressor",
        category: "Media Tools",
        description: "A modern, client-side image compression tool that allows users to compress images without uploading them to any server. All processing happens directly in the browser for maximum privacy and security.",
        tags: ["JavaScript", "Image Processing", "Compression"],
        demo: "https://aloksingh2005.github.io/Image-Compressor/",
        featured: true,
        stars: 89,
        language: "JavaScript"
    },
    {
        name: "Image Converter",
        category: "Media Tools",
        description: "A powerful, browser-based image conversion tool that allows users to convert images between multiple formats (PNG, JPG, WebP, AVIF) with customizable quality settings.",
        tags: ["JavaScript", "Image Processing", "Converter"],
        demo: "https://aloksingh2005.github.io/Image-Converter/",
        stars: 56,
        language: "JavaScript"
    },
    {
        name: "Image to Text OCR",
        category: "Media Tools",
        description: "This is a web-based application that converts images containing text into editable text format. It uses OCR (Optical Character Recognition) technology powered by Tesseract.js to extract text from uploaded images. The application provides a clean, modern UI with drag-and-drop functionality for easy image uploading.",
        tags: ["JavaScript", "OCR", "AI"],
        demo: "https://aloksingh2005.github.io/Image-To-Text/",
        pinned: true,
        stars: 73,
        language: "JavaScript"
    },
    {
        name: "Image Editor",
        category: "Media Tools",
        description: "A comprehensive web-based image editing tool that allows users to resize, rotate, crop, apply filters, and add text overlays to images. Built with HTML, CSS, and JavaScript using the Canvas API and Cropper.js library.",
        tags: ["JavaScript", "Image Processing", "Editing"],
        demo: "https://aloksingh2005.github.io/Image-Editor/",
        stars: 65,
        language: "JavaScript"
    },
    {
        name: "Thumbnail Downloader",
        category: "Media Tools",
        description: "A powerful, client-side YouTube thumbnail downloader that allows users to extract and download thumbnails from any YouTube video in multiple resolutions without requiring any server-side processing",
        tags: ["JavaScript", "YouTube API", "Downloader"],
        demo: "https://aloksingh2005.github.io/Thumbnail-Downloader/",
        stars: 55,
        language: "JavaScript"
    },
    {
        name: "YouTube Downloader",
        category: "Media Tools",
        description: "Ultimate YouTube Downloader (GUI)",
        tags: ["Python", "YouTube API", "Downloader"],
        demo: "https://aloksingh2005.github.io/Yt_Downloader/",
        featured: true,
        stars: 124,
        language: "Python"
    },
    {
        name: "BG Remove",
        category: "Media Tools",
        description: "BG-Remove (Background Remover)",
        tags: ["JavaScript", "Image Processing", "AI"],
        demo: "https://aloksingh2005.github.io/BG-Remove/",
        stars: 72,
        language: "JavaScript"
    },

    // AI & Chatbots
    {
        name: "AI ChatBot",
        category: "AI & Chatbots",
        description: "A modern web application for chatting with various AI models using the OpenRouter.ai API. The app allows users to select from multiple AI models and maintains chat history for each model.",
        tags: ["Python", "AI", "NLP"],
        demo: "https://aloksingh2005.github.io/AI-ChatBot/",
        featured: true,
        pinned: true,
        stars: 156,
        language: "Python"
    },
    {
        name: "Global ChatBot",
        category: "AI & Chatbots",
        description: "A modern mobile-friendly chat application with beautiful UI and user authentication.",
        tags: ["JavaScript", "AI", "Translation"],
        demo: "https://aloksingh2005.github.io/Global-ChatBot/",
        stars: 87,
        language: "JavaScript"
    },

    // All-In-One Projects
    // PDF Tools
    {
        name: "PDF Tool",
        category: "Developer Tools",
        description: "A comprehensive suite of browser-based PDF manipulation tools that allow you to convert, edit, protect, and optimize PDF documents. All processing happens locally in your browser - your files never leave your computer!",
        tags: ["JavaScript", "PDF", "Document Processing"],
        demo: "https://aloksingh2005.github.io/PDF-Tools/",
        pinned: true,
        featured: true,
        stars: 112,
        language: "JavaScript"
    },


    // Gradient Tools
    {
        name: "Gradient Generator",
        category: "Developer Tools",
        description: "A powerful, feature-rich CSS gradient generator that allows you to create beautiful linear and radial gradients with an intuitive UI. Export your gradients as CSS, download as PNG, or save your favorites for later use.",
        tags: ["JavaScript", "CSS", "Design"],
        demo: "https://aloksingh2005.github.io/Gradient-Generator/",
        stars: 47,
        language: "JavaScript"
    },

    // Dairy Management
    {
        name: "Dairy Management",
        category: "Finance & Business",
        description: "The Milk Account Calculator is a web-based application designed to help dairy farmers and customers calculate their milk delivery accounts. It allows users to track delivery schedules, account for missed deliveries, calculate total quantities and costs, and generate reports for specific date ranges. The application is particularly useful for dairy farmers tracking customer deliveries and customers monitoring their milk consumption and costs.",
        tags: ["JavaScript", "Agriculture", "Finance"],
        demo: "https://aloksingh2005.github.io/Dairy-Management/",
        stars: 33,
        language: "JavaScript"
    },

    {
        name: "TimeBook",
        category: "Finance & Business",
        description: "A modern time tracking and work management application designed for freelancers, developers, and teams to track hours, manage productivity, analyze work patterns, and monitor earnings with a clean and responsive interface.",
        tags: ["JavaScript", "Productivity", "Time Tracking"],
        demo: "https://aloksingh2005.github.io/TimeBook/",
        stars: 33,
        language: "JavaScript"
    },

];
