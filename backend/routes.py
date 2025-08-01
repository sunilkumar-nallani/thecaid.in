from fastapi import APIRouter, HTTPException, Request
from database import Database
from models import *
from typing import List
import os
import time
import logging
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logger = logging.getLogger(__name__)

# Initialize database
mongo_url = os.environ.get('MONGO_URL')
db_name = os.environ.get('DB_NAME', 'caid_db')

if not mongo_url:
    raise ValueError("MONGO_URL environment variable is required")

database = Database(mongo_url, db_name)

router = APIRouter(prefix="/api")

# Company Information Endpoints
@router.get("/company/info", response_model=CompanyInfo)
async def get_company_info():
    """Get company information"""
    try:
        company_info = await database.get_company_info()
        if not company_info:
            # Return default company info if none exists
            return CompanyInfo(
                about=AboutInfo(
                    name="CAID - Content Authenticity Initiative for Detection",
                    mission="A deep-tech initiative solving the $5.7T synthetic media problem by 2030.",
                    description="Our mission: Distinguish real from synthetic media with precision.",
                    urgency="The problem is critical. The market is massive. The action is now."
                ),
                contact=ContactInfo(
                    email="team@caid.io",
                    demo="Schedule demo video call",
                    pitch="Request pitch deck"
                ),
                system=SystemInfo(
                    version="1.0",
                    status="secure",
                    welcome_message="Welcome to the frontline against synthetic media."
                )
            )
        return company_info
    except Exception as e:
        logger.error(f"Error in get_company_info: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Roadmap Endpoints
@router.get("/roadmap", response_model=RoadmapResponse)
async def get_roadmap():
    """Get roadmap milestones"""
    try:
        milestones = await database.get_roadmap()
        if not milestones:
            # Return default milestones if none exist
            default_milestones = [
                RoadmapMilestone(
                    target="SEP 2025",
                    product="Blockchain-based Browser Plugin (Beta)",
                    function="Enables a community of users to help identify and flag potential AI-generated media, creating a distributed ledger of trust.",
                    status="In Development",
                    priority=1
                ),
                RoadmapMilestone(
                    target="Q1/Q2 2026",
                    product="Automated Detection Engine v1.0",
                    function="An advanced algorithm for automatic synthetic media detection, powered by extensive R&D.",
                    status="R&D Phase",
                    priority=2
                )
            ]
            # Save default milestones to database
            for milestone in default_milestones:
                await database.create_milestone(milestone)
            milestones = default_milestones
            
        return RoadmapResponse(milestones=milestones)
    except Exception as e:
        logger.error(f"Error in get_roadmap: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Team Endpoints
@router.get("/team", response_model=TeamResponse)
async def get_team():
    """Get team information"""
    try:
        members = await database.get_team()
        if not members:
            # Return default team if none exists
            default_team = [
                TeamMember(
                    name="Sriram Saiteja",
                    role="CEO, Founder",
                    focus="Vision, Strategy, Business Development",
                    display_order=1
                ),
                TeamMember(
                    name="Sunil Kumar Nallani",
                    role="CTO, Co-founder",
                    focus="Technology, R&D, Product Development",
                    display_order=2
                )
            ]
            # Save default team to database
            for member in default_team:
                await database.create_team_member(member)
            members = default_team
            
        return TeamResponse(founders=members)
    except Exception as e:
        logger.error(f"Error in get_team: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Analytics Endpoints
@router.post("/analytics/command")
async def track_command(analytics_data: AnalyticsCreate, request: Request):
    """Track terminal command usage"""
    try:
        start_time = time.time()
        
        analytics = TerminalAnalytics(
            command=analytics_data.command,
            session_id=analytics_data.session_id,
            user_agent=analytics_data.user_agent or request.headers.get("user-agent"),
            response_time=analytics_data.response_time
        )
        
        success = await database.track_command(analytics)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to track command")
            
        processing_time = int((time.time() - start_time) * 1000)
        return {"success": True, "processing_time_ms": processing_time}
    except Exception as e:
        logger.error(f"Error in track_command: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/analytics/stats")
async def get_command_stats():
    """Get command usage statistics"""
    try:
        stats = await database.get_command_stats()
        return {"stats": stats}
    except Exception as e:
        logger.error(f"Error in get_command_stats: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Investor Inquiry Endpoints
@router.post("/inquiries")
async def create_inquiry(inquiry_data: InvestorInquiryCreate):
    """Create investor inquiry"""
    try:
        inquiry = InvestorInquiry(**inquiry_data.dict())
        success = await database.create_inquiry(inquiry)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to create inquiry")
            
        return {"success": True, "message": "Inquiry submitted successfully", "id": inquiry.id}
    except Exception as e:
        logger.error(f"Error in create_inquiry: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/inquiries", response_model=List[InvestorInquiry])
async def get_inquiries():
    """Get investor inquiries (Admin only - future feature)"""
    try:
        inquiries = await database.get_inquiries()
        return inquiries
    except Exception as e:
        logger.error(f"Error in get_inquiries: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Dynamic Command Response Endpoint
@router.get("/commands/{command_name}")
async def get_command_response(command_name: str):
    """Get formatted response for specific commands"""
    try:
        start_time = time.time()
        
        if command_name == "funding":
            response = [
                {"type": "output", "content": "Investment Opportunity:"},
                {"type": "output", "content": ""},
                {"type": "output", "content": "> Stage: Seed funding round"},
                {"type": "output", "content": "> Target: Building R&D team"},
                {"type": "output", "content": "> Focus: Accelerating product development"},
                {"type": "output", "content": "> Market: $5.7T synthetic media detection by 2030"},
                {"type": "output", "content": ""},
                {"type": "output", "content": "For investment inquiries, use the contact command."}
            ]
        else:
            # Default response for unknown commands
            response = [
                {"type": "error", "content": f"Command not found: {command_name}"},
                {"type": "error", "content": "Type 'help' to see available commands."}
            ]
        
        processing_time = int((time.time() - start_time) * 1000)
        
        return CommandResponse(
            command=command_name,
            response=response,
            success=True
        )
    except Exception as e:
        logger.error(f"Error in get_command_response: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")