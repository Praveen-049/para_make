from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas


def build_pdf(project, design_input, design_result) -> bytes:
    buffer = BytesIO()
    page = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    page.setFont('Helvetica-Bold', 18)
    page.drawString(72, height - 72, 'Parachute Design Platform Report')
    page.setFont('Helvetica', 11)
    page.drawString(72, height - 100, f'Project: {project.name}')
    page.drawString(72, height - 116, f'Type: {project.project_type}')
    page.drawString(72, height - 132, f'Description: {project.description or "-"}')
    page.drawString(72, height - 148, f'Created: {project.created_at:%Y-%m-%d %H:%M}')

    y = height - 190
    page.setFont('Helvetica-Bold', 14)
    page.drawString(72, y, 'Input Parameters')
    page.setFont('Helvetica', 10)
    y -= 18

    input_rows = [
        ('Payload Mass (kg)', design_input.payload_mass),
        ('Payload Dimensions', design_input.payload_dimensions),
        ('Payload Shape', design_input.payload_shape),
        ('Deployment Altitude (m)', design_input.altitude),
        ('Landing Velocity Requirement (m/s)', design_input.landing_velocity_requirement),
        ('Required Safety Factor', design_input.safety_factor),
        ('Parachute Type', design_input.parachute_type),
        ('Material', design_input.material),
        ('Wind Speed (m/s)', design_input.wind_speed),
    ]
    for label, value in input_rows:
        page.drawString(72, y, f'{label}: {value}')
        y -= 14

    y -= 10
    page.setFont('Helvetica-Bold', 14)
    page.drawString(72, y, 'Design Results')
    page.setFont('Helvetica', 10)
    y -= 18

    result_rows = [
        ('Canopy Area (m²)', design_result.canopy_area),
        ('Diameter (m)', design_result.diameter),
        ('Gore Count', design_result.gore_count),
        ('Line Count', design_result.suspension_line_count),
        ('Line Length (m)', design_result.suspension_line_length),
        ('Drag Force (N)', design_result.drag_force),
        ('Terminal Velocity (m/s)', design_result.terminal_velocity),
        ('Safety Margin (%)', design_result.safety_margin),
        ('Drift Distance (m)', design_result.drift_distance),
    ]
    for label, value in result_rows:
        page.drawString(72, y, f'{label}: {value}')
        y -= 14

    if design_result.wingspan:
        y -= 10
        page.setFont('Helvetica-Bold', 14)
        page.drawString(72, y, 'Parafoil Metrics')
        page.setFont('Helvetica', 10)
        y -= 18
        parafoil_rows = [
            ('Wingspan (m)', design_result.wingspan),
            ('Chord Length (m)', design_result.chord_length),
            ('Cell Count', design_result.cell_count),
            ('Aspect Ratio', design_result.aspect_ratio),
            ('Wing Loading (kg/m²)', design_result.wing_loading),
            ('Glide Ratio', design_result.glide_ratio),
            ('Forward Speed (m/s)', design_result.forward_speed),
        ]
        for label, value in parafoil_rows:
            page.drawString(72, y, f'{label}: {value}')
            y -= 14

    page.showPage()
    page.save()
    buffer.seek(0)
    return buffer.read()
