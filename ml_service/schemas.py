from pydantic import BaseModel, Field
from typing import List


class RiskInput(BaseModel):
    projectId: str = Field(..., description="Project identifier")
    commitsLast7Days: float = Field(..., ge=0)
    daysToDeadline: float = Field(..., ge=0)
    taskCompletionRate: float = Field(..., ge=0, le=1)
    openBugs: float = Field(..., ge=0)


class RiskOutput(BaseModel):
    failureRisk: float
    confidence: float
    topReasons: List[str]
    recommendations: List[str]
