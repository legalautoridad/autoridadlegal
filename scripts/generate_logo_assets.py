import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import math

# Target directory
public_dir = "/Users/domingoimperatori/Documents/AniPro/autoridadlegal/public"
images_dir = os.path.join(public_dir, "images")
app_dir = "/Users/domingoimperatori/Documents/AniPro/autoridadlegal/src/app"

os.makedirs(images_dir, exist_ok=True)

# 1. SVG Definitions

def get_svg_defs():
    return """
    <defs>
      <!-- Silver Gradient for Speech Bubble -->
      <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="30%" stop-color="#F1F5F9"/>
        <stop offset="70%" stop-color="#94A3B8"/>
        <stop offset="100%" stop-color="#64748B"/>
      </linearGradient>
      <linearGradient id="silverHighlight" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#CBD5E1"/>
        <stop offset="50%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#94A3B8"/>
      </linearGradient>

      <!-- Gold Gradient for Circuits and Triangle Left -->
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFE79A"/>
        <stop offset="35%" stop-color="#F59E0B"/>
        <stop offset="75%" stop-color="#D97706"/>
        <stop offset="100%" stop-color="#92400E"/>
      </linearGradient>

      <linearGradient id="goldHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFBEB"/>
        <stop offset="50%" stop-color="#FBBF24"/>
        <stop offset="100%" stop-color="#B45309"/>
      </linearGradient>

      <!-- Copper/Bronze Gradient for Triangle Right/Bottom (L accent) -->
      <linearGradient id="copperGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFEDD5"/>
        <stop offset="30%" stop-color="#F97316"/>
        <stop offset="70%" stop-color="#C57041"/>
        <stop offset="100%" stop-color="#7C2D12"/>
      </linearGradient>

      <linearGradient id="bronzeDark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#EA580C"/>
        <stop offset="50%" stop-color="#9A3412"/>
        <stop offset="100%" stop-color="#431407"/>
      </linearGradient>

      <!-- Dark Background Radial Glow -->
      <radialGradient id="bgGlow" cx="50%" cy="45%" r="65%">
        <stop offset="0%" stop-color="#1E293B"/>
        <stop offset="60%" stop-color="#0F172A"/>
        <stop offset="100%" stop-color="#090D16"/>
      </radialGradient>

      <!-- Drop Shadows -->
      <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.5"/>
      </filter>
      <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="6" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>
    """

def get_emblem_svg_content(scale_factor=1.0):
    return """
    <g filter="url(#dropShadow)">
      <!-- SPEECH BUBBLE (Silver / White Chrome) -->
      <!-- Main circular arc around left, top, bottom -->
      <path d="M 315,115 
               A 140,140 0 1,0 125,315 
               L 80,410 
               L 180,360 
               A 140,140 0 0,0 350,265" 
            fill="none" 
            stroke="url(#silverGradient)" 
            stroke-width="24" 
            stroke-linecap="round" 
            stroke-linejoin="round" />
      
      <!-- Inner silver accent edge -->
      <path d="M 310,123 
               A 130,130 0 1,0 133,310 
               L 95,395 
               L 177,352 
               A 130,130 0 0,0 342,263" 
            fill="none" 
            stroke="url(#silverHighlight)" 
            stroke-width="5" 
            opacity="0.8" />

      <!-- TECH CIRCUITS (Gold Nodes & Arcs on Right Side) -->
      <!-- Outer Circuit Arc -->
      <path d="M 280,68 A 185,185 0 0,1 430,285 A 185,185 0 0,1 360,395" 
            fill="none" 
            stroke="url(#goldGradient)" 
            stroke-width="14" 
            stroke-linecap="round" />

      <!-- Inner Circuit Arc -->
      <path d="M 330,118 A 165,165 0 0,1 418,245" 
            fill="none" 
            stroke="url(#goldHighlight)" 
            stroke-width="11" 
            stroke-linecap="round" />

      <!-- Circuit Nodes (Golden Rings with Center Dots) -->
      <!-- Top Node 1 -->
      <circle cx="280" cy="68" r="18" fill="#0F172A" stroke="url(#goldGradient)" stroke-width="8" />
      <circle cx="280" cy="68" r="6" fill="url(#goldHighlight)" />

      <!-- Upper Right Node 2 -->
      <circle cx="330" cy="118" r="15" fill="#0F172A" stroke="url(#goldGradient)" stroke-width="7" />
      <circle cx="330" cy="118" r="5" fill="url(#goldHighlight)" />

      <!-- Far Right Node 3 -->
      <circle cx="430" cy="285" r="18" fill="#0F172A" stroke="url(#goldGradient)" stroke-width="8" />
      <circle cx="430" cy="285" r="6" fill="url(#goldHighlight)" />

      <!-- Inner Node 4 -->
      <circle cx="418" cy="245" r="15" fill="#0F172A" stroke="url(#goldGradient)" stroke-width="7" />
      <circle cx="418" cy="245" r="5" fill="url(#goldHighlight)" />

      <!-- Bottom Right Node 5 -->
      <circle cx="360" cy="395" r="18" fill="#0F172A" stroke="url(#goldGradient)" stroke-width="8" />
      <circle cx="360" cy="395" r="6" fill="url(#goldHighlight)" />

      <!-- CENTRAL GEOMETRIC MONOGRAM (A / L TRIANGLES) -->
      <!-- Outer Golden "A" Apex & Left Slope -->
      <g filter="url(#goldGlow)">
        <!-- Left Main Gold Facet (Light Gold) -->
        <polygon points="235,135 155,275 220,250" fill="url(#goldHighlight)" />
        
        <!-- Top Apex Gold Facet (Pure Gold) -->
        <polygon points="235,135 305,245 270,255 220,250" fill="url(#goldGradient)" />

        <!-- Inner Bevel Slope -->
        <polygon points="155,275 235,135 175,275" fill="#F59E0B" opacity="0.6" />

        <!-- Overlapping Bronze/Copper "L" Base Facets -->
        <!-- Upper Copper Facet -->
        <polygon points="270,255 320,275 220,250" fill="url(#copperGradient)" />

        <!-- Lower Right Copper/Bronze Facet -->
        <polygon points="220,250 320,275 315,315 200,315" fill="url(#bronzeDark)" />

        <!-- Front Copper Highlight Edge -->
        <polygon points="200,315 315,315 270,290" fill="url(#copperGradient)" />
      </g>
    </g>
    """

def create_svg_icon(background="transparent"):
    bg_rect = ""
    if background == "dark":
        bg_rect = '<rect width="512" height="512" rx="96" fill="url(#bgGlow)"/>'
    elif background == "dark-circle":
        bg_rect = '<circle cx="256" cy="256" r="240" fill="url(#bgGlow)"/>'
    elif background == "light":
        bg_rect = '<rect width="512" height="512" rx="96" fill="#FFFFFF"/>'
    
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
    {get_svg_defs()}
    {bg_rect}
    <g transform="translate(10, 10)">
      {get_emblem_svg_content()}
    </g>
</svg>"""

def create_svg_full_logo(theme="dark"):
    text_color_autoridad = "#FFFFFF" if theme == "dark" else "#0F172A"
    bg_rect = ""
    if theme == "dark":
        bg_rect = '<rect width="1000" height="320" rx="32" fill="url(#bgGlow)"/>'
    elif theme == "light":
        bg_rect = '<rect width="1000" height="320" rx="32" fill="#FFFFFF"/>'

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 320" width="1000" height="320">
    {get_svg_defs()}
    {bg_rect}
    <g transform="translate(10, -85) scale(0.9)">
      {get_emblem_svg_content()}
    </g>
    <!-- Typography -->
    <text x="460" y="170" font-family="Montserrat, 'Inter', sans-serif" font-weight="900" font-size="82" letter-spacing="3" fill="{text_color_autoridad}">AUTORIDAD</text>
    <text x="465" y="245" font-family="Montserrat, 'Inter', sans-serif" font-weight="600" font-size="56" letter-spacing="18" fill="url(#copperGradient)">LEGAL</text>
</svg>"""

def create_svg_favicon():
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
    {get_svg_defs()}
    <rect width="512" height="512" rx="112" fill="#0A1128"/>
    <rect width="496" height="496" x="8" y="8" rx="104" fill="none" stroke="url(#goldGradient)" stroke-width="4" opacity="0.4"/>
    <g transform="translate(10, 10)">
      {get_emblem_svg_content()}
    </g>
</svg>"""

# Generate all SVGs
print("Generating SVGs...")
with open(os.path.join(public_dir, "favicon.svg"), "w") as f:
    f.write(create_svg_favicon())

with open(os.path.join(app_dir, "icon.svg"), "w") as f:
    f.write(create_svg_favicon())

with open(os.path.join(public_dir, "icon.svg"), "w") as f:
    f.write(create_svg_favicon())

with open(os.path.join(images_dir, "logo-icon.svg"), "w") as f:
    f.write(create_svg_icon("transparent"))

with open(os.path.join(images_dir, "logo-icon-dark.svg"), "w") as f:
    f.write(create_svg_icon("dark"))

with open(os.path.join(images_dir, "logo-dark.svg"), "w") as f:
    f.write(create_svg_full_logo("dark"))

with open(os.path.join(images_dir, "logo-light.svg"), "w") as f:
    f.write(create_svg_full_logo("light"))

with open(os.path.join(images_dir, "logo-transparent.svg"), "w") as f:
    f.write(create_svg_full_logo("transparent"))

print("SVG generation complete.")
