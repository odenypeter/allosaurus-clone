from typing import Optional
from sqlmodel import SQLModel, Field


class SampleText(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    title: str
    passage: str
    duration: Optional[int] = None

