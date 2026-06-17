document.addEventListener("DOMContentLoaded", () => {
    const dropArea = document.getElementById("drop-area");
    const fileInput = document.getElementById("fileInput");
    const previewImage = document.getElementById("previewImage");
    const convertBtn = document.getElementById("convertBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const copyBtn = document.getElementById("copyBtn"); // New Copy Button
    const outputText = document.getElementById("outputText");
    const outputContainer = document.querySelector(".output-container");
    const loadingAnimation = document.getElementById("loadingAnimation");

    // Drag & Drop Functionality
    dropArea.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        handleFile(file);
    });

    dropArea.addEventListener("dragover", (event) => {
        event.preventDefault();
        dropArea.classList.add("active");
    });

    dropArea.addEventListener("dragleave", () => {
        dropArea.classList.remove("active");
    });

    dropArea.addEventListener("drop", (event) => {
        event.preventDefault();
        dropArea.classList.remove("active");
        const file = event.dataTransfer.files[0];
        handleFile(file);
    });

    function handleFile(file) {
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => {
                previewImage.src = reader.result;
                previewImage.classList.remove("hidden");
            };
            reader.readAsDataURL(file);
        }
    }

    // Convert Image to Text
    convertBtn.addEventListener("click", () => {
        if (!fileInput.files.length) return alert("Please upload an image.");

        loadingAnimation.classList.remove("hidden");

        Tesseract.recognize(fileInput.files[0], "eng")
            .then(({ data: { text } }) => {
                outputText.value = text;
                outputContainer.classList.remove("hidden");
                downloadBtn.classList.remove("hidden");
                copyBtn.classList.remove("hidden"); // Show copy button
                loadingAnimation.classList.add("hidden");
            })
            .catch(err => {
                alert("Error extracting text!");
                console.error(err);
                loadingAnimation.classList.add("hidden");
            });
    });

    // Download Extracted Text
    downloadBtn.addEventListener("click", () => {
        const blob = new Blob([outputText.value], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "extracted_text.txt";
        link.click();
    });

    // Copy Extracted Text
    copyBtn.addEventListener("click", () => {
        outputText.select();
        document.execCommand("copy");
        alert("Text copied to clipboard!");
    });
});
