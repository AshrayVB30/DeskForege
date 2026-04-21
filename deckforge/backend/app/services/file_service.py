import io
import PyPDF2
import docx

async def extract_text_from_file(filename: str, file_bytes: bytes) -> str:
    """
    Extracts text from uploaded PDFs/DOCXs or txt files.
    """
    extracted_text = ""
    try:
        if filename.lower().endswith(".txt"):
            extracted_text = file_bytes.decode("utf-8", errors="ignore")
            
        elif filename.lower().endswith(".pdf"):
            reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
            text_pages = []
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    text_pages.append(text)
            extracted_text = "\n".join(text_pages)
            
        elif filename.lower().endswith(".docx"):
            doc = docx.Document(io.BytesIO(file_bytes))
            text_paragraphs = [para.text for para in doc.paragraphs if para.text]
            extracted_text = "\n".join(text_paragraphs)
            
        else:
            extracted_text = f"[Unsupported file type: {filename}]"
            
    except Exception as e:
        print(f"Extraction error for {filename}: {e}")
        extracted_text = f"[Error extracting text from {filename}]"
        
    return extracted_text.strip()
