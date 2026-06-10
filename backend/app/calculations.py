import math
from .schemas import DesignInputCreate

GRAVITY = 9.80665
PARACHUTE_TYPES = {
    'Round Parachute': 1.2,
    'Cruciform': 1.15,
    'Ring Slot': 1.05,
    'Ram Air Parafoil': 0.75,
}


def build_basic_design(input_data: DesignInputCreate) -> dict:
    mass = input_data.payload_mass
    rho = input_data.air_density
    target_velocity = input_data.landing_velocity_requirement
    safety_factor = input_data.safety_factor
    cd = PARACHUTE_TYPES.get(input_data.parachute_type, 1.2)
    area = (2.0 * mass * GRAVITY) / (rho * cd * target_velocity ** 2)
    area *= safety_factor
    area = max(area, 1.0)
    diameter = math.sqrt((4.0 * area) / math.pi)
    gore_count = int(max(8, math.ceil(diameter * 2)))
    suspension_line_count = int(max(12, gore_count * 2))
    suspension_line_length = round(diameter * 1.15, 2)
    dynamic_pressure = 0.5 * rho * target_velocity ** 2
    drag_force = dynamic_pressure * cd * area
    terminal_velocity = math.sqrt((2.0 * mass * GRAVITY) / (rho * cd * area))
    descent_time = area and (input_data.altitude / terminal_velocity) if terminal_velocity > 0 else 0.0
    drift_distance = input_data.wind_speed * descent_time
    opening_load = 0.65 * mass * GRAVITY
    projected_area = area
    safety_margin = max(0.0, ((input_data.landing_velocity_requirement - terminal_velocity) / input_data.landing_velocity_requirement) * 100.0)

    result = {
        'canopy_area': round(area, 3),
        'diameter': round(diameter, 3),
        'gore_count': gore_count,
        'suspension_line_count': suspension_line_count,
        'suspension_line_length': suspension_line_length,
        'drag_force': round(drag_force, 3),
        'terminal_velocity': round(terminal_velocity, 3),
        'safety_margin': round(safety_margin, 2),
        'descent_time': round(descent_time, 3),
        'drift_distance': round(drift_distance, 3),
        'projected_area': round(projected_area, 3),
        'drag_coefficient': round(cd, 3),
        'opening_load': round(opening_load, 3),
    }

    if input_data.parachute_type == 'Ram Air Parafoil':
        aspect_ratio = max(5.0, round(6.0 + (area / 15.0), 2))
        chord_length = round(math.sqrt(area / aspect_ratio), 3)
        wingspan = round(aspect_ratio * chord_length, 3)
        cell_count = int(max(6, round(aspect_ratio * 4)))
        wing_loading = round(mass / area, 3)
        glide_ratio = 4.5
        forward_speed = round(max(8.0, terminal_velocity * 0.35 * glide_ratio), 3)

        result.update({
            'wingspan': wingspan,
            'chord_length': chord_length,
            'cell_count': cell_count,
            'aspect_ratio': aspect_ratio,
            'wing_loading': wing_loading,
            'glide_ratio': glide_ratio,
            'forward_speed': forward_speed,
        })
    else:
        result.update({
            'wingspan': None,
            'chord_length': None,
            'cell_count': None,
            'aspect_ratio': None,
            'wing_loading': None,
            'glide_ratio': None,
            'forward_speed': None,
        })

    return result
