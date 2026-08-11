import fitz  # PyMuPDF
import os

input_path = "public/ultimate_story.pdf"
output_path = "public/ultimate_story_compressed.pdf"

print(f"Original file size: {os.path.getsize(input_path) / (1024*1024):.2f} MB")

doc = fitz.open(input_path)
print(f"Total pages: {len(doc)}")

# Save with garbage collection, deflation, and stream compression
doc.save(output_path, garbage=4, deflate=True, deflate_images=True, deflate_fonts=True)
doc.close()

compressed_size = os.path.getsize(output_path) / (1024*1024)
print(f"Compressed file size: {compressed_size:.2f} MB")

if compressed_size < 95:
    os.replace(output_path, input_path)
    print("Successfully replaced ultimate_story.pdf with compressed version!")
else:
    print("File still > 95MB, rendering pages as optimized JPEGs...")
    doc = fitz.open(input_path)
    new_doc = fitz.open()
    
    for i, page in enumerate(doc):
        pix = page.get_pixmap(dpi=150)
        img_bytes = pix.tobytes("jpeg", jpg_quality=75)
        
        img_doc = fitz.open("jpeg", img_bytes)
        pdf_bytes = img_doc.convert_to_pdf()
        img_doc.close()
        
        img_pdf = fitz.open("pdf", pdf_bytes)
        new_doc.insert_pdf(img_pdf)
        img_pdf.close()
        print(f"Processed page {i+1}/{len(doc)}")

    doc.close()
    new_doc.save(output_path, garbage=4, deflate=True)
    new_doc.close()
    
    final_size = os.path.getsize(output_path) / (1024*1024)
    print(f"Final optimized size: {final_size:.2f} MB")
    os.replace(output_path, input_path)
