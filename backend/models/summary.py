from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.config.database import Base

class Summary(Base):
    __tablename__ = "summaries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    url = Column(String, index=True)
    original_content = Column(Text)
    summary_content = Column(Text)
    mode = Column(String)
    created_at = Column(DateTime, default=func.now())

    owner = relationship("User", back_populates="summaries")
