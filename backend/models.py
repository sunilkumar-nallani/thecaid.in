from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
import uuid

# Company Information Models
class AboutInfo(BaseModel):
    name: str
    mission: str
    description: str
    urgency: str

class ContactInfo(BaseModel):
    email: str
    demo: str
    pitch: str

class SystemInfo(BaseModel):
    version: str
    status: str
    welcome_message: str

class CompanyInfo(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    about: AboutInfo
    contact: ContactInfo
    system: SystemInfo
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Roadmap Models
class RoadmapMilestone(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    target: str
    product: str
    function: str
    status: str
    priority: int = 1
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class RoadmapResponse(BaseModel):
    milestones: List[RoadmapMilestone]

# Team Models
class TeamMember(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: str
    focus: str
    bio: Optional[str] = None
    image: Optional[str] = None
    linkedin: Optional[str] = None
    is_founder: bool = True
    display_order: int = 1
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TeamResponse(BaseModel):
    founders: List[TeamMember]

# Analytics Models
class TerminalAnalytics(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    command: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    session_id: str
    user_agent: Optional[str] = None
    response_time: Optional[int] = None

class AnalyticsCreate(BaseModel):
    command: str
    session_id: str
    user_agent: Optional[str] = None
    response_time: Optional[int] = None

# Investor Inquiry Models
class InvestorInquiry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    company: Optional[str] = None
    message: str
    inquiry_type: str  # 'funding', 'demo', 'general'
    status: str = "new"  # 'new', 'contacted', 'scheduled', 'closed'
    source: str = "terminal_website"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class InvestorInquiryCreate(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = None
    message: str
    inquiry_type: str

# Command Response Models
class CommandResponse(BaseModel):
    command: str
    response: List[dict]
    success: bool = True
    message: Optional[str] = None

# Funding Info Model
class FundingInfo(BaseModel):
    stage: str
    target: str
    focus: str
    market: str
    seeking: List[str]