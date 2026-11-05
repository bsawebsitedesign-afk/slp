from PIL import Image

def make_white_transparent_pil(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    pix = img.load()
    width, height = img.size

    for y in range(height):
        for x in range(width):
            r, g, b, a = pix[x, y]
            # If the pixel is close to pure white background
            if r > 242 and g > 242 and b > 242:
                pix[x, y] = (0, 0, 0, 0)

    img.save(output_path, "PNG")
    print(f"Successfully saved clean transparent PNG to {output_path}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 2:
        make_white_transparent_pil(sys.argv[1], sys.argv[2])
