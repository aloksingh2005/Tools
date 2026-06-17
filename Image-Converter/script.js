/**
 * Image Format Converter
 * Simple and fast image format conversion tool
 * © 2026 - All processing happens client-side
 */

document.addEventListener("DOMContentLoaded", () => {
  // ==================== DOM Elements ====================
  const dropArea = document.getElementById("drop-area");
  const fileInput = document.getElementById("file-input");
  const filesList = document.getElementById("files-list");
  const previewContainer = document.getElementById("preview-container");
  const formatSelect = document.getElementById("format-select");
  const qualitySlider = document.getElementById("quality-slider");
  const qualityValue = document.getElementById("quality-value");
  const convertBtn = document.getElementById("convert-btn");
  const clearBtn = document.getElementById("clear-btn");
  const progressBar = document.getElementById("progress-bar");
  const progressContainer = document.getElementById("progress-container");
  const progressText = document.getElementById("progress-text");
  const progressPercentage = document.getElementById("progress-percentage");
  const conversionResults = document.getElementById("conversion-results");
  const downloadAllBtn = document.getElementById("download-all-btn");
  const themeToggle = document.getElementById("theme-toggle");
  const totalFiles = document.getElementById("total-files");
  const totalSaved = document.getElementById("total-saved");

  // ==================== State Variables ====================
  let uploadedFiles = [];
  let convertedFiles = [];

  // ==================== Initialization ====================
  initializeApp();

  function initializeApp() {
    // Load theme preference
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.body.setAttribute("data-theme", savedTheme);

    // Initialize slider values
    updateSliderValue(qualitySlider, qualityValue);

    // Hide optional sections initially
    progressContainer.style.display = "none";
    conversionResults.style.display = "none";

    setupEventListeners();
  }

  // ==================== Event Listeners Setup ====================
  function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener("click", toggleTheme);

    // File upload
    dropArea.addEventListener("click", () => fileInput.click());
    dropArea.addEventListener("dragover", handleDragOver);
    dropArea.addEventListener("dragleave", handleDragLeave);
    dropArea.addEventListener("drop", handleDrop);
    fileInput.addEventListener("change", handleFileSelect);

    // Keyboard accessibility for drop area
    dropArea.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fileInput.click();
      }
    });

    // Quality slider
    qualitySlider.addEventListener("input", () => updateSliderValue(qualitySlider, qualityValue));

    // Format select change
    formatSelect.addEventListener("change", handleFormatChange);

    // Action buttons
    convertBtn.addEventListener("click", startConversion);
    clearBtn.addEventListener("click", clearAll);
    downloadAllBtn.addEventListener("click", downloadAllAsZip);
  }

  // ==================== Theme Management ====================
  function toggleTheme() {
    const currentTheme = document.body.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  }

  // ==================== File Upload Handlers ====================
  function handleDragOver(e) {
    e.preventDefault();
    dropArea.classList.add("active");
  }

  function handleDragLeave() {
    dropArea.classList.remove("active");
  }

  function handleDrop(e) {
    e.preventDefault();
    dropArea.classList.remove("active");
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/') || file.name.match(/\.(heic|heif|jpg|jpeg|png|webp|avif|bmp|gif|tiff)$/i));
    if (files.length > 0) {
      addFiles(files);
    } else {
      showNotification("Please drop valid image files", "error");
    }
  }

  function handleFileSelect() {
    const files = Array.from(fileInput.files).filter(file => file.type.startsWith('image/') || file.name.match(/\.(heic|heif|jpg|jpeg|png|webp|avif|bmp|gif|tiff)$/i));
    if (files.length > 0) {
      addFiles(files);
    }
    fileInput.value = "";
  }

  async function addFiles(files) {
    let addedCount = 0;

    const hasHeic = files.some(f => f.name.match(/\.(heic|heif)$/i));
    if (hasHeic && typeof heic2any !== 'undefined') {
      showNotification("Converting HEIC images to JPEG for editing, please wait...", "info");
    }

    for (const file of files) {
      if (!uploadedFiles.some(f => f.name === file.name && f.size === file.size)) {
        let fileToAdd = file;

        if (file.name.match(/\.(heic|heif)$/i) && typeof heic2any !== 'undefined') {
          try {
            const convertedBlob = await heic2any({
              blob: file,
              toType: "image/jpeg",
              quality: 0.95
            });
            const finalBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
            fileToAdd = new File([finalBlob], file.name.replace(/\.hei[cf]$/i, '.jpg'), {
              type: "image/jpeg",
              lastModified: file.lastModified,
            });
          } catch (err) {
            console.error("HEIC conversion failed:", err);
            showNotification(`Failed to process ${file.name}`, "error");
            continue;
          }
        }

        uploadedFiles.push(fileToAdd);
        displayFileInList(fileToAdd);
        addedCount++;
      }
    }

    if (addedCount > 0) {
      showNotification(`${addedCount} file(s) added successfully`, "success");
    }
  }

  function displayFileInList(file) {
    const fileItem = document.createElement("div");
    fileItem.className = "file-item";
    fileItem.setAttribute("role", "listitem");

    // Create thumbnail
    const thumbnail = document.createElement("img");
    thumbnail.className = "file-thumbnail";
    thumbnail.alt = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      thumbnail.src = e.target.result;
    };
    reader.readAsDataURL(file);

    const fileInfo = document.createElement("div");
    fileInfo.className = "file-info";

    const fileName = document.createElement("div");
    fileName.className = "file-name";
    fileName.textContent = file.name;

    const fileSize = document.createElement("div");
    fileSize.className = "file-size";
    fileSize.textContent = formatFileSize(file.size);

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-file";
    removeBtn.innerHTML = "&times;";
    removeBtn.setAttribute("aria-label", `Remove ${file.name}`);
    removeBtn.addEventListener("click", () => {
      uploadedFiles = uploadedFiles.filter(f => f !== file);
      fileItem.remove();
      showNotification("File removed", "info");
    });

    fileInfo.appendChild(fileName);
    fileInfo.appendChild(fileSize);
    fileItem.appendChild(thumbnail);
    fileItem.appendChild(fileInfo);
    fileItem.appendChild(removeBtn);
    filesList.appendChild(fileItem);
  }

  // ==================== Settings Handlers ====================
  function handleFormatChange() {
    const isLossless = formatSelect.value === 'png' || formatSelect.value === 'bmp';
    const qualityGroup = document.getElementById('quality-group');
    if (qualityGroup) {
      if (isLossless) {
        qualityGroup.style.opacity = '0.5';
        qualityGroup.style.pointerEvents = 'none';
        qualitySlider.disabled = true;
      } else {
        qualityGroup.style.opacity = '1';
        qualityGroup.style.pointerEvents = 'auto';
        qualitySlider.disabled = false;
      }
    }
  }

  function updateSliderValue(slider, display) {
    display.textContent = slider.value;
  }

  function clearAll() {
    if (uploadedFiles.length === 0 && convertedFiles.length === 0) {
      showNotification("Nothing to clear", "info");
      return;
    }

    uploadedFiles = [];
    convertedFiles = [];
    filesList.innerHTML = "";
    previewContainer.innerHTML = "";
    conversionResults.style.display = "none";

    showNotification("All files cleared", "success");
  }

  // ==================== Image Conversion ====================
  async function startConversion() {
    if (uploadedFiles.length === 0) {
      showNotification("Please upload images first!", "error");
      return;
    }

    // Reset previous results
    previewContainer.innerHTML = "";
    convertedFiles = [];
    conversionResults.style.display = "none";
    progressContainer.style.display = "block";
    progressBar.style.width = "0%";
    progressPercentage.textContent = "0%";

    const settings = {
      format: formatSelect.value,
      quality: parseInt(qualitySlider.value) / 100
    };
    
    let totalSavings = 0;

    try {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        progressText.textContent = `Converting ${file.name}...`;

        const result = await convertImage(file, settings);
        convertedFiles.push(result);

        totalSavings += (file.size - result.size);

        createPreviewItem(result, file);

        const percentage = Math.round(((i + 1) / uploadedFiles.length) * 100);
        progressBar.style.width = `${percentage}%`;
        progressPercentage.textContent = `${percentage}%`;
      }

      // Show results
      conversionResults.style.display = "block";
      totalFiles.textContent = `${convertedFiles.length} file${convertedFiles.length !== 1 ? 's' : ''}`;
      totalSaved.textContent = totalSavings > 0
        ? `${formatFileSize(totalSavings)} saved`
        : `${formatFileSize(Math.abs(totalSavings))} increase`;

      progressText.textContent = "Conversion complete!";

      setTimeout(() => {
        progressContainer.style.display = "none";
      }, 2000);

      showNotification("All images converted successfully!", "success");
    } catch (error) {
      console.error("Conversion error:", error);
      showNotification("Error during conversion", "error");
      progressContainer.style.display = "none";
    }
  }

  async function convertImage(file, settings) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();

        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // Keep original dimensions
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw image
            ctx.drawImage(img, 0, 0, img.width, img.height);

            // Determine MIME type
            const mimeType = getMimeType(settings.format);

            // Convert to blob
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve({
                    blob: blob,
                    name: generateFileName(file.name, settings.format),
                    originalName: file.name,
                    width: canvas.width,
                    height: canvas.height,
                    size: blob.size,
                    originalSize: file.size
                  });
                } else {
                  reject(new Error("Failed to create blob"));
                }
              },
              mimeType,
              settings.quality
            );
          } catch (error) {
            reject(error);
          }
        };

        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = event.target.result;
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }

  function getMimeType(format) {
    const mimeTypes = {
      jpg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      avif: "image/avif",
      bmp: "image/bmp"
    };
    return mimeTypes[format] || "image/jpeg";
  }

  function generateFileName(originalName, format) {
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    return `${nameWithoutExt}_converted.${format}`;
  }

  // ==================== Preview and Display ====================
  function createPreviewItem(result, originalFile) {
    const previewItem = document.createElement("div");
    previewItem.className = "preview-item";
    previewItem.setAttribute("role", "listitem");

    const img = document.createElement("img");
    img.className = "preview-img";
    img.src = URL.createObjectURL(result.blob);
    img.alt = result.name;
    previewItem.appendChild(img);

    // Details section
    const details = document.createElement("div");
    details.className = "preview-details";

    const filename = document.createElement("div");
    filename.className = "preview-filename";
    filename.textContent = result.name;

    const info = document.createElement("div");
    info.className = "preview-info";

    const sizeDiff = result.size - result.originalSize;
    const sizeChange = sizeDiff > 0
      ? `+${formatFileSize(sizeDiff)}`
      : formatFileSize(Math.abs(sizeDiff));
    const sizeColor = sizeDiff > 0 ? "red" : "green";

    info.innerHTML = `
      <div><strong>Original:</strong> ${originalFile.name}</div>
      <div><strong>Dimensions:</strong> ${result.width} × ${result.height}px</div>
      <div><strong>Original Size:</strong> ${formatFileSize(result.originalSize)}</div>
      <div><strong>New Size:</strong> ${formatFileSize(result.size)} <span style="color: ${sizeColor}">(${sizeChange})</span></div>
    `;

    const downloadBtn = document.createElement("button");
    downloadBtn.className = "download-btn";
    downloadBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      Download
    `;
    downloadBtn.addEventListener("click", () => downloadFile(result));

    details.appendChild(filename);
    details.appendChild(info);
    details.appendChild(downloadBtn);
    previewItem.appendChild(details);

    previewContainer.appendChild(previewItem);
  }

  // ==================== Download Functions ====================
  function downloadFile(result) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(result.blob);
    link.download = result.name;
    link.click();
    showNotification(`Downloading ${result.name}`, "success");
  }

  async function downloadAllAsZip() {
    if (convertedFiles.length === 0) {
      showNotification("No converted images to download", "error");
      return;
    }

    try {
      showNotification("Creating ZIP file...", "info");

      const zip = new JSZip();
      const folder = zip.folder("converted_images");

      convertedFiles.forEach((file) => {
        folder.file(file.name, file.blob);
      });

      const content = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 9 }
      });

      saveAs(content, `converted_images_${Date.now()}.zip`);
      showNotification("ZIP file downloaded successfully!", "success");
    } catch (error) {
      console.error("ZIP generation error:", error);
      showNotification("Error creating ZIP file", "error");
    }
  }

  // ==================== Utility Functions ====================
  function formatFileSize(bytes) {
    if (bytes < 1024) {
      return bytes + " B";
    } else if (bytes < 1048576) {
      return (bytes / 1024).toFixed(1) + " KB";
    } else {
      return (bytes / 1048576).toFixed(2) + " MB";
    }
  }

  function showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add to body
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add("show"), 10);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
});
