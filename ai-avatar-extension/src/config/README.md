# Configuration Setup

This directory contains configuration files for the AI Avatar Extension.

## API Keys Configuration

### ⚠️ SECURITY WARNING
**NEVER commit API keys to version control!** The `keys.ts` file contains sensitive information and should be kept private.

### Setup Instructions

1. **Copy the template file:**
   ```bash
   cp keys.template.ts keys.ts
   ```

2. **Edit `keys.ts` and add your actual API keys:**
   - Get your OpenAI API key from: https://platform.openai.com/api-keys
   - Get your ElevenLabs API key from: https://elevenlabs.io/
   - Get your Parker Munns Voice ID from ElevenLabs

3. **Verify the file is ignored:**
   ```bash
   git status
   ```
   The `keys.ts` file should NOT appear in the git status.

### File Structure

- `keys.template.ts` - Template file (safe to commit)
- `keys.ts` - Your actual API keys (NEVER commit this!)
- `README.md` - This file

### Production Considerations

In production, consider:
- Using environment variables
- Implementing secure key management
- User-configurable settings through the extension UI
- Secure storage in `chrome.storage.local`

### Troubleshooting

If you see build errors about missing API keys:
1. Make sure `keys.ts` exists
2. Verify all API keys are filled in
3. Check that the file path is correct
4. Ensure the file is not being tracked by git
