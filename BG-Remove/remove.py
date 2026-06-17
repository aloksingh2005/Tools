from rembg import remove
from PIL import Image

input_path = "input.jpg"      # Path to your input image
output_path = "output.png"    # Path to save the output image

image_input = Image.open(input_path)
output = remove(image_input)
output.save(output_path)