const projectsData = [{
        name: "Regex Tester",
        category: "Developer Tools",
        description: "Test and debug regex patterns online with real-time validation and match highlighting.",
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
        description: "Format, validate, and beautify JSON data with syntax highlighting and error detection.",
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
        description: "Real-time markdown editor with live preview and export functionality.",
        tags: ["JavaScript", "Markdown", "Editor"],
        repo: "https://github.com/aloksingh2005/Markdown-Editor",
        demo: "https://aloksingh2005.github.io/Markdown-Editor/",
        stars: 52,
        language: "JavaScript"
    },
    {
        name: "Text Processing Suite",
        category: "Developer Tools",
        description: "Comprehensive text manipulation tools including case conversion, formatting, and analysis.",
        tags: ["JavaScript", "Text Processing", "Utilities"],
        repo: "https://github.com/aloksingh2005/Text-Processing-Suite",
        demo: "https://aloksingh2005.github.io/Text-Processing-Suite/",
        stars: 29,
        language: "JavaScript"
    },
    {
        name: "Font Preview",
        category: "Developer Tools",
        description: "Preview and compare different fonts with customizable text samples.",
        tags: ["CSS", "Fonts", "Design"],
        repo: "https://github.com/aloksingh2005/Font-Preview",
        demo: "https://aloksingh2005.github.io/Font-Preview/",
        stars: 33,
        language: "CSS"
    },
    {
        name: "Color Palette Generator",
        category: "Developer Tools",
        description: "Generate beautiful color palettes and gradients for your design projects.",
        tags: ["JavaScript", "CSS", "Colors"],
        repo: "https://github.com/aloksingh2005/Color-Palette-Gradient",
        demo: "https://aloksingh2005.github.io/Color-Palette-Gradient/",
        pinned: true,
        stars: 67,
        language: "JavaScript"
    },
    {
        name: "BMI Calculator",
        category: "Productivity & Utilities",
        description: "Calculate Body Mass Index with metric and imperial units support.",
        tags: ["JavaScript", "Health", "Calculator"],
        repo: "https://github.com/aloksingh2005/BMI-Calculator",
        demo: "https://aloksingh2005.github.io/BMI-Calculator/",
        stars: 24,
        language: "JavaScript"
    },
    {
        name: "Time Calculator",
        category: "Productivity & Utilities",
        description: "Add, subtract, and convert time formats with precision calculations.",
        tags: ["JavaScript", "Time", "Calculator"],
        repo: "https://github.com/aloksingh2005/Time-Calculator",
        demo: "https://aloksingh2005.github.io/Time-Calculator/",
        stars: 31,
        language: "JavaScript"
    },
    {
        name: "Age Calculator",
        category: "Productivity & Utilities",
        description: "Calculate exact age in years, months, days, and more detailed breakdowns.",
        tags: ["JavaScript", "Date", "Calculator"],
        repo: "https://github.com/aloksingh2005/Age-Calculator",
        demo: "https://aloksingh2005.github.io/Age-Calculator/",
        stars: 28,
        language: "JavaScript"
    },
    {
        name: "Password Generator",
        category: "Productivity & Utilities",
        description: "Generate secure passwords with customizable length and character sets.",
        tags: ["JavaScript", "Security", "Generator"],
        repo: "https://github.com/aloksingh2005/Password-Generator",
        demo: "https://aloksingh2005.github.io/Password-Generator/",
        stars: 41,
        language: "JavaScript"
    },
    {
        name: "Random Username Generator",
        category: "Productivity & Utilities",
        description: "Create unique usernames with various themes and customization options.",
        tags: ["JavaScript", "Generator", "Usernames"],
        repo: "https://github.com/aloksingh2005/Random-Username",
        demo: "https://aloksingh2005.github.io/Random-Username/",
        stars: 19,
        language: "JavaScript"
    },
    {
        name: "Word Counter",
        category: "Productivity & Utilities",
        description: "Count words, characters, paragraphs with reading time estimation.",
        tags: ["JavaScript", "Text Analysis", "Counter"],
        repo: "https://github.com/aloksingh2005/Word-Counter",
        demo: "https://aloksingh2005.github.io/Word-Counter/",
        stars: 22,
        language: "JavaScript"
    },
    {
        name: "Image Compressor",
        category: "Media Tools",
        description: "Compress images in browser with quality control and batch processing.",
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
        description: "Convert between image formats (PNG, JPG, WebP) with preview functionality.",
        tags: ["JavaScript", "Image Processing", "Converter"],
        repo: "https://github.com/aloksingh2005/Image-Converter",
        demo: "https://aloksingh2005.github.io/Image-Converter/",
        stars: 56,
        language: "JavaScript"
    },
    {
        name: "Image to Text OCR",
        category: "Media Tools",
        description: "Extract text from images using OCR technology with multiple language support.",
        tags: ["JavaScript", "OCR", "AI"],
        repo: "https://github.com/aloksingh2005/Image-To-Text",
        demo: "https://aloksingh2005.github.io/Image-To-Text/",
        pinned: true,
        stars: 73,
        language: "JavaScript"
    },
    {
        name: "YouTube Downloader",
        category: "Media Tools",
        description: "Download YouTube videos in multiple formats and quality options.",
        tags: ["Python", "YouTube API", "Downloader"],
        repo: "https://github.com/aloksingh2005/Yt_Downloader",
        demo: "https://aloksingh2005.github.io/Yt_Downloader/",
        featured: true,
        stars: 124,
        language: "Python"
    },
    {
        name: "Video Trimmer & Cropper",
        category: "Media Tools",
        description: "Trim and crop videos directly in browser with precise frame control.",
        tags: ["JavaScript", "Video Processing", "WebRTC"],
        repo: "https://github.com/aloksingh2005/Video-Trimmer-Cropper",
        demo: "https://aloksingh2005.github.io/Video-Trimmer-Cropper/",
        stars: 67,
        language: "JavaScript"
    },
    {
        name: "MP4 to MP3 Converter",
        category: "Media Tools",
        description: "Convert video files to audio format with quality selection options.",
        tags: ["JavaScript", "Audio Processing", "Converter"],
        repo: "https://github.com/aloksingh2005/MP4-to-MP3-Converter",
        demo: "https://aloksingh2005.github.io/MP4-to-MP3-Converter/",
        stars: 48,
        language: "JavaScript"
    },
    {
        name: "Audio Joiner",
        category: "Media Tools",
        description: "Merge multiple audio files into a single track with crossfade options.",
        tags: ["JavaScript", "Audio Processing", "Merger"],
        repo: "https://github.com/aloksingh2005/Audio-Joiner",
        demo: "https://aloksingh2005.github.io/Audio-Joiner/",
        stars: 35,
        language: "JavaScript"
    },
    {
        name: "Voice Recorder Online",
        category: "Media Tools",
        description: "Record audio directly in browser with waveform visualization and editing.",
        tags: ["JavaScript", "WebRTC", "Audio"],
        repo: "https://github.com/aloksingh2005/Voice-Recorder-Online",
        demo: "https://aloksingh2005.github.io/Voice-Recorder-Online/",
        stars: 42,
        language: "JavaScript"
    },
    {
        name: "AI ChatBot",
        category: "AI & Chatbots",
        description: "Intelligent chatbot with natural language processing and context awareness.",
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
        description: "Multi-language chatbot with real-time translation capabilities.",
        tags: ["JavaScript", "AI", "Translation"],
        repo: "https://github.com/aloksingh2005/Global-ChatBot",
        demo: "https://aloksingh2005.github.io/Global-ChatBot/",
        stars: 87,
        language: "JavaScript"
    },
    {
        name: "Smart Sky",
        category: "AI & Chatbots",
        description: "Weather prediction AI with natural language interface and smart recommendations.",
        tags: ["Python", "AI", "Weather API"],
        repo: "https://github.com/aloksingh2005/Smart-Sky",
        demo: "https://aloksingh2005.github.io/Smart-Sky/",
        stars: 64,
        language: "Python"
    },
    {
        name: "Cash Counting System",
        category: "Finance & Business",
        description: "Digital cash counting and tracking system with receipt generation.",
        tags: ["Python", "Flask", "Finance"],
        repo: "https://github.com/aloksingh2005/Cash-Counting",
        demo: "https://aloksingh2005.github.io/Cash-Counting/",
        stars: 29,
        language: "Python"
    },
    {
        name: "Cashbez",
        category: "Finance & Business",
        description: "Personal expense tracker with budgeting and financial insights.",
        tags: ["JavaScript", "Finance", "Charts"],
        repo: "https://github.com/aloksingh2005/Cashbez",
        demo: "https://aloksingh2005.github.io/Cashbez/",
        stars: 36,
        language: "JavaScript"
    },
    {
        name: "Enexa Business Suite",
        category: "Finance & Business",
        description: "Complete business management solution with inventory and billing.",
        tags: ["Python", "Django", "Business"],
        repo: "https://github.com/aloksingh2005/Enexa",
        demo: "https://aloksingh2005.github.io/Enexa/",
        featured: true,
        stars: 78,
        language: "Python"
    },
    {
        name: "Milk Management System",
        category: "Finance & Business",
        description: "Dairy farm management with milk production tracking and billing.",
        tags: ["Python", "Flask", "Agriculture"],
        repo: "https://github.com/aloksingh2005/Milk-Management",
        demo: "https://aloksingh2005.github.io/Milk-Management/",
        stars: 23,
        language: "Python"
    },
    {
        name: "Prince Birthday Surprise!",
        category: "Fun & Experiments",
        description: "Collection of browser-based games with leaderboards and achievements.",
        tags: ["JavaScript", "Games", "Canvas"],
        repo: "https://github.com/aloksingh2005/Prince",
        demo: "https://aloksingh2005.github.io/Prince/",
        stars: 41,
        language: "JavaScript"
    },
    {
        name: "Shubham Birthday Surprise!",
        category: "Fun & Experiments",
        description: "Interactive portfolio website with 3D animations and particle effects.",
        tags: ["JavaScript", "Three.js", "Portfolio"],
        repo: "https://github.com/aloksingh2005/Shubham",
        demo: "https://aloksingh2005.github.io/Shubham/",
        stars: 27,
        language: "JavaScript"
    },
    {
        name: "Brother's Esports",
        category: "Fun & Experiments",
        description: "Esports tournament management system with live scoring and brackets.",
        tags: ["JavaScript", "Gaming", "Tournament"],
        repo: "https://github.com/aloksingh2005/Brother-s-Esports",
        demo: "https://aloksingh2005.github.io/Brother-s-Esports/",
        stars: 52,
        language: "JavaScript"
    },
    {
        name: "Exam Buddy",
        category: "Fun & Experiments",
        description: "Study companion with flashcards, quiz generation, and progress tracking.",
        tags: ["JavaScript", "Education", "Quiz"],
        repo: "https://github.com/aloksingh2005/Exam_Buddy",
        demo: "https://aloksingh2005.github.io/Exam_Buddy/",
        stars: 34,
        language: "JavaScript"
    },
    {
        name: "CSC Digital Services",
        category: "Fun & Experiments",
        description: "Common Service Center portal with multiple government service integrations.",
        tags: ["PHP", "Government", "Services"],
        repo: "https://github.com/aloksingh2005/CSC",
        demo: "https://aloksingh2005.github.io/CSC/",
        stars: 18,
        language: "PHP"
    },
    {
        name: "Universal Converter",
        category: "All-In-One Projects",
        description: "Multi-format converter supporting documents, images, audio, and video files.",
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
        description: "Comprehensive utility suite combining tools for productivity, media, and development.",
        tags: ["JavaScript", "Multi-tool", "Utilities"],
        repo: "https://github.com/aloksingh2005/All-In-One-App",
        demo: "https://aloksingh2005.github.io/All-In-One-App/",
        featured: true,
        stars: 234,
        language: "JavaScript"
    }
];