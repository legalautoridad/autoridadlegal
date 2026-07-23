import os
from PIL import Image

public_dir = "/Users/domingoimperatori/Documents/AniPro/autoridadlegal/public"
app_dir = "/Users/domingoimperatori/Documents/AniPro/autoridadlegal/src/app"

icon_png_path = os.path.join(public_dir, "icon.png")

if os.path.exists(icon_png_path):
    img = Image.open(icon_png_path)
    
    # Save multi-size ico
    ico_path_public = os.path.join(public_dir, "favicon.ico")
    ico_path_app = os.path.join(app_dir, "favicon.ico")
    
    img.save(ico_path_public, format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    img.save(ico_path_app, format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    print(f"Successfully generated favicon.ico at {ico_path_public} and {ico_path_app}")
else:
    print("icon.png not found")
