from fastapi import (
    FastAPI, UploadFile, File, Depends
)
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

from .database import get_session
from .models import SampleText
from .utils import AudioProcessor

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:4200",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ResponseModel(BaseModel):
    result: str


@app.post("/api/process_audio/")
async def process_audio(file: UploadFile = File()):
    # process file data here
    recognizer = AudioProcessor()
    file_path = recognizer.write_file_to_directory(file)
    result = recognizer.get_tokens(file_path)

    return dict(result=f'{result}')


@app.get('/api/texts/', response_model=list[SampleText])
async def get_texts(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(SampleText))
    texts = result.scalars().all()
    return [
        SampleText(
            title=text.title,
            passage=text.passage,
            duration=text.duration,
            id=text.id
        ) for text in texts
    ]


@app.post('/api/texts/')
async def add_text(text: SampleText, session: AsyncSession = Depends(get_session)):
    text = SampleText(title=text.title, passage=text.passage, duration=text.duration)
    session.add(text)
    await session.commit()
    await session.refresh(text)
    return text
