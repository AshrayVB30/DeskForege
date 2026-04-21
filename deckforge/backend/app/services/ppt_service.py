from pptx import Presentation
import io

def create_ppt_from_json(slides_data: list) -> io.BytesIO:
    """
    Takes JSON structure and creates a PPTX binary stream.
    Expected format: [{"title": "str", "points": ["str"]}]
    """
    prs = Presentation()
    
    # 0 is title slide layout, 1 is title and content layout
    title_slide_layout = prs.slide_layouts[0]
    bullet_slide_layout = prs.slide_layouts[1]
    
    # Optional: Title slide generated from first item if it feels like a main title
    if len(slides_data) > 0:
        slide = prs.slides.add_slide(title_slide_layout)
        title = slide.shapes.title
        subtitle = slide.placeholders[1]
        title.text = slides_data[0].get("title", "Presentation")
        points = slides_data[0].get("points", [])
        if points:
            subtitle.text = "\n".join(points)
            
    # Rest of the slides
    for slide_data in slides_data[1:]:
        slide = prs.slides.add_slide(bullet_slide_layout)
        shapes = slide.shapes
        
        title_shape = shapes.title
        body_shape = shapes.placeholders[1]
        
        title_shape.text = slide_data.get("title", "Untitled Slide")
        
        tf = body_shape.text_frame
        points = slide_data.get("points", [])
        
        if points:
            tf.text = points[0]
            for point in points[1:]:
                p = tf.add_paragraph()
                p.text = point
                p.level = 0
                
    ppt_stream = io.BytesIO()
    prs.save(ppt_stream)
    ppt_stream.seek(0)
    return ppt_stream
