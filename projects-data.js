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
        name: "Markdown Editor",
        category: "Developer Tools",
        description: "A modern, feature-rich online Markdown editor with live preview capabilities. Write, edit, and export Markdown documents with a clean and intuitive interface.",
        tags: ["JavaScript", "Markdown", "Editor"],
        repo: "https://github.com/aloksingh2005/Markdown-Editor",
        demo: "https://aloksingh2005.github.io/Markdown-Editor/",
        stars: 52,
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
        name: "Password Generator",
        category: "Productivity & Utilities",
        description: "A feature-rich, secure, and privacy-focused password generator and strength checker tool built with vanilla JavaScript. All processing happens locally in your browser - no data is transmitted to any server.",
        tags: ["JavaScript", "Security", "Generator"],
        repo: "https://github.com/aloksingh2005/Password-Generator",
        demo: "https://aloksingh2005.github.io/Password-Generator/",
        stars: 41,
        language: "JavaScript"
    },
    {
        name: "Random Username Generator",
        category: "Productivity & Utilities",
        description: "A powerful, privacy-focused tool for generating secure usernames and passwords with a beautiful, modern interface.",
        tags: ["JavaScript", "Generator", "Usernames"],
        repo: "https://github.com/aloksingh2005/Random-Username",
        demo: "https://aloksingh2005.github.io/Random-Username/",
        stars: 19,
        language: "JavaScript"
    },
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
        name: "BMI Calculator",
        category: "Productivity & Utilities",
        description: "Advanced BMI Calculator",
        tags: ["JavaScript", "Health", "Calculator"],
        repo: "https://github.com/aloksingh2005/BMI-Calculator",
        demo: "https://aloksingh2005.github.io/BMI-Calculator/",
        stars: 24,
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
        name: "Text Conversion",
        category: "Productivity & Utilities",
        description: "A comprehensive, client-side text conversion tool that supports multiple encoding formats including Binary, Base64, Morse Code, ASCII, Hexadecimal, and fun Emoji encoding!",
        tags: ["JavaScript", "Text Processing", "Encoding"],
        repo: "https://github.com/aloksingh2005/Text-Conversion",
        demo: "https://aloksingh2005.github.io/Text-Conversion/",
        stars: 35,
        language: "JavaScript"
    },
    {
        name: "Cash Counting",
        category: "Productivity & Utilities",
        description: "A modern, feature-rich cash counting application built with HTML, CSS, and JavaScript. Perfect for businesses, shops, and individuals who need to count cash quickly and accurately.",
        tags: ["JavaScript", "Finance", "Calculator"],
        repo: "https://github.com/aloksingh2005/Cash-Counting",
        demo: "https://aloksingh2005.github.io/Cash-Counting/",
        stars: 29,
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
    {
        name: "Universal Converter",
        category: "All-In-One Projects",
        description: "A comprehensive, offline file format converter that supports PDF tools, document conversion, image conversion, media conversion, archive conversion, and data conversion.",
        tags: ["Python", "Conversion", "Multi-format"],
        repo: "https://github.com/aloksingh2005/Universal-Converter",
        demo: "https://aloksingh2005.github.io/Universal-Converter/",
        featured: true,
        pinned: true,
        stars: 198,
        language: "Python"
    },
    {
        name: "All-In-One App",
        category: "All-In-One Projects",
        description: "A comprehensive web-based application that combines 28 different tools in a single interface. This application provides utilities, media tools, communication tools, and sensor-based tools all in one place.",
        tags: ["JavaScript", "Multi-tool", "Utilities"],
        repo: "https://github.com/aloksingh2005/All-In-One-App",
        demo: "https://aloksingh2005.github.io/All-In-One-App/",
        featured: true,
        stars: 234,
        language: "JavaScript"
    },
    
    // PDF Tools
    {
        name: "PDF Tool",
        category: "Developer Tools",
        description: "A comprehensive suite of browser-based PDF manipulation tools that allow you to convert, edit, protect, and optimize PDF documents. All processing happens locally in your browser - your files never leave your computer!",
        tags: ["JavaScript", "PDF", "Document Processing"],
        repo: "https://github.com/aloksingh2005/pdf-tool",
        demo: "https://aloksingh2005.github.io/pdf-tool/",
        pinned: true,
        featured: true,
        stars: 112,
        language: "JavaScript"
    },
    
    // Authentication Tools
    {
        name: "Login Signup",
        category: "Productivity & Utilities",
        description: "A responsive and feature-rich authentication system with login and signup forms, built with HTML, CSS, and JavaScript.",
        tags: ["JavaScript", "Authentication", "Security"],
        repo: "https://github.com/aloksingh2005/Login-Signup",
        demo: "https://aloksingh2005.github.io/Login-Signup/",
        stars: 42,
        language: "JavaScript"
    },
    
    // Time Tools
    {
        name: "Time Tools",
        category: "Productivity & Utilities",
        description: "A comprehensive web-based time management application featuring a stopwatch, countdown timer, and digital clock in one convenient tool. Built with modern web technologies and designed for both desktop and mobile use.",
        tags: ["JavaScript", "Time Management", "Productivity"],
        repo: "https://github.com/aloksingh2005/Time-Tools",
        demo: "https://aloksingh2005.github.io/Time-Tools/",
        stars: 38,
        language: "JavaScript"
    },
    
    // Exam Tools
    {
        name: "Exam Buddy",
        category: "Productivity & Utilities",
        description: "A Telegram bot designed to help Bihar Board Class 10 students access study materials, previous year papers, and practice quizzes in a single, organized platform.",
        tags: ["Python", "Telegram Bot", "Education"],
        repo: "https://github.com/aloksingh2005/Exam-Buddy",
        demo: "https://aloksingh2005.github.io/Exam-Buddy/",
        stars: 29,
        language: "Python"
    },
    
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
    }
];