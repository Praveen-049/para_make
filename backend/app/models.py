from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(180), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    projects = relationship('Project', back_populates='owner', cascade='all, delete-orphan')

class Project(Base):
    __tablename__ = 'projects'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    name = Column(String(180), nullable=False)
    description = Column(Text, nullable=True)
    project_type = Column(String(80), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship('User', back_populates='projects')
    design_input = relationship('DesignInput', back_populates='project', uselist=False, cascade='all, delete-orphan')
    design_result = relationship('DesignResult', back_populates='project', uselist=False, cascade='all, delete-orphan')

class DesignInput(Base):
    __tablename__ = 'design_inputs'

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey('projects.id', ondelete='CASCADE'), unique=True, nullable=False)
    payload_mass = Column(Float, nullable=False)
    payload_dimensions = Column(String(220), nullable=False)
    payload_shape = Column(String(80), nullable=False)
    center_of_gravity = Column(String(120), nullable=False)
    altitude = Column(Float, nullable=False)
    landing_velocity_requirement = Column(Float, nullable=False)
    deployment_velocity = Column(Float, nullable=False)
    safety_factor = Column(Float, default=1.0)
    target_accuracy = Column(Float, nullable=False)
    temperature = Column(Float, nullable=False)
    air_density = Column(Float, nullable=False)
    wind_speed = Column(Float, nullable=False)
    wind_direction = Column(String(60), nullable=False)
    humidity = Column(Float, nullable=False)
    parachute_type = Column(String(80), nullable=False)
    material = Column(String(80), nullable=False)
    max_packed_volume = Column(Float, nullable=True)
    max_weight = Column(Float, nullable=True)
    manufacturing_constraints = Column(Text, nullable=True)

    project = relationship('Project', back_populates='design_input')

class DesignResult(Base):
    __tablename__ = 'design_results'

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey('projects.id', ondelete='CASCADE'), unique=True, nullable=False)
    canopy_area = Column(Float, nullable=False)
    diameter = Column(Float, nullable=False)
    gore_count = Column(Integer, nullable=False)
    suspension_line_count = Column(Integer, nullable=False)
    suspension_line_length = Column(Float, nullable=False)
    drag_force = Column(Float, nullable=False)
    terminal_velocity = Column(Float, nullable=False)
    safety_margin = Column(Float, nullable=False)
    descent_time = Column(Float, nullable=False)
    drift_distance = Column(Float, nullable=False)
    projected_area = Column(Float, nullable=False)
    drag_coefficient = Column(Float, nullable=False)
    opening_load = Column(Float, nullable=False)
    wingspan = Column(Float, nullable=True)
    chord_length = Column(Float, nullable=True)
    cell_count = Column(Integer, nullable=True)
    aspect_ratio = Column(Float, nullable=True)
    wing_loading = Column(Float, nullable=True)
    glide_ratio = Column(Float, nullable=True)
    forward_speed = Column(Float, nullable=True)

    project = relationship('Project', back_populates='design_result')
