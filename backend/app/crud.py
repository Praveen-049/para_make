from sqlalchemy.orm import Session
from . import models, schemas, auth
from .calculations import build_basic_design


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user_data: schemas.UserCreate):
    password_hash = auth.get_password_hash(user_data.password)
    user = models.User(name=user_data.name, email=user_data.email, password_hash=password_hash)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email=email)
    if not user or not auth.verify_password(password, user.password_hash):
        return None
    return user


def create_project(db: Session, user_id: int, project_data: schemas.ProjectCreate):
    project = models.Project(user_id=user_id, name=project_data.name, description=project_data.description or '', project_type=project_data.project_type)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def get_user_projects(db: Session, user_id: int, search: str = None):
    query = db.query(models.Project).filter(models.Project.user_id == user_id)
    if search:
        pattern = f"%{search}%"
        query = query.filter(models.Project.name.ilike(pattern) | models.Project.description.ilike(pattern))
    return query.order_by(models.Project.created_at.desc()).all()


def get_project(db: Session, project_id: int, user_id: int):
    return db.query(models.Project).filter(models.Project.id == project_id, models.Project.user_id == user_id).first()


def update_project(db: Session, project: models.Project, project_data: schemas.ProjectUpdate):
    project.name = project_data.name
    project.description = project_data.description or project.description
    project.project_type = project_data.project_type
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def delete_project(db: Session, project: models.Project):
    db.delete(project)
    db.commit()


def create_or_update_design(db: Session, project: models.Project, design_input: schemas.DesignInputCreate):
    result_payload = build_basic_design(design_input)
    if project.design_input:
        project.design_input.payload_mass = design_input.payload_mass
        project.design_input.payload_dimensions = design_input.payload_dimensions
        project.design_input.payload_shape = design_input.payload_shape
        project.design_input.center_of_gravity = design_input.center_of_gravity
        project.design_input.altitude = design_input.altitude
        project.design_input.landing_velocity_requirement = design_input.landing_velocity_requirement
        project.design_input.deployment_velocity = design_input.deployment_velocity
        project.design_input.safety_factor = design_input.safety_factor
        project.design_input.target_accuracy = design_input.target_accuracy
        project.design_input.temperature = design_input.temperature
        project.design_input.air_density = design_input.air_density
        project.design_input.wind_speed = design_input.wind_speed
        project.design_input.wind_direction = design_input.wind_direction
        project.design_input.humidity = design_input.humidity
        project.design_input.parachute_type = design_input.parachute_type
        project.design_input.material = design_input.material
        project.design_input.max_packed_volume = design_input.max_packed_volume
        project.design_input.max_weight = design_input.max_weight
        project.design_input.manufacturing_constraints = design_input.manufacturing_constraints
    else:
        project.design_input = models.DesignInput(project=project, **design_input.dict())

    if project.design_result:
        for name, value in result_payload.items():
            setattr(project.design_result, name, value)
    else:
        project.design_result = models.DesignResult(project=project, **result_payload)

    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def get_dashboard_stats(db: Session, user_id: int):
    projects = db.query(models.Project).filter(models.Project.user_id == user_id).all()
    total = len(projects)
    parafoil = sum(1 for project in projects if project.design_input and project.design_input.parachute_type == 'Ram Air Parafoil')
    margins = [project.design_result.safety_margin for project in projects if project.design_result]
    average = round(sum(margins) / len(margins), 2) if margins else 0.0
    return {
        'total_projects': total,
        'active_projects': total,
        'parafoil_projects': parafoil,
        'average_safety_margin': average,
    }
