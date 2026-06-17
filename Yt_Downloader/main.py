# main.py
# Requirements:
#   pip install yt-dlp customtkinter Pillow
#   FFmpeg must be installed and added to PATH

import os
import re
import threading
import yt_dlp
import customtkinter as ctk
from tkinter import filedialog, messagebox
from yt_dlp.utils import DownloadError

# Clean filename helper
BAD = r'[<>:"/\\|?*]'
fix = lambda s, ext: re.sub(BAD, "", s)[:200] + "." + ext
clean = lambda u: u.strip().strip("'\" ,")


class YouTubeDownloader(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("Ultimate YouTube Downloader - Best Quality Guaranteed!")
        self.geometry(
            "700x600"
        )  # Slightly smaller height to encourage scrolling if needed
        ctk.set_appearance_mode("dark")
        ctk.set_default_color_theme("blue")

        # Create scrollable frame for the entire content
        self.scrollable_frame = ctk.CTkScrollableFrame(self)
        self.scrollable_frame.pack(fill="both", expand=True, padx=20, pady=20)

        self.setup_ui()

    def setup_ui(self):
        # Title
        title_label = ctk.CTkLabel(
            self.scrollable_frame,
            text="Ultimate YouTube Downloader",
            font=ctk.CTkFont(size=28, weight="bold"),
        )
        title_label.pack(pady=(20, 10))

        # Supported platforms info
        info_label = ctk.CTkLabel(
            self.scrollable_frame,
            text="Supports: YouTube Videos & Playlists (up to 8K/4320p, VP9, Merged A/V)",
            font=ctk.CTkFont(size=14),
        )
        info_label.pack(pady=(0, 20))

        # URLs input section
        url_frame = ctk.CTkFrame(self.scrollable_frame)
        url_frame.pack(pady=10, padx=20, fill="x")

        ctk.CTkLabel(
            url_frame,
            text="YouTube URLs (one per line, playlists supported):",
            font=ctk.CTkFont(size=16, weight="bold"),
        ).pack(pady=(15, 5))

        self.url_textbox = ctk.CTkTextbox(url_frame, height=120, width=640)
        self.url_textbox.insert(
            "0.0",
            "Kya Download Karna Hai Bhai?\n\nExamples:\n"
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ\n"
            "https://www.youtube.com/playlist?list=PLexample\n",
        )
        self.url_textbox.bind("<FocusIn>", self.clear_placeholder)
        self.url_textbox.pack(pady=(5, 15), padx=15)

        # Download format section
        format_frame = ctk.CTkFrame(self.scrollable_frame)
        format_frame.pack(pady=10, padx=20, fill="x")

        ctk.CTkLabel(
            format_frame,
            text="Download Format:",
            font=ctk.CTkFont(size=16, weight="bold"),
        ).pack(pady=(15, 5))

        self.format_var = ctk.StringVar(value="mp4")
        format_radio_frame = ctk.CTkFrame(format_frame)
        format_radio_frame.pack(pady=5)

        ctk.CTkRadioButton(
            format_radio_frame,
            text="Video (MP4 - Best Video + Audio Merged)",
            variable=self.format_var,
            value="mp4",
        ).pack(side="left", padx=20)

        ctk.CTkRadioButton(
            format_radio_frame,
            text="Audio (MP3 - High Quality)",
            variable=self.format_var,
            value="mp3",
        ).pack(side="left", padx=20)

        # Quality/Resolution section
        quality_frame = ctk.CTkFrame(format_frame)
        quality_frame.pack(pady=(10, 15))

        ctk.CTkLabel(quality_frame, text="Quality/Resolution:").pack(pady=(5, 0))

        self.quality_var = ctk.StringVar(value="best")
        quality_options = [
            "best",
            "4320p",
            "2160p",
            "1440p",
            "1080p",
            "720p",
            "480p",
            "360p",
            "240p",
            "144p",
        ]
        self.quality_menu = ctk.CTkOptionMenu(
            quality_frame, values=quality_options, variable=self.quality_var
        )
        self.quality_menu.pack(pady=5)

        # Advanced options frame
        advanced_frame = ctk.CTkFrame(self.scrollable_frame)
        advanced_frame.pack(pady=10, padx=20, fill="x")

        ctk.CTkLabel(
            advanced_frame,
            text="Advanced Options:",
            font=ctk.CTkFont(size=16, weight="bold"),
        ).pack(pady=(15, 10))

        options_inner = ctk.CTkFrame(advanced_frame)
        options_inner.pack(pady=5, padx=15, fill="x")

        self.playlist_var = ctk.BooleanVar(value=True)
        ctk.CTkCheckBox(
            options_inner,
            text="Download Playlists (if detected)",
            variable=self.playlist_var,
        ).pack(pady=5, anchor="w")

        self.subtitles_var = ctk.BooleanVar(value=False)
        ctk.CTkCheckBox(
            options_inner,
            text="Download Subtitles (English + Auto-generated)",
            variable=self.subtitles_var,
        ).pack(pady=5, anchor="w")

        self.thumbnail_var = ctk.BooleanVar(value=True)
        ctk.CTkCheckBox(
            options_inner,
            text="Download & Embed Thumbnails (for metadata)",
            variable=self.thumbnail_var,
        ).pack(pady=5, anchor="w")

        # Output directory section
        output_frame = ctk.CTkFrame(self.scrollable_frame)
        output_frame.pack(pady=10, padx=20, fill="x")

        ctk.CTkLabel(
            output_frame,
            text="Output Directory:",
            font=ctk.CTkFont(size=16, weight="bold"),
        ).pack(pady=(15, 5))

        dir_frame = ctk.CTkFrame(output_frame)
        dir_frame.pack(pady=(5, 15), fill="x", padx=15)

        self.output_dir = ctk.StringVar(
            value=os.path.join(os.path.expanduser("~"), "Downloads", "YouTube")
        )
        self.dir_entry = ctk.CTkEntry(dir_frame, textvariable=self.output_dir)
        self.dir_entry.pack(side="left", fill="x", expand=True, padx=(0, 5))

        ctk.CTkButton(
            dir_frame, text="Browse", width=80, command=self.browse_directory
        ).pack(side="right")

        # Progress section
        progress_frame = ctk.CTkFrame(self.scrollable_frame)
        progress_frame.pack(pady=10, padx=20, fill="x")

        ctk.CTkLabel(
            progress_frame, text="Progress:", font=ctk.CTkFont(size=16, weight="bold")
        ).pack(pady=(15, 5))

        self.progress_bar = ctk.CTkProgressBar(progress_frame, width=640)
        self.progress_bar.set(0)
        self.progress_bar.pack(pady=5, padx=15)

        self.status_label = ctk.CTkLabel(
            progress_frame, text="Ready to download - No disappointment guaranteed! 🚀"
        )
        self.status_label.pack(pady=(5, 15))

        # Download button
        self.download_button = ctk.CTkButton(
            self.scrollable_frame,
            text="Start Epic Download",
            command=self.start_download,
            font=ctk.CTkFont(size=18, weight="bold"),
            height=45,
        )
        self.download_button.pack(pady=25)

    def clear_placeholder(self, event):
        current_text = self.url_textbox.get("0.0", "end-1c")
        if "Kya Download Karna Hai Bhai?" in current_text:
            self.url_textbox.delete("0.0", "end")

    def browse_directory(self):
        directory = filedialog.askdirectory(
            title="Select output directory for YouTube downloads"
        )
        if directory:
            self.output_dir.set(directory)

    def update_status(self, text):
        self.status_label.configure(text=text)
        self.update_idletasks()

    def start_download(self):
        urls_text = self.url_textbox.get("0.0", "end-1c")
        urls = [
            clean(url)
            for url in urls_text.splitlines()
            if clean(url) and "Kya Download Karna Hai Bhai?" not in url
        ]

        if not urls:
            messagebox.showerror("Error", "Bhai, kam se kam ek YouTube URL to daalo!")
            return

        if not os.path.exists(self.output_dir.get()):
            messagebox.showerror(
                "Error", "Output directory exist nahi karta - check karo!"
            )
            return

        self.download_button.configure(
            state="disabled", text="Downloading Epic Content..."
        )
        threading.Thread(target=self.download_worker, args=(urls,), daemon=True).start()

    def download_worker(self, urls):
        try:
            total_urls = len(urls)
            for i, url in enumerate(urls, 1):
                self.update_status(
                    f"Processing {i}/{total_urls}: Analyzing YouTube magic..."
                )
                try:
                    self.download_single_url(url, i, total_urls)
                except Exception as e:
                    messagebox.showerror(
                        "Download Error",
                        f"{i}/{total_urls} fail ho gaya!\n{url}\n\nError: {str(e)}",
                    )
                    continue
        except Exception as e:
            messagebox.showerror("Unexpected Error", f"Kuch gadbad: {str(e)}")
        finally:
            self.download_button.configure(state="normal", text="Start Epic Download")
            self.progress_bar.set(0)
            self.update_status("Ready to rock again! No niras here! 😎")

    def download_single_url(self, url, current, total):
        is_audio = self.format_var.get() == "mp3"
        noplaylist = not self.playlist_var.get()

        postprocessors = []
        ydl_opts_base = {
            "outtmpl": os.path.join(
                self.output_dir.get(), "%(uploader)s - %(title)s.%(ext)s"
            ),
            "progress_hooks": [lambda d: self.progress_hook(d, current, total)],
            "noplaylist": noplaylist,
            "extract_flat": False,
            "writesubtitles": self.subtitles_var.get(),
            "writeautomaticsub": self.subtitles_var.get(),
            "subtitleslangs": ["en"],
            "writethumbnail": self.thumbnail_var.get(),
        }

        if is_audio:
            format_selector = "bestaudio/best"
            postprocessors = [
                {
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": "mp3",
                    "preferredquality": "192",
                }
            ]
        else:
            quality = self.quality_var.get()
            if quality == "best":
                format_selector = "bestvideo+bestaudio/best"
            else:
                height = quality.replace("p", "")
                format_selector = (
                    f"bestvideo[height<={height}]+bestaudio/best[height<={height}]"
                )
            # Add metadata embedding for video
            postprocessors.extend(
                [
                    {"key": "FFmpegMetadata"},
                ]
            )
            if self.thumbnail_var.get():
                postprocessors.append(
                    {
                        "key": "EmbedThumbnail",
                        "already_have_thumbnail": False,
                    }
                )

        ydl_opts = {
            **ydl_opts_base,
            "format": format_selector,
            "postprocessors": postprocessors,
        }

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([url])
        except DownloadError as e:
            raise Exception(f"Download fail: {str(e)}")

    def progress_hook(self, d, current_url, total_urls):
        if d["status"] == "downloading":
            base_progress = (current_url - 1) / total_urls
            current_progress = 0
            if d.get("total_bytes"):
                current_progress = d["downloaded_bytes"] / d["total_bytes"]
            elif d.get("total_bytes_estimate"):
                current_progress = d["downloaded_bytes"] / d["total_bytes_estimate"]

            overall_progress = base_progress + (current_progress / total_urls)
            self.progress_bar.set(overall_progress)

            percent = d.get("_percent_str", "0%").strip()
            speed = d.get("_speed_str", "Unknown speed")
            eta = d.get("_eta_str", "Unknown ETA")
            self.update_status(
                f"Downloading {current_url}/{total_urls}: {percent} at {speed} (ETA: {eta})"
            )

        elif d["status"] == "finished":
            self.update_status(
                f"Finished {current_url}/{total_urls}: Post-processing..."
            )


def main():
    app = YouTubeDownloader()
    app.mainloop()


if __name__ == "__main__":
    main()
