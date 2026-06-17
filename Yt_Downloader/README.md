## Ultimate YouTube Downloader (GUI)

Modern, fast, and easy-to-use desktop app to download YouTube videos, playlists, or audio with best quality using `yt-dlp` and a sleek `customtkinter` UI. Supports up to 8K/4320p, merges best video+audio, embeds metadata and thumbnails, and optionally downloads subtitles.

### Features
- **Best quality video**: smart format selection via `yt-dlp` (bestvideo+bestaudio, or limit by resolution)
- **High quality audio**: extract to MP3 (FFmpeg) with metadata
- **Playlists**: download entire playlists or single videos
- **Subtitles**: English + auto-generated (optional)
- **Thumbnails**: download and embed artwork/thumbnail (optional)
- **Progress UI**: live percent, speed and ETA, per-URL overall progress
- **Output templating**: saves as `%(uploader)s - %(title)s.%(ext)s` into your chosen folder
- **Dark, modern UI**: `customtkinter` styling and scrollable layout

---

### Requirements
- Python 3.9+ recommended
- `yt-dlp`
- `customtkinter`
- `Pillow`
- **FFmpeg** installed and available in PATH

Install Python dependencies:

```bash
pip install yt-dlp customtkinter Pillow
```

Install FFmpeg:
- **Windows**: Download a static build and add `bin` to PATH (e.g., `ffmpeg.exe` available in PATH). A popular source is `https://www.gyan.dev/ffmpeg/builds/`.
- **macOS**: `brew install ffmpeg`
- **Linux (Debian/Ubuntu)**: `sudo apt update && sudo apt install ffmpeg`

Verify FFmpeg:

```bash
ffmpeg -version
```

---

### Quick Start (Run from source)
1. Ensure Python deps and FFmpeg are installed (see Requirements).
2. From the project root, run:

```bash
python main.py
```

3. Paste one or more YouTube URLs (one per line). Playlists are supported.
4. Choose format: Video (MP4) or Audio (MP3).
5. Optionally set resolution, enable subtitles, and thumbnail embedding.
6. Choose an output directory.
7. Click “Start Epic Download”.

Downloads default to your `~/Downloads/YouTube` folder unless you change it.

---

### Controls and Options
- **URLs box**: One YouTube URL per line. Playlists supported.
- **Download Format**: `Video (MP4)` merges best video+audio; `Audio (MP3)` extracts audio.
- **Quality/Resolution**: `best` or a specific cap like `1080p`, `720p`, etc.
- **Advanced Options**:
  - `Download Playlists (if detected)`
  - `Download Subtitles (English + Auto-generated)`
  - `Download & Embed Thumbnails (for metadata)`
- **Output Directory**: Choose where files are saved. Filenames are sanitized and limited to safe characters.

Progress shows overall status across multiple URLs with percent, speed, and ETA. Post-processing (muxing, metadata, thumbnails, audio extract) is handled by FFmpeg via `yt-dlp` postprocessors.

---

### Build a Standalone Executable (PyInstaller)
This repo includes a PyInstaller spec (`main.spec`). You can build a Windows `.exe` locally.

Basic build command:

```bash
pyinstaller --noconfirm --clean main.spec
```

Outputs:
- `dist/main.exe`: the packaged GUI application
- `build/`: intermediate build artifacts

Notes:
- `console=False` is configured for a windowed app.
- UPX compression is enabled if UPX is installed.
- If you modify imports or add data files, you may need to tweak `hiddenimports` or `datas` in `main.spec`.

---

### Folder Structure

```text
Yt_Downloader/
├─ main.py              # Application entrypoint (GUI)
├─ main.spec            # PyInstaller build spec
├─ dist/                # Built artifacts (e.g., main.exe)
└─ build/               # PyInstaller build cache
```

---

### Troubleshooting
- **FFmpeg not found**: Ensure `ffmpeg` is in PATH. Reopen terminal after changes.
- **Permissions**: Pick an output directory you can write to.
- **Download fails**: Some videos may be region-locked, age-restricted, or require cookies. `yt-dlp` supports cookies; integrating cookie support would require extending `main.py` with `cookiefile` options.
- **Subtitles not downloading**: Only English is requested (`en`). Auto-generated enabled when selected; not all videos have them.
- **Slow speeds/ETA inaccurate**: Network-dependent; try again later or check firewall/VPN.

Logs shown in the UI include percent, speed, and ETA. Errors for individual URLs display as message boxes while the app continues with the next item.

---

### How It Works (High-level)
- UI built with `customtkinter` in `YouTubeDownloader` class inside `main.py`.
- For each URL, options are converted into `yt_dlp` config:
  - Video: `format = bestvideo+bestaudio/best` or capped by selected height
  - Audio: `FFmpegExtractAudio` to MP3 (192 kbps)
  - Metadata: `FFmpegMetadata`, and `EmbedThumbnail` if enabled
  - Subtitles: English (`en`), normal + auto-generated if enabled
- Progress hook updates a global progress bar across all URLs.
- Long-running downloads run in a background thread to keep the UI responsive.

---

### Privacy and Disclaimer
This tool downloads content from YouTube. Ensure you have the rights to download and use the content. Respect YouTube’s Terms of Service and local laws.

---

### License
Add your preferred license here (e.g., MIT). If omitted, the project is proprietary by default.

---

### Credits
- Built with `yt-dlp` and `FFmpeg`
- UI by `customtkinter` and `Pillow`


