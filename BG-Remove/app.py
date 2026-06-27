import tkinter as tk
from tkinter import filedialog, messagebox
import customtkinter as ctk
from PIL import Image, ImageTk
import os
import requests
import io
import json
from pathlib import Path
from rembg import remove
import threading

class BackgroundRemoverApp:
    def __init__(self):
        self.window = ctk.CTk()
        self.window.title("Background Remover")
        self.window.geometry("1000x600")
        self.window.configure(fg_color="#2b2b2b")
        
        # Set theme
        ctk.set_appearance_mode("dark")
        ctk.set_default_color_theme("blue")
        
        # Create main frame
        self.main_frame = ctk.CTkFrame(self.window, fg_color="transparent")
        self.main_frame.pack(fill="both", expand=True, padx=20, pady=20)
        
        # Title
        self.title_label = ctk.CTkLabel(
            self.main_frame,
            text="Background Remover",
            font=("Helvetica", 24, "bold")
        )
        self.title_label.pack(pady=20)
        
        # Settings frame (API Key + Mode selection)
        self.settings_frame = ctk.CTkFrame(self.main_frame, fg_color="transparent")
        self.settings_frame.pack(fill="x", pady=(0, 10))

        self.mode_var = ctk.StringVar(value="local")

        self.local_radio = ctk.CTkRadioButton(
            self.settings_frame, text="Local (rembg - offline)",
            variable=self.mode_var, value="local",
            command=self.toggle_mode, font=("Helvetica", 12)
        )
        self.local_radio.pack(side="left", padx=10)

        self.api_radio = ctk.CTkRadioButton(
            self.settings_frame, text="API (remove.bg)",
            variable=self.mode_var, value="api",
            command=self.toggle_mode, font=("Helvetica", 12)
        )
        self.api_radio.pack(side="left", padx=10)

        self.api_key_label = ctk.CTkLabel(
            self.settings_frame, text="API Key:",
            font=("Helvetica", 12), text_color="gray"
        )
        self.api_key_label.pack(side="left", padx=(20, 5))

        self.api_key_entry = ctk.CTkEntry(
            self.settings_frame, width=300, placeholder_text="Enter your remove.bg API key",
            show="*", state="disabled"
        )
        self.api_key_entry.pack(side="left", padx=5)

        self.toggle_key_btn = ctk.CTkButton(
            self.settings_frame, text="Show", width=50,
            command=self.toggle_api_key_visibility, font=("Helvetica", 10),
            height=28
        )
        self.toggle_key_btn.pack(side="left", padx=(0, 10))

        # Create frames for image display
        self.images_frame = ctk.CTkFrame(self.main_frame, fg_color="transparent")
        self.images_frame.pack(fill="both", expand=True, pady=20)
        
        # Original image frame
        self.original_frame = ctk.CTkFrame(self.images_frame)
        self.original_frame.pack(side="left", fill="both", expand=True, padx=10)
        
        self.original_label = ctk.CTkLabel(
            self.original_frame,
            text="Original Image",
            font=("Helvetica", 16)
        )
        self.original_label.pack(pady=10)
        
        self.original_image_label = ctk.CTkLabel(self.original_frame, text="")
        self.original_image_label.pack(fill="both", expand=True, padx=10, pady=10)
        
        # Processed image frame
        self.processed_frame = ctk.CTkFrame(self.images_frame)
        self.processed_frame.pack(side="right", fill="both", expand=True, padx=10)
        
        self.processed_label = ctk.CTkLabel(
            self.processed_frame,
            text="Processed Image",
            font=("Helvetica", 16)
        )
        self.processed_label.pack(pady=10)
        
        self.processed_image_label = ctk.CTkLabel(self.processed_frame, text="")
        self.processed_image_label.pack(fill="both", expand=True, padx=10, pady=10)
        
        # Buttons frame
        self.buttons_frame = ctk.CTkFrame(self.main_frame, fg_color="transparent")
        self.buttons_frame.pack(fill="x", pady=20)
        
        # Select image button
        self.select_button = ctk.CTkButton(
            self.buttons_frame,
            text="Select Image",
            command=self.select_image,
            font=("Helvetica", 14),
            height=40
        )
        self.select_button.pack(side="left", padx=10)
        
        # Remove background button
        self.remove_button = ctk.CTkButton(
            self.buttons_frame,
            text="Remove Background",
            command=self.remove_background,
            font=("Helvetica", 14),
            height=40,
            state="disabled"
        )
        self.remove_button.pack(side="left", padx=10)
        
        # Save image button
        self.save_button = ctk.CTkButton(
            self.buttons_frame,
            text="Save Image",
            command=self.save_image,
            font=("Helvetica", 14),
            height=40,
            state="disabled"
        )
        self.save_button.pack(side="left", padx=10)
        
        # Progress bar
        self.progress_bar = ctk.CTkProgressBar(self.main_frame)
        self.progress_bar.pack(fill="x", padx=20, pady=10)
        self.progress_bar.set(0)
        
        # Status label
        self.status_label = ctk.CTkLabel(
            self.main_frame,
            text="Ready",
            font=("Helvetica", 12)
        )
        self.status_label.pack(pady=10)
        
        self.original_image = None
        self.processed_image = None
        self.image_path = None
        self.config_file = Path(__file__).parent / ".env"
        self.load_config()
        
    def toggle_mode(self):
        is_api = self.mode_var.get() == "api"
        self.api_key_entry.configure(state="normal" if is_api else "disabled")
        self.api_key_label.configure(text_color="white" if is_api else "gray")
        if is_api and self.api_key_entry.get().strip():
            self.save_config()

    def toggle_api_key_visibility(self):
        if self.api_key_entry.cget("show") == "*":
            self.api_key_entry.configure(show="")
            self.toggle_key_btn.configure(text="Hide")
        else:
            self.api_key_entry.configure(show="*")
            self.toggle_key_btn.configure(text="Show")

    def remove_bg_via_api(self, image_path):
        api_key = self.api_key_entry.get().strip()
        if not api_key:
            raise ValueError("API key is required for remove.bg API mode")

        with open(image_path, "rb") as f:
            response = requests.post(
                "https://api.remove.bg/v1.0/removebg",
                files={"image_file": f},
                headers={"X-Api-Key": api_key},
                timeout=30
            )
        if response.status_code != 200:
            raise ValueError(f"API error: {response.status_code} - {response.text}")
        return Image.open(io.BytesIO(response.content))

    def load_config(self):
        if self.config_file.exists():
            try:
                data = json.loads(self.config_file.read_text())
                if data.get("api_key"):
                    self.api_key_entry.configure(state="normal")
                    self.api_key_entry.insert(0, data["api_key"])
                    self.api_key_entry.configure(state="disabled" if self.mode_var.get() != "api" else "normal")
            except Exception:
                pass

    def save_config(self):
        try:
            data = {"api_key": self.api_key_entry.get().strip()}
            self.config_file.write_text(json.dumps(data, indent=2))
        except Exception:
            pass

    def select_image(self):
        file_path = filedialog.askopenfilename(
            filetypes=[("Image files", "*.png *.jpg *.jpeg *.bmp *.gif")]
        )
        if file_path:
            self.image_path = file_path
            self.original_image = Image.open(file_path)
            self.display_image(self.original_image, self.original_image_label)
            self.remove_button.configure(state="normal")
            self.status_label.configure(text="Image loaded successfully!")
            
    def display_image(self, image, label, size=(400, 400)):
        # Resize image while maintaining aspect ratio
        image.thumbnail(size, Image.Resampling.LANCZOS)
        photo = ImageTk.PhotoImage(image)
        label.configure(image=photo)
        label.image = photo
        
    def remove_background(self):
        if not self.image_path:
            return
            
        self.progress_bar.set(0)
        self.status_label.configure(text="Removing background...")
        self.remove_button.configure(state="disabled")
        
        def process():
            try:
                if self.mode_var.get() == "api":
                    output_image = self.remove_bg_via_api(self.image_path)
                    self.window.after(0, lambda: self.save_config())
                else:
                    input_image = Image.open(self.image_path)
                    output_image = remove(input_image)
                self.processed_image = output_image
                self.window.after(0, lambda: self.display_image(output_image, self.processed_image_label))
                self.window.after(0, lambda: self.status_label.configure(text="Background removed successfully!"))
                self.window.after(0, lambda: self.save_button.configure(state="normal"))
                self.window.after(0, lambda: self.progress_bar.set(1))
            except Exception as e:
                self.window.after(0, lambda: self.status_label.configure(text=f"Error: {str(e)}"))
                self.window.after(0, lambda: self.progress_bar.set(0))
            finally:
                self.window.after(0, lambda: self.remove_button.configure(state="normal"))
        
        threading.Thread(target=process, daemon=True).start()
        
    def save_image(self):
        if not self.processed_image:
            return
            
        file_path = filedialog.asksaveasfilename(
            defaultextension=".png",
            filetypes=[("PNG files", "*.png")]
        )
        if file_path:
            self.processed_image.save(file_path)
            self.status_label.configure(text="Image saved successfully!")
            
    def run(self):
        self.window.mainloop()

if __name__ == "__main__":
    app = BackgroundRemoverApp()
    app.run() 