"""
YAML configuration loader utility
"""

import os
import yaml
from typing import Dict, Any
from pathlib import Path
import structlog

logger = structlog.get_logger(__name__)


class YAMLConfigLoader:
    """Utility class for loading YAML configuration files"""
    
    def __init__(self, config_path: str = None):
        """
        Initialize the YAML loader
        
        Args:
            config_path: Path to the YAML config file. If None, will look for 
                        shared_config/voice_personalities.yaml relative to project root
        """
        if config_path is None:
            # Look for shared config relative to project root
            project_root = Path(__file__).parent.parent.parent.parent
            config_path = project_root / "shared_config" / "voice_personalities.yaml"
        
        self.config_path = Path(config_path)
        self._config_cache: Dict[str, Any] = {}
        
    def load_config(self) -> Dict[str, Any]:
        """
        Load the YAML configuration file
        
        Returns:
            Dictionary containing the parsed YAML configuration
            
        Raises:
            FileNotFoundError: If the config file doesn't exist
            yaml.YAMLError: If the YAML file is malformed
        """
        if not self.config_path.exists():
            raise FileNotFoundError(f"Configuration file not found: {self.config_path}")
        
        try:
            with open(self.config_path, 'r', encoding='utf-8') as file:
                config = yaml.safe_load(file)
                logger.info("Loaded YAML configuration", path=str(self.config_path))
                return config
        except yaml.YAMLError as e:
            logger.error("Failed to parse YAML configuration", error=str(e), path=str(self.config_path))
            raise
        except Exception as e:
            logger.error("Failed to load YAML configuration", error=str(e), path=str(self.config_path))
            raise
    
    def get_voices(self) -> Dict[str, Dict[str, str]]:
        """Get voice configurations from YAML"""
        config = self.load_config()
        return config.get('voices', {})
    
    def get_difficulty_levels(self) -> Dict[str, Dict[str, str]]:
        """Get difficulty level configurations from YAML"""
        config = self.load_config()
        return config.get('difficulty_levels', {})
    
    def get_sports_contexts(self) -> Dict[str, Dict[str, Any]]:
        """Get sports context configurations from YAML"""
        config = self.load_config()
        return config.get('sports_contexts', {})
    
    def reload_config(self) -> Dict[str, Any]:
        """Force reload the configuration from disk"""
        self._config_cache.clear()
        return self.load_config()


# Global instance for easy access
yaml_loader = YAMLConfigLoader()
