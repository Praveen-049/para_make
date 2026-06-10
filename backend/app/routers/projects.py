from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from .. import crud, schemas, auth
from ..database import get_db

router = APIRouter()

@router.get('/', response_model=list[schemas.ProjectRead])
def read_projects(search: str | None = None, current_user: schemas.UserRead = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    projects = crud.get_user_projects(db, current_user.id, search)
    return projects

@router.get('/stats', response_model=schemas.DashboardStats)
def project_stats(current_user: schemas.UserRead = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    return crud.get_dashboard_stats(db, current_user.id)

@router.post('/', response_model=schemas.ProjectRead, status_code=status.HTTP_201_CREATED)
def create_project(project_in: schemas.ProjectCreate, current_user: schemas.UserRead = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    project = crud.create_project(db, user_id=current_user.id, project_data=project_in)
    return project

@router.get('/{project_id}', response_model=schemas.ProjectRead)
def get_project(project_id: int, current_user: schemas.UserRead = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    project = crud.get_project(db, project_id, current_user.id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Project not found')
    return project

@router.put('/{project_id}', response_model=schemas.ProjectRead)
def update_project(project_id: int, project_data: schemas.ProjectUpdate, current_user: schemas.UserRead = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    project = crud.get_project(db, project_id, current_user.id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Project not found')
    return crud.update_project(db, project, project_data)

@router.delete('/{project_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: int, current_user: schemas.UserRead = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    project = crud.get_project(db, project_id, current_user.id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Project not found')
    crud.delete_project(db, project)
    return None

@router.get('/{project_id}/report')
def download_report(project_id: int, current_user: schemas.UserRead = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    project = crud.get_project(db, project_id, current_user.id)
    if not project or not project.design_input or not project.design_result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Project report not available')
    from ..utils import build_pdf
    file_bytes = build_pdf(project, project.design_input, project.design_result)
    return Response(content=file_bytes, media_type='application/pdf', headers={
        'Content-Disposition': f'attachment; filename="project_{project_id}_report.pdf"'
    })
