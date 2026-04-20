#!/usr/bin/env python3
"""
GeoFix Icon Generator
Generates placeholder PWA icons for the civic issue resolution app
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size):
    """Create a single icon with the specified size"""
    # Create image with gradient-like background
    img = Image.new('RGB', (size, size), color='#2563eb')
    draw = ImageDraw.Draw(img)
    
    # Draw a blue gradient background (simplified as solid color)
    for y in range(size):
        # Create gradient effect
        color_value = int(37 + (29 - 37) * (y / size))  # From #2563eb to #1d4ed8
        draw.rectangle([(0, y), (size, y+1)], fill=(color_value, 99, 235))
    
    # Add rounded rectangle mask
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    radius = int(size * 0.15)
    mask_draw.rounded_rectangle([(0, 0), (size, size)], radius=radius, fill=255)
    
    # Create output image
    output = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    output.paste(img, (0, 0))
    output.putalpha(mask)
    
    # Add wrench emoji or text
    text_draw = ImageDraw.Draw(output)
    
    # Try to use a font, fall back to default if not available
    try:
        font_size = int(size * 0.4)
        font = ImageFont.truetype("arial.ttf", font_size)
        small_font = ImageFont.truetype("arial.ttf", int(size * 0.15))
    except:
        font = ImageFont.load_default()
        small_font = ImageFont.load_default()
    
    # Add main icon text
    text = "🔧"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (size - text_width) // 2
    y = (size - text_height) // 2 - int(size * 0.05)
    
    # Fallback to simple text if emoji doesn't work
    try:
        text_draw.text((x, y), text, fill='white', font=font)
    except:
        # Fallback: Draw a simple wrench shape
        text_draw.text((size // 2 - int(size * 0.1), size // 2 - int(size * 0.15)), 
                      "GF", fill='white', font=font, anchor="mm")
    
    # Add small "GF" text for branding
    if size >= 128:
        text_draw.text((size // 2, int(size * 0.75)), "GeoFix", 
                      fill='white', font=small_font, anchor="mm")
    
    return output

def main():
    """Generate all required icons"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    icons_dir = os.path.join(script_dir, 'icons')
    
    # Create icons directory if it doesn't exist
    os.makedirs(icons_dir, exist_ok=True)
    
    sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    
    print("🔧 GeoFix Icon Generator")
    print("=" * 50)
    print(f"Generating {len(sizes)} icons...\n")
    
    for size in sizes:
        filename = f"icon-{size}x{size}.png"
        filepath = os.path.join(icons_dir, filename)
        
        print(f"Creating {filename}...", end=" ")
        
        try:
            icon = create_icon(size)
            icon.save(filepath, 'PNG')
            print("✅")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print("\n" + "=" * 50)
    print("✅ Icon generation complete!")
    print(f"📁 Icons saved to: {icons_dir}")
    print("\nNext steps:")
    print("1. Reload your app in the browser")
    print("2. The PWA icon errors should be resolved")
    print("3. (Optional) Replace with custom icons later")

if __name__ == "__main__":
    try:
        main()
    except ImportError:
        print("❌ Error: PIL (Pillow) library not found")
        print("\nTo install it, run:")
        print("  pip install Pillow")
        print("\nOr use the generate-icons.html file instead")
