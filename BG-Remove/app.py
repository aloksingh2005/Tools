import tkinter as tk
from tkinter import filedialog, messagebox
import customtkinter as ctk
from PIL import Image, ImageTk
import os
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