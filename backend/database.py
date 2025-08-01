from motor.motor_asyncio import AsyncIOMotorClient
from models import *
import os
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)

class Database:
    def __init__(self, mongo_url: str, db_name: str):
        self.client = AsyncIOMotorClient(mongo_url)
        self.db = self.client[db_name]
        
    async def close(self):
        self.client.close()
    
    # Company Information Methods
    async def get_company_info(self) -> Optional[CompanyInfo]:
        try:
            doc = await self.db.company_info.find_one()
            if doc:
                # Convert MongoDB _id to id
                doc['id'] = str(doc.pop('_id'))
                return CompanyInfo(**doc)
            return None
        except Exception as e:
            logger.error(f"Error fetching company info: {e}")
            return None
    
    async def upsert_company_info(self, company_info: CompanyInfo) -> bool:
        try:
            company_dict = company_info.dict()
            company_dict['_id'] = company_dict.pop('id')
            
            await self.db.company_info.replace_one(
                {},  # Empty filter to replace the single document
                company_dict,
                upsert=True
            )
            return True
        except Exception as e:
            logger.error(f"Error upserting company info: {e}")
            return False
    
    # Roadmap Methods
    async def get_roadmap(self) -> List[RoadmapMilestone]:
        try:
            cursor = self.db.roadmap_milestones.find().sort("priority", 1)
            milestones = []
            async for doc in cursor:
                doc['id'] = str(doc.pop('_id'))
                milestones.append(RoadmapMilestone(**doc))
            return milestones
        except Exception as e:
            logger.error(f"Error fetching roadmap: {e}")
            return []
    
    async def create_milestone(self, milestone: RoadmapMilestone) -> bool:
        try:
            milestone_dict = milestone.dict()
            milestone_dict['_id'] = milestone_dict.pop('id')
            
            await self.db.roadmap_milestones.insert_one(milestone_dict)
            return True
        except Exception as e:
            logger.error(f"Error creating milestone: {e}")
            return False
    
    # Team Methods
    async def get_team(self) -> List[TeamMember]:
        try:
            cursor = self.db.team_members.find().sort("display_order", 1)
            members = []
            async for doc in cursor:
                doc['id'] = str(doc.pop('_id'))
                members.append(TeamMember(**doc))
            return members
        except Exception as e:
            logger.error(f"Error fetching team: {e}")
            return []
    
    async def create_team_member(self, member: TeamMember) -> bool:
        try:
            member_dict = member.dict()
            member_dict['_id'] = member_dict.pop('id')
            
            await self.db.team_members.insert_one(member_dict)
            return True
        except Exception as e:
            logger.error(f"Error creating team member: {e}")
            return False
    
    # Analytics Methods
    async def track_command(self, analytics: TerminalAnalytics) -> bool:
        try:
            analytics_dict = analytics.dict()
            analytics_dict['_id'] = analytics_dict.pop('id')
            
            await self.db.terminal_analytics.insert_one(analytics_dict)
            return True
        except Exception as e:
            logger.error(f"Error tracking command: {e}")
            return False
    
    async def get_command_stats(self) -> dict:
        try:
            pipeline = [
                {
                    "$group": {
                        "_id": "$command",
                        "count": {"$sum": 1},
                        "last_used": {"$max": "$timestamp"}
                    }
                },
                {"$sort": {"count": -1}}
            ]
            
            cursor = self.db.terminal_analytics.aggregate(pipeline)
            stats = {}
            async for doc in cursor:
                stats[doc['_id']] = {
                    "count": doc['count'],
                    "last_used": doc['last_used']
                }
            return stats
        except Exception as e:
            logger.error(f"Error fetching command stats: {e}")
            return {}
    
    # Investor Inquiry Methods
    async def create_inquiry(self, inquiry: InvestorInquiry) -> bool:
        try:
            inquiry_dict = inquiry.dict()
            inquiry_dict['_id'] = inquiry_dict.pop('id')
            
            await self.db.investor_inquiries.insert_one(inquiry_dict)
            return True
        except Exception as e:
            logger.error(f"Error creating inquiry: {e}")
            return False
    
    async def get_inquiries(self, limit: int = 100) -> List[InvestorInquiry]:
        try:
            cursor = self.db.investor_inquiries.find().sort("created_at", -1).limit(limit)
            inquiries = []
            async for doc in cursor:
                doc['id'] = str(doc.pop('_id'))
                inquiries.append(InvestorInquiry(**doc))
            return inquiries
        except Exception as e:
            logger.error(f"Error fetching inquiries: {e}")
            return []