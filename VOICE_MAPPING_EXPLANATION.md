# Voice Mapping System Explanation

## Overview

The system now properly separates **OpenAI technical voice identifiers** from **user-friendly display names**. This creates a clear mapping between what the API expects and what users see.

## How It Works

### 1. YAML Configuration (`shared_config/voice_personalities.yaml`)

```yaml
voices:
  # OpenAI Voice: verse -> User-Friendly Name: Don Jones
  verse:
    openai_voice: "verse"        # What OpenAI API expects
    display_name: "Don Jones"     # What users see in UI
    description: "The balanced veteran..."
    
  # OpenAI Voice: cedar -> User-Friendly Name: Mike Smith  
  cedar:
    openai_voice: "cedar"        # What OpenAI API expects
    display_name: "Mike Smith"   # What users see in UI
    description: "The authoritative analyst..."
    
  # OpenAI Voice: marin -> User-Friendly Name: Rocket Jones
  marin:
    openai_voice: "marin"        # What OpenAI API expects
    display_name: "Rocket Jones" # What users see in UI
    description: "The high-energy play-by-play..."
```

### 2. Backend Flow

1. **User selects**: "Mike Smith" in UI
2. **Frontend sends**: `voice: "cedar"` to backend API
3. **Backend maps**: `cedar` → loads config from YAML
4. **Backend sends**: `voice: "cedar"` to OpenAI API
5. **OpenAI responds**: Using the "cedar" voice model

### 3. Frontend Flow

1. **User sees**: "Don Jones", "Mike Smith", "Rocket Jones" buttons
2. **User clicks**: "Mike Smith" 
3. **Frontend maps**: "Mike Smith" → `voice: "cedar"`
4. **API call**: Sends `voice: "cedar"` to backend
5. **Response shows**: "Mike Smith" in the UI

## Key Benefits

### ✅ Clear Separation
- **OpenAI API**: Always receives `verse`, `cedar`, `marin`
- **User Interface**: Always shows "Don Jones", "Mike Smith", "Rocket Jones"
- **No Confusion**: Developers know exactly what each system expects

### ✅ Easy Updates
- **Change display name**: Edit `display_name` in YAML
- **Change personality**: Edit `description` and `personality` in YAML
- **Keep API compatibility**: `openai_voice` never changes

### ✅ Consistent Mapping
- **verse** ↔ **Don Jones** (balanced veteran)
- **cedar** ↔ **Mike Smith** (authoritative analyst)  
- **marin** ↔ **Rocket Jones** (high-energy play-by-play)

## Code References

### Backend (`voice_config.py`)
```python
# Maps OpenAI voice to display name
VoiceType.CEDAR: {
    "openai_voice": "cedar",      # For OpenAI API
    "display_name": "Mike Smith",  # For user display
    "description": "The authoritative analyst..."
}
```

### Frontend (`voiceConfig.ts`)
```typescript
// Maps voice type to display name
export const getVoiceNameSync = (voiceType: VoiceType): string => {
  return getVoiceConfigSync(voiceType).display_name;  // Returns "Mike Smith"
};
```

### UI (`DebateMode.tsx`)
```typescript
// Shows user-friendly names
{config.display_name}  // Shows "Mike Smith" instead of "cedar"
```

## Summary

**The system now properly handles the mapping:**
- **Internal code**: Uses `verse`, `cedar`, `marin` (OpenAI identifiers)
- **User interface**: Shows "Don Jones", "Mike Smith", "Rocket Jones" (friendly names)
- **API calls**: Send `verse`, `cedar`, `marin` to OpenAI (technical identifiers)
- **Single source**: YAML file defines all mappings and personalities

This creates a clean separation between technical implementation and user experience! 🎯
