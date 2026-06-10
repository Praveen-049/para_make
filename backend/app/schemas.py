from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(..., min_length=8)

class UserRead(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ProjectBase(BaseModel):
    name: str = Field(..., min_length=3)
    description: Optional[str] = None
    project_type: str = Field(..., min_length=3)

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    pass

class DesignInputBase(BaseModel):
    payload_mass: float = Field(..., gt=0)
    payload_dimensions: str = Field(..., min_length=3)
    payload_shape: str
    center_of_gravity: str
    altitude: float = Field(..., gt=0)
    landing_velocity_requirement: float = Field(..., gt=0)
    deployment_velocity: float = Field(..., gt=0)
    safety_factor: float = Field(..., gt=0)
    target_accuracy: float = Field(..., ge=0)
    temperature: float
    air_density: float = Field(..., gt=0)
    wind_speed: float = Field(..., ge=0)
    wind_direction: str
    humidity: float = Field(..., ge=0, le=100)
    parachute_type: str
    material: str
    max_packed_volume: Optional[float] = None
    max_weight: Optional[float] = None
    manufacturing_constraints: Optional[str] = None

class DesignResultBase(BaseModel):
    canopy_area: float
    diameter: float
    gore_count: int
    suspension_line_count: int
    suspension_line_length: float
    drag_force: float
    terminal_velocity: float
    safety_margin: float
    descent_time: float
    drift_distance: float
    projected_area: float
    drag_coefficient: float
    opening_load: float
    wingspan: Optional[float] = None
    chord_length: Optional[float] = None
    cell_count: Optional[int] = None
    aspect_ratio: Optional[float] = None
    wing_loading: Optional[float] = None
    glide_ratio: Optional[float] = None
    forward_speed: Optional[float] = None

class DesignInputCreate(DesignInputBase):
    pass

class DesignResultRead(DesignResultBase):
    class Config:
        orm_mode = True

class DesignInputRead(DesignInputBase):
    id: int
    project_id: int

    class Config:
        orm_mode = True

class ProjectRead(ProjectBase):
    id: int
    user_id: int
    created_at: datetime
    design_input: Optional[DesignInputRead] = None
    design_result: Optional[DesignResultRead] = None

    class Config:
        orm_mode = True

class SearchResponse(BaseModel):
    total_projects: int
    matching_projects: int

class DashboardStats(BaseModel):
    total_projects: int
    active_projects: int
    parafoil_projects: int
    average_safety_margin: float
