# AI Avatar Browser Extension

Chrome extension that provides proactive AI commentary on ESPN NBA boxscore pages.

## Development Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Chrome browser

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the extension:
   ```bash
   npm run build
   ```

3. For development with auto-rebuild:
   ```bash
   npm run dev
   ```

### Loading in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `dist/` folder from this project
5. The extension should now appear in your extensions list

## Testing

### ESPN NBA Boxscore Pages
The extension is designed to work with ESPN NBA boxscore pages. Test URLs:
- Example: `https://www.espn.com/nba/boxscore/_/gameId/401705278`

### Expected Behavior
1. Navigate to an ESPN NBA boxscore page
2. The extension should automatically detect the page
3. An AI avatar placeholder should appear in the top-right corner
4. Click the extension icon to open the popup
5. The popup should show the current page status

## Project Structure

```
extension/
├── src/
│   ├── background-script.ts    # URL detection, extension lifecycle
│   ├── content-script.ts       # ESPN page integration
│   ├── popup.tsx               # Extension popup interface
│   ├── popup.html              # Popup HTML template
│   └── types/
│       └── index.ts            # TypeScript definitions
├── public/                     # Static assets (icons)
├── dist/                       # Built files (generated)
├── manifest.json               # Extension configuration
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── webpack.config.js           # Build configuration
```

## Build Output

The build process generates:
- `background-script.js` - Background service worker
- `content-script.js` - Content script for ESPN pages
- `popup.js` - Popup interface logic
- `popup.html` - Popup HTML file
- All assets copied to `dist/`

## Development Notes

- **Manifest V3**: Uses the latest Chrome extension manifest version
- **TypeScript**: Full TypeScript support for better development experience
- **React**: Popup interface built with React for maintainability
- **Content Script**: Automatically injects on ESPN NBA boxscore pages
- **Background Script**: Handles URL detection and extension lifecycle

## Future Enhancements

This MVP provides the foundation for:
- AI commentary generation
- Wikipedia integration
- Audio synthesis
- Enhanced avatar UI
- User preferences and customization

## Troubleshooting

### Extension Not Loading
- Check that all files are built in the `dist/` folder
- Verify manifest.json is copied to `dist/`
- Check Chrome console for errors

### Content Script Not Working
- Verify the page URL matches the pattern in manifest.json
- Check that content script is properly injected
- Look for console errors in the page context

### Build Errors
- Ensure all dependencies are installed
- Check TypeScript configuration
- Verify webpack configuration
