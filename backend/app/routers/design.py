from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import crud, schemas, auth
from ..calculations import build_basic_design
from ..database import get_db

router = APIRouter()

@router.post('/{project_id}/design', response_model=schemas.ProjectRead)
def create_design(project_id: int, design_input: schemas.DesignInputCreate, current_user: schemas.UserRead = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    project = crud.get_project(db, project_id, current_user.id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Project not found')
    project = crud.create_or_update_design(db, project, design_input)
    return project

@router.post('/preview', response_model=schemas.DesignResultRead)
def preview_design(design_input: schemas.DesignInputCreate):
    result_payload = build_basic_design(design_input)
    return result_payload

@router.get('/{project_id}/design', response_model=schemas.ProjectRead)
def read_design(project_id: int, current_user: schemas.UserRead = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    project = crud.get_project(db, project_id, current_user.id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Project not found')
    return project
