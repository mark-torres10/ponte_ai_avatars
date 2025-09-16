"""
Voice monitoring and performance tracking service
"""

import time
import structlog
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from collections import defaultdict, deque

logger = structlog.get_logger(__name__)


@dataclass
class VoiceMetrics:
    """Voice interaction metrics"""
    request_id: str
    voice_type: str
    difficulty: str
    response_time_ms: int
    audio_quality_score: Optional[float] = None
    user_satisfaction_score: Optional[float] = None
    interruption_count: int = 0
    audio_duration_seconds: Optional[float] = None
    timestamp: datetime = field(default_factory=datetime.now)


@dataclass
class VoicePerformanceStats:
    """Aggregated voice performance statistics"""
    total_requests: int = 0
    average_response_time_ms: float = 0.0
    average_audio_quality: float = 0.0
    average_user_satisfaction: float = 0.0
    interruption_rate: float = 0.0
    voice_distribution: Dict[str, int] = field(default_factory=dict)
    difficulty_distribution: Dict[str, int] = field(default_factory=dict)
    error_rate: float = 0.0
    last_updated: datetime = field(default_factory=datetime.now)


class VoiceMonitoringService:
    """Service for monitoring voice interactions and performance"""
    
    def __init__(self, max_metrics_history: int = 1000):
        self.max_metrics_history = max_metrics_history
        self.metrics_history: deque = deque(maxlen=max_metrics_history)
        self.performance_stats = VoicePerformanceStats()
        self.error_count = 0
        self.total_requests = 0
        
        # Real-time tracking
        self.active_sessions: Dict[str, Dict[str, Any]] = {}
        self.session_start_times: Dict[str, datetime] = {}
        
        logger.info("Voice monitoring service initialized", max_history=max_metrics_history)
    
    def start_session(self, request_id: str, voice_type: str, difficulty: str) -> None:
        """Start tracking a voice session"""
        self.active_sessions[request_id] = {
            "voice_type": voice_type,
            "difficulty": difficulty,
            "start_time": time.time(),
            "interruptions": 0,
            "audio_chunks": 0
        }
        self.session_start_times[request_id] = datetime.now()
        
        logger.info(
            "Voice session started",
            request_id=request_id,
            voice_type=voice_type,
            difficulty=difficulty
        )
    
    def record_interruption(self, request_id: str) -> None:
        """Record an interruption in the current session"""
        if request_id in self.active_sessions:
            self.active_sessions[request_id]["interruptions"] += 1
            
            logger.debug(
                "Voice interruption recorded",
                request_id=request_id,
                interruption_count=self.active_sessions[request_id]["interruptions"]
            )
    
    def record_audio_chunk(self, request_id: str, chunk_size: int) -> None:
        """Record an audio chunk received"""
        if request_id in self.active_sessions:
            self.active_sessions[request_id]["audio_chunks"] += 1
            
            logger.debug(
                "Audio chunk recorded",
                request_id=request_id,
                chunk_size=chunk_size,
                total_chunks=self.active_sessions[request_id]["audio_chunks"]
            )
    
    def end_session(
        self,
        request_id: str,
        audio_quality_score: Optional[float] = None,
        user_satisfaction_score: Optional[float] = None,
        audio_duration_seconds: Optional[float] = None,
        error: Optional[str] = None
    ) -> VoiceMetrics:
        """End a voice session and record metrics"""
        
        if request_id not in self.active_sessions:
            logger.warning("Attempted to end non-existent session", request_id=request_id)
            return None
        
        session_data = self.active_sessions[request_id]
        start_time = session_data["start_time"]
        response_time_ms = int((time.time() - start_time) * 1000)
        
        # Create metrics
        metrics = VoiceMetrics(
            request_id=request_id,
            voice_type=session_data["voice_type"],
            difficulty=session_data["difficulty"],
            response_time_ms=response_time_ms,
            audio_quality_score=audio_quality_score,
            user_satisfaction_score=user_satisfaction_score,
            interruption_count=session_data["interruptions"],
            audio_duration_seconds=audio_duration_seconds
        )
        
        # Record metrics
        self.metrics_history.append(metrics)
        self.total_requests += 1
        
        if error:
            self.error_count += 1
        
        # Clean up session
        del self.active_sessions[request_id]
        if request_id in self.session_start_times:
            del self.session_start_times[request_id]
        
        # Update performance stats
        self._update_performance_stats(metrics, error is not None)
        
        logger.info(
            "Voice session ended",
            request_id=request_id,
            response_time_ms=response_time_ms,
            audio_quality=audio_quality_score,
            user_satisfaction=user_satisfaction_score,
            interruptions=session_data["interruptions"],
            error=error
        )
        
        return metrics
    
    def _update_performance_stats(self, metrics: VoiceMetrics, has_error: bool) -> None:
        """Update aggregated performance statistics"""
        self.performance_stats.total_requests = self.total_requests
        self.performance_stats.error_rate = self.error_count / max(self.total_requests, 1)
        
        # Update response time average
        if self.total_requests == 1:
            self.performance_stats.average_response_time_ms = metrics.response_time_ms
        else:
            # Rolling average
            current_avg = self.performance_stats.average_response_time_ms
            self.performance_stats.average_response_time_ms = (
                (current_avg * (self.total_requests - 1) + metrics.response_time_ms) / self.total_requests
            )
        
        # Update audio quality average
        if metrics.audio_quality_score is not None:
            if self.performance_stats.average_audio_quality == 0.0:
                self.performance_stats.average_audio_quality = metrics.audio_quality_score
            else:
                # Simple rolling average for quality
                self.performance_stats.average_audio_quality = (
                    (self.performance_stats.average_audio_quality + metrics.audio_quality_score) / 2
                )
        
        # Update user satisfaction average
        if metrics.user_satisfaction_score is not None:
            if self.performance_stats.average_user_satisfaction == 0.0:
                self.performance_stats.average_user_satisfaction = metrics.user_satisfaction_score
            else:
                # Simple rolling average for satisfaction
                self.performance_stats.average_user_satisfaction = (
                    (self.performance_stats.average_user_satisfaction + metrics.user_satisfaction_score) / 2
                )
        
        # Update voice distribution
        voice_type = metrics.voice_type
        self.performance_stats.voice_distribution[voice_type] = (
            self.performance_stats.voice_distribution.get(voice_type, 0) + 1
        )
        
        # Update difficulty distribution
        difficulty = metrics.difficulty
        self.performance_stats.difficulty_distribution[difficulty] = (
            self.performance_stats.difficulty_distribution.get(difficulty, 0) + 1
        )
        
        # Update interruption rate
        total_interruptions = sum(m.interruption_count for m in self.metrics_history)
        self.performance_stats.interruption_rate = total_interruptions / max(self.total_requests, 1)
        
        self.performance_stats.last_updated = datetime.now()
    
    def get_performance_stats(self) -> VoicePerformanceStats:
        """Get current performance statistics"""
        return self.performance_stats
    
    def get_recent_metrics(self, limit: int = 100) -> List[VoiceMetrics]:
        """Get recent voice metrics"""
        return list(self.metrics_history)[-limit:]
    
    def get_voice_performance_by_type(self) -> Dict[str, Dict[str, float]]:
        """Get performance metrics grouped by voice type"""
        voice_stats = defaultdict(lambda: {
            "count": 0,
            "avg_response_time": 0.0,
            "avg_quality": 0.0,
            "avg_satisfaction": 0.0,
            "interruption_rate": 0.0
        })
        
        for metrics in self.metrics_history:
            voice_type = metrics.voice_type
            stats = voice_stats[voice_type]
            
            stats["count"] += 1
            stats["avg_response_time"] = (
                (stats["avg_response_time"] * (stats["count"] - 1) + metrics.response_time_ms) / stats["count"]
            )
            
            if metrics.audio_quality_score is not None:
                if stats["avg_quality"] == 0.0:
                    stats["avg_quality"] = metrics.audio_quality_score
                else:
                    stats["avg_quality"] = (stats["avg_quality"] + metrics.audio_quality_score) / 2
            
            if metrics.user_satisfaction_score is not None:
                if stats["avg_satisfaction"] == 0.0:
                    stats["avg_satisfaction"] = metrics.user_satisfaction_score
                else:
                    stats["avg_satisfaction"] = (stats["avg_satisfaction"] + metrics.user_satisfaction_score) / 2
            
            stats["interruption_rate"] = metrics.interruption_count / max(stats["count"], 1)
        
        return dict(voice_stats)
    
    def get_health_status(self) -> Dict[str, Any]:
        """Get health status of voice monitoring"""
        active_sessions = len(self.active_sessions)
        recent_errors = sum(1 for m in list(self.metrics_history)[-10:] if m.response_time_ms > 10000)
        
        return {
            "status": "healthy" if recent_errors < 3 else "degraded",
            "active_sessions": active_sessions,
            "total_requests": self.total_requests,
            "error_rate": self.performance_stats.error_rate,
            "average_response_time_ms": self.performance_stats.average_response_time_ms,
            "recent_errors": recent_errors,
            "last_updated": self.performance_stats.last_updated.isoformat()
        }
    
    def reset_metrics(self) -> None:
        """Reset all metrics (for testing)"""
        self.metrics_history.clear()
        self.active_sessions.clear()
        self.session_start_times.clear()
        self.performance_stats = VoicePerformanceStats()
        self.error_count = 0
        self.total_requests = 0
        
        logger.info("Voice monitoring metrics reset")
