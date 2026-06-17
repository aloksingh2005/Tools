// Array of available AI models through OpenRouter.ai
const availableModels = [
    {
        id: 'anthropic/claude-3-haiku',
        name: 'Claude 3 Haiku',
        avatar: 'fa-robot',
        description: 'Fast and affordable model for tasks like chat, text processing, and reasoning',
        maxTokens: 200000,
        provider: 'openrouter'
    },
    {
        id: 'anthropic/claude-3-sonnet',
        name: 'Claude 3 Sonnet',
        avatar: 'fa-robot',
        description: 'High-performance model balancing intelligence and speed',
        maxTokens: 200000,
        provider: 'openrouter'
    },
    {
        id: 'anthropic/claude-3-opus',
        name: 'Claude 3 Opus',
        avatar: 'fa-robot',
        description: 'Most intelligent Claude model for complex tasks',
        maxTokens: 100000,
        requiresApiKey: true,
        contextLimit: 2000,
        specialHandling: true,
        provider: 'openrouter'
    },
    {
        id: 'google/gemini-pro',
        name: 'Gemini Pro',
        avatar: 'fa-comment-dots',
        description: 'Google\'s advanced model for diverse text tasks',
        maxTokens: 30000,
        provider: 'gemini'
    },
    {
        id: 'meta-llama/llama-3-70b-instruct',
        name: 'Llama 3 70B',
        avatar: 'fa-comment-alt',
        description: 'Meta\'s powerful open model for high-quality responses',
        maxTokens: 8000,
        provider: 'openrouter'
    },
    {
        id: 'meta-llama/llama-3-8b-instruct',
        name: 'Llama 3 8B',
        avatar: 'fa-comment-alt',
        description: 'Compact, efficient version of Llama 3 for everyday tasks',
        maxTokens: 8000,
        provider: 'openrouter'
    },
    {
        id: 'mistralai/mistral-large',
        name: 'Mistral Large',
        avatar: 'fa-wind',
        description: 'Powerful general-purpose model with strong reasoning capabilities',
        maxTokens: 32000,
        provider: 'openrouter'
    },
    {
        id: 'openai/gpt-4o',
        name: 'GPT-4o',
        avatar: 'fa-brain',
        description: 'OpenAI\'s most advanced model with broad capabilities',
        maxTokens: 128000,
        provider: 'openrouter'
    },
    {
        id: 'deepseek-coder',
        name: 'DeepSeek Coder',
        avatar: 'fa-code',
        description: 'Specialized model for coding tasks and programming assistance',
        maxTokens: 8000,
        provider: 'deepseek'
    },
    {
        id: 'huggingface-image',
        name: 'Image Generation',
        avatar: 'fa-image',
        description: 'Create images from text descriptions using Hugging Face models',
        maxTokens: 1000,
        provider: 'huggingface',
        isImageGenerator: true,
        defaultProvider: true
    },
    {
        id: 'grok-ai',
        name: 'Grok AI',
        avatar: 'fa-bolt',
        description: 'Experimental AI with advanced reasoning capabilities',
        maxTokens: 4000,
        provider: 'grok'
    }
];

// Get OpenRouter API key from localStorage
const apiKey = localStorage.getItem('openrouter_api_key') || '';
window.OPENROUTER_API_KEY = apiKey; // Make sure it's available globally

const providerDetails = {
    openrouter: {
        name: 'OpenRouter',
        avatar: 'fa-network-wired',
        description: 'Claude, GPT, Llama, Mistral and more via one provider'
    },
    gemini: {
        name: 'Google Gemini',
        avatar: 'fa-star',
        description: 'Native Gemini models via Google AI Studio key'
    },
    deepseek: {
        name: 'DeepSeek',
        avatar: 'fa-brain',
        description: 'Coding-focused DeepSeek model family'
    },
    huggingface: {
        name: 'Hugging Face',
        avatar: 'fa-image',
        description: 'Image generation and open models'
    },
    grok: {
        name: 'Grok',
        avatar: 'fa-bolt',
        description: 'xAI Grok model access'
    }
};

// Currently selected model/provider
let currentModel = null;
let currentProviderFilter = null;

// Function to initialize the models grid
function initializeModelsGrid() {
    renderProviderGrid();
}

function getHomeScreenHeading() {
    return document.querySelector('.home-screen h2');
}

function renderProviderGrid() {
    currentProviderFilter = null;

    const modelsGrid = document.getElementById('models-grid');
    const heading = getHomeScreenHeading();
    modelsGrid.innerHTML = '';
    if (heading) {
        heading.textContent = 'Select an AI Provider';
    }

    const providers = Object.keys(providerDetails).filter(providerId =>
        availableModels.some(model => model.provider === providerId)
    );

    providers.forEach(providerId => {
        const provider = providerDetails[providerId] || {
            name: providerId,
            avatar: 'fa-robot',
            description: 'Available models'
        };

        const providerCard = document.createElement('div');
        providerCard.className = 'model-card';
        providerCard.dataset.providerId = providerId;

        providerCard.innerHTML = `
            <div class="model-avatar">
                <i class="fas ${provider.avatar}"></i>
            </div>
            <h3>${provider.name}</h3>
            <p>${provider.description}</p>
        `;

        providerCard.addEventListener('click', () => {
            renderProviderModels(providerId);
        });

        modelsGrid.appendChild(providerCard);
    });
}

function renderProviderModels(providerId) {
    currentProviderFilter = providerId;

    const modelsGrid = document.getElementById('models-grid');
    const heading = getHomeScreenHeading();
    modelsGrid.innerHTML = '';

    const provider = providerDetails[providerId] || { name: providerId };
    if (heading) {
        heading.textContent = `Select ${provider.name} Model`;
    }

    const backCard = document.createElement('div');
    backCard.className = 'model-card';
    backCard.innerHTML = `
        <div class="model-avatar">
            <i class="fas fa-arrow-left"></i>
        </div>
        <h3>Back</h3>
        <p>Go back to providers</p>
    `;
    backCard.addEventListener('click', renderProviderGrid);
    modelsGrid.appendChild(backCard);

    const providerModels = availableModels.filter(model => model.provider === providerId);

    providerModels.forEach(model => {
        const modelCard = document.createElement('div');
        modelCard.className = 'model-card';
        modelCard.dataset.modelId = model.id;

        if (model.isImageGenerator) {
            modelCard.classList.add('image-generator-card');
        }

        modelCard.innerHTML = `
            <div class="model-avatar">
                <i class="fas ${model.avatar}"></i>
            </div>
            <h3>${model.name}</h3>
            <p>${model.description}</p>
        `;

        modelCard.addEventListener('click', () => {
            selectModel(model);
        });

        modelsGrid.appendChild(modelCard);
    });
}

// Function to select a model and switch to chat view
function selectModel(model) {
    // First check if this is the image generation model
    if (model.isImageGenerator && model.provider === 'huggingface') {
        // Always use the stored Hugging Face API key
        const storedKeys = JSON.parse(localStorage.getItem('stored_api_keys') || '[]');
        const huggingFaceKey = storedKeys.find(k => 
            k.provider === 'huggingface' || 
            k.name.toLowerCase().includes('hugging') || 
            k.name.toLowerCase().includes('face')
        );
        
        if (huggingFaceKey) {
            // Set the Hugging Face key
            window.HUGGINGFACE_API_KEY = huggingFaceKey.key;
            localStorage.setItem('huggingface_api_key', huggingFaceKey.key);
            showToast(`Using ${huggingFaceKey.name} for image generation`);
        } else {
            showToast('No Hugging Face API key found. Please add one in settings.');
            storeApiKey(); // Show the API key storage dialog
            return;
        }
    }
    
    // Directly load chat with the selected model without showing API key selector
    loadChatWithSelectedModel(model);
}

// Function to load chat with selected model
function loadChatWithSelectedModel(model) {
    currentModel = model;
    
    // Set appropriate API key based on model provider/model-specific assignment
    const apiKey = window.resolveProviderApiKey
        ? window.resolveProviderApiKey(model.provider, model.id)
        : '';
    
    // If no API key is found, prompt the user to add one
    if (!apiKey) {
        showToast('API key not found. Please add an API key in settings.');
        storeApiKey();
        return;
    }
    
    // Hide home screen and show chat screen
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('chat-screen').style.display = 'flex';
    
    // Set the current model name in the UI
    document.getElementById('current-model-name').textContent = model.name;
    
    // Load previous messages for this model
    currentConversation = loadChatHistory(model.id) || [];
    
    // Display previous messages
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    
    currentConversation.forEach((msg, index) => {
        addMessageToChat(msg.role, msg.content, index);
    });
    
    // Highlight the current conversation in the sidebar
    highlightCurrentConversation(model.id);
    
    // Clear the input field
    document.getElementById('message-input').value = '';
    document.getElementById('message-input').focus();
}

// Function to highlight the current conversation in the sidebar
function highlightCurrentConversation(modelId) {
    // Remove active class from all conversation items
    const conversationItems = document.querySelectorAll('#conversation-history li');
    conversationItems.forEach(item => {
        item.classList.remove('active-conversation');
    });
    
    // Add active class to the selected model's conversation
    const selectedItem = document.querySelector(`#conversation-history li[data-model-id="${modelId}"]`);
    if (selectedItem) {
        selectedItem.classList.add('active-conversation');
    }
}

// Load chat history for a specific model from localStorage
function loadChatHistory(modelId) {
    const conversationKey = `chat_${modelId}`;
    const savedMessages = localStorage.getItem(conversationKey);
    
    if (savedMessages) {
        try {
            const messages = JSON.parse(savedMessages);
            if (Array.isArray(messages) && messages.length > 0) {
                return messages;
            }
        } catch (e) {
            console.error('Error parsing saved chat history:', e);
        }
    }
    
    // If no history or invalid format, return a default welcome message
    return [{
        role: 'assistant',
        content: `Hi there 👋\nHow can I help you today?`
    }];
}

// Function to go back to model selection
function backToModelSelection() {
    document.getElementById('chat-screen').style.display = 'none';
    document.getElementById('home-screen').style.display = 'block';
    
    // Remove highlighting from current conversation before clearing the model
    if (currentModel) {
        const conversationItems = document.querySelectorAll('#conversation-history li');
        conversationItems.forEach(item => {
            item.classList.remove('active-conversation');
        });
    }

    if (currentProviderFilter) {
        renderProviderModels(currentProviderFilter);
    } else {
        renderProviderGrid();
    }
    
    currentModel = null;
}

// Update conversation history in the sidebar
function updateConversationHistory() {
    // This function is now replaced by the folder tree system
    // But we still need to update folders with new conversations
    
    const keys = Object.keys(localStorage).filter(key => key.startsWith('chat_'));
    const folders = window.conversationFolders || [];
    
    // Add new conversations to uncategorized folder if not already in any folder
    keys.forEach(key => {
        const modelId = key.replace('chat_', '');
        const isInFolder = folders.some(f => f.conversations && f.conversations.includes(modelId));
        
        if (!isInFolder) {
            const uncategorized = folders.find(f => f.isDefault);
            if (uncategorized) {
                if (!uncategorized.conversations) uncategorized.conversations = [];
                uncategorized.conversations.push(modelId);
            }
        }
    });
    
    // Save updated folders
    if (typeof saveFolders === 'function') {
        saveFolders();
    }
    
    // Render folder tree
    if (typeof renderFolderTree === 'function') {
        renderFolderTree();
    }
} 