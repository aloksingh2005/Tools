const projectsData = [
    // Developer Tools
    {
        name: "Regex Tester",
        category: "Developer Tools",
        description: "A powerful, feature-rich online regular expression tester and validator with a clean, modern interface. Test your regex patterns against text strings, visualize matches, extract groups, and analyze performance - all in real-time.",
        tags: ["JavaScript", "RegExp", "Web Tools"],
        repo: "https://github.com/aloksingh2005/Regex-Tester",
        demo: "https://aloksingh2005.github.io/Regex-Tester/",
        pinned: true,
        featured: true,
        stars: 45,
        language: "JavaScript"
    },
    {
        name: "JSON Formatter",
        category: "Developer Tools",
        description: "A powerful, easy-to-use online tool for formatting, validating, and minifying JSON data. This tool runs entirely in your browser with no server-side processing, ensuring your data privacy and security.",
        tags: ["JavaScript", "JSON", "Formatter"],
        repo: "https://github.com/aloksingh2005/JSON-Formatter",
        demo: "https://aloksingh2005.github.io/JSON-Formatter/",
        pinned: true,
        stars: 38,
        language: "JavaScript"
    },
    {
        name: "Text Processing Suite",
        category: "Developer Tools",
        description: "A powerful, browser-based text processing tool that provides real-time statistics and various text manipulation features. All processing happens locally in your browser - no data is sent to any server.",
        tags: ["JavaScript", "Text Processing", "Utilities"],
        repo: "https://github.com/aloksingh2005/Text-Processing-Suite",
        demo: "https://aloksingh2005.github.io/Text-Processing-Suite/",
        stars: 29,
        language: "JavaScript"
    },
    {
        name: "Font Preview",
        category: "Developer Tools",
        description: "The Font Preview Tool is a web-based application that allows users to preview and test Google Fonts instantly. Users can type custom text and see it rendered in various Google Fonts with real-time customization options for font size, text color, and background color. The tool also provides functionality to copy CSS code for implementing fonts in projects and export font previews as images.",
        tags: ["CSS", "Fonts", "Design"],
        repo: "https://github.com/aloksingh2005/Font-Preview",
        demo: "https://aloksingh2005.github.io/Font-Preview/",
        stars: 33,
        language: "CSS"
    },
    {
        name: "Color Palette Generator",
        category: "Developer Tools",
        description: "A powerful, browser-based tool for generating color palettes, CSS gradients, and accessibility checking. This application helps designers and developers create beautiful color schemes and gradients for their projects.",
        tags: ["JavaScript", "CSS", "Colors"],
        repo: "https://github.com/aloksingh2005/Color-Palette-Gradient",
        demo: "https://aloksingh2005.github.io/Color-Palette-Gradient/",
        pinned: true,
        stars: 67,
        language: "JavaScript"
    },

    // Productivity & Utilities
    {
        name: "Word Counter",
        category: "Productivity & Utilities",
        description: "A feature-rich, client-side word counter application that provides real-time text analysis with a clean, responsive interface. This tool helps writers, students, and content creators quickly analyze their text with essential statistics.",
        tags: ["JavaScript", "Text Analysis", "Counter"],
        repo: "https://github.com/aloksingh2005/Word-Counter",
        demo: "https://aloksingh2005.github.io/Word-Counter/",
        stars: 22,
        language: "JavaScript"
    },
    {
        name: "Age Calculator",
        category: "Productivity & Utilities",
        description: "Age Calculator Pro",
        tags: ["JavaScript", "Date", "Calculator"],
        repo: "https://github.com/aloksingh2005/Age-Calculator",
        demo: "https://aloksingh2005.github.io/Age-Calculator/",
        stars: 28,
        language: "JavaScript"
    },
    {
        name: "Time Calculator",
        category: "Productivity & Utilities",
        description: "A modern, intuitive time and cost calculation tool for managing customer transactions and billing.",
        tags: ["JavaScript", "Time", "Calculator"],
        repo: "https://github.com/aloksingh2005/Time-Calculator-new",
        demo: "https://aloksingh2005.github.io/Time-Calculator-new/",
        stars: 31,
        language: "JavaScript"
    },
    {
        name: "Todo App",
        category: "Productivity & Utilities",
        description: "A modern, feature-rich todo list application with a clean interface. Manage your daily tasks efficiently with categories, priority levels, and local storage.",
        tags: ["JavaScript", "Task Management", "Productivity"],
        repo: "https://github.com/aloksingh2005/Todo",
        demo: "https://aloksingh2005.github.io/Todo/",
        stars: 36,
        language: "JavaScript"
    },

    // Games & Fun
    {
        name: "Number Counting",
        category: "Games & Fun",
        description: "A fun and interactive number counting application perfect for learning and practicing number skills.",
        tags: ["JavaScript", "Educational", "Interactive"],
        repo: "https://github.com/aloksingh2005/Number-Count",
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
        repo: "https://github.com/aloksingh2005/Image-Compressor",
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
        repo: "https://github.com/aloksingh2005/Image-Converter",
        demo: "https://aloksingh2005.github.io/Image-Converter/",
        stars: 56,
        language: "JavaScript"
    },
    {
        name: "Image to Text OCR",
        category: "Media Tools",
        description: "This is a web-based application that converts images containing text into editable text format. It uses OCR (Optical Character Recognition) technology powered by Tesseract.js to extract text from uploaded images. The application provides a clean, modern UI with drag-and-drop functionality for easy image uploading.",
        tags: ["JavaScript", "OCR", "AI"],
        repo: "https://github.com/aloksingh2005/Image-To-Text",
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
        repo: "https://github.com/aloksingh2005/Image-Editor",
        demo: "https://aloksingh2005.github.io/Image-Editor/",
        stars: 65,
        language: "JavaScript"
    },
    {
        name: "MP4 to MP3 Converter",
        category: "Media Tools",
        description: "A fast, secure, and user-friendly web application for converting MP4 video files to high-quality MP3 audio format.",
        tags: ["JavaScript", "Audio Processing", "Converter"],
        repo: "https://github.com/aloksingh2005/MP4-to-MP3-Converter",
        demo: "https://aloksingh2005.github.io/MP4-to-MP3-Converter/",
        stars: 48,
        language: "JavaScript"
    },
    {
        name: "Audio Joiner",
        category: "Media Tools",
        description: "Audio Joiner - MP3 Merger Web App",
        tags: ["JavaScript", "Audio Processing", "Merger"],
        repo: "https://github.com/aloksingh2005/Audio-Joiner",
        demo: "https://aloksingh2005.github.io/Audio-Joiner/",
        stars: 35,
        language: "JavaScript"
    },
    {
        name: "Video Trimmer Cropper",
        category: "Media Tools",
        description: "A powerful browser-based video editing tool that allows users to trim and crop videos without uploading them to any server. All processing happens locally for maximum privacy.",
        tags: ["JavaScript", "Video Processing", "Editor"],
        repo: "https://github.com/aloksingh2005/Video-Trimmer-Cropper",
        demo: "https://aloksingh2005.github.io/Video-Trimmer-Cropper/",
        stars: 51,
        language: "JavaScript"
    },
    {
        name: "Thumbnail Downloader",
        category: "Media Tools",
        description: "A powerful, client-side YouTube thumbnail downloader that allows users to extract and download thumbnails from any YouTube video in multiple resolutions without requiring any server-side processing",
        tags: ["JavaScript", "YouTube API", "Downloader"],
        repo: "https://github.com/aloksingh2005/Thumbnail-Downloader",
        demo: "https://aloksingh2005.github.io/Thumbnail-Downloader/",
        stars: 55,
        language: "JavaScript"
    },
    {
        name: "YouTube Downloader",
        category: "Media Tools",
        description: "Ultimate YouTube Downloader (GUI)",
        tags: ["Python", "YouTube API", "Downloader"],
        repo: "https://github.com/aloksingh2005/Yt_Downloader",
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
        repo: "https://github.com/aloksingh2005/BG-Remove",
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
        repo: "https://github.com/aloksingh2005/AI-ChatBot",
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
        repo: "https://github.com/aloksingh2005/Global-ChatBot",
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
        repo: "https://github.com/aloksingh2005/PDF-Tools",
        demo: "https://aloksingh2005.github.io/PDF-Tools/",
        pinned: true,
        featured: true,
        stars: 112,
        language: "JavaScript"
    },

    // Exam Tools
    // Removed Exam Buddy as requested

    // Gradient Tools
    {
        name: "Gradient Generator",
        category: "Developer Tools",
        description: "A powerful, feature-rich CSS gradient generator that allows you to create beautiful linear and radial gradients with an intuitive UI. Export your gradients as CSS, download as PNG, or save your favorites for later use.",
        tags: ["JavaScript", "CSS", "Design"],
        repo: "https://github.com/aloksingh2005/Gradient-Generator",
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
        repo: "https://github.com/aloksingh2005/Dairy-Management",
        demo: "https://aloksingh2005.github.io/Dairy-Management/",
        stars: 33,
        language: "JavaScript"
    },

    // Business & Portfolio Websites
    {
        name: "Tools Website",
        category: "Business & Portfolio Websites",
        description: "A comprehensive collection of web-based tools and utilities aggregated in one platform. Features various productivity tools, converters, and utilities for everyday use.",
        tags: ["JavaScript", "Multi-tool", "Web Platform"],
        repo: "https://github.com/aloksingh2005/Tools",
        demo: "https://tools.techsoftechs.com/",
        featured: true,
        stars: 145,
        language: "JavaScript"
    },
    {
        name: "NexCorp",
        category: "Business & Portfolio Websites",
        description: "A modern corporate business website showcasing professional services, portfolio, and company information with a sleek design.",
        tags: ["HTML", "CSS", "Business Website"],
        repo: "https://github.com/aloksingh2005/NexCorp",
        demo: "https://aloksingh2005.github.io/NexCorp/",
        stars: 62,
        language: "HTML"
    },
    {
        name: "ConsultPro",
        category: "Business & Portfolio Websites",
        description: "A professional consulting business website template featuring service offerings, team profiles, and client testimonials with responsive design.",
        tags: ["HTML", "CSS", "Consulting"],
        repo: "https://github.com/aloksingh2005/ConsultPro",
        demo: "https://aloksingh2005.github.io/ConsultPro/",
        stars: 48,
        language: "HTML"
    },
    {
        name: "SR Computer",
        category: "Business & Portfolio Websites",
        description: "A comprehensive website for computer services, repairs, and sales. Features service listings, pricing, and contact information.",
        tags: ["HTML", "CSS", "Service Website"],
        repo: "https://github.com/aloksingh2005/SR-Computer",
        demo: "https://aloksingh2005.github.io/SR-Computer/",
        stars: 39,
        language: "HTML"
    },
    {
        name: "Smart Sky",
        category: "Business & Portfolio Websites",
        description: "A modern weather and sky monitoring website with real-time data visualization and forecasting features.",
        tags: ["JavaScript", "Weather API", "Data Visualization"],
        repo: "https://github.com/aloksingh2005/Smart-Sky",
        demo: "https://aloksingh2005.github.io/Smart-Sky/",
        stars: 71,
        language: "JavaScript"
    },
    {
        name: "Brother's Esports",
        category: "Business & Portfolio Websites",
        description: "A dynamic esports team website featuring team rosters, tournament schedules, match results, and gaming community features.",
        tags: ["HTML", "CSS", "Esports"],
        repo: "https://github.com/aloksingh2005/Brother-s-Esports",
        demo: "https://aloksingh2005.github.io/Brother-s-Esports/",
        stars: 54,
        language: "HTML"
    },
    {
        name: "NovaTech",
        category: "Business & Portfolio Websites",
        description: "A cutting-edge technology company website showcasing innovative tech solutions, products, and services with a futuristic design.",
        tags: ["HTML", "CSS", "Technology"],
        repo: "https://github.com/aloksingh2005/NovaTech",
        demo: "https://aloksingh2005.github.io/NovaTech/",
        stars: 67,
        language: "HTML"
    },
    {
        name: "Digital Empire",
        category: "Business & Portfolio Websites",
        description: "A comprehensive digital marketing agency website featuring services in SEO, social media marketing, and digital strategy.",
        tags: ["HTML", "CSS", "Digital Marketing"],
        repo: "https://github.com/aloksingh2005/Digital-Empire",
        demo: "https://aloksingh2005.github.io/Digital-Empire/",
        stars: 58,
        language: "HTML"
    },
    {
        name: "Code Empire",
        category: "Business & Portfolio Websites",
        description: "A professional software development company website showcasing coding services, development projects, and technical expertise.",
        tags: ["HTML", "CSS", "Software Development"],
        repo: "https://github.com/aloksingh2005/Code-Empire",
        demo: "https://aloksingh2005.github.io/Code-Empire/",
        stars: 76,
        language: "HTML"
    }
];
