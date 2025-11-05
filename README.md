# 🧹 CleanUP! - Reclaim Your Google Search

> **Google search has become cluttered with AI overviews, sponsored content, and unnecessary noise. CleanUP! gives you back the clean, focused search experience you deserve.**

---

## ✨ Features

### 🚫 **Block AI Overview**
Tired of AI-generated summaries cluttering your search results? Toggle this feature to completely remove Google's AI Overview from your searches, giving you direct access to real web results.

### 🧹 **Clean Navbar**
Remove unnecessary navigation items like "AI Mode", "Short videos", "Forums", and "Shopping" tabs. Keep only what matters: All, Images, Videos, News, and Maps.

### 🎯 **Remove Sponsored Results** *(Coming Soon)*
Say goodbye to intrusive ads and sponsored content at the top of your search results.

### 🔍 **Smart Website Previews**
Hover over any search result to see:
- **Rich previews** with website screenshots
- **Security indicators** (HTTPS status)
- **Site reliability badges** (Wikipedia, educational institutions, news sources)
- **Political bias detection** for news outlets
- **Content type tags** (Forum, Video, Code, Social, etc.)
- **Detailed descriptions** pulled from the web or Google's snippets

---

## 🚀 Installation

### Quick Setup (5 minutes)

1. **Download the extension**
   ```bash
   git clone https://github.com/yourusername/cleanup-extension.git
   ```
   Or download as ZIP and extract

2. **Open Chrome Extensions**
   - Navigate to `chrome://extensions`
   - Or click Menu → Extensions → Manage Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right corner

4. **Load the Extension**
   - Click "Load unpacked"
   - Select the `cleanup-extension` folder
   - ✅ Done! The extension is now active

5. **Start Searching**
   - Go to [google.com](https://google.com)
   - Search for anything
   - Click the CleanUP! icon to customize your settings

---

## 🎮 Usage

### Toggle Features On/Off
Click the CleanUP! extension icon in your Chrome toolbar to access the control panel:

- **Block AI Overview** - Hide/show AI-generated summaries
- **Clean Navbar** - Remove/restore extra navigation tabs  
- **Smart Previews** - Enable/disable hover tooltips

### Preview Interactions
- **Hover** over any search result for 300ms to trigger the preview
- **Move your mouse** onto the preview tooltip to keep it open
- **Click the link** to visit the site (preview stays open)
- **Move away** to auto-hide the preview

---

## 🛠️ Technical Details

### Built With
- **Vanilla JavaScript** - No frameworks, pure performance
- **Chrome Extension Manifest V3** - Latest extension standards
- **Microlink API** - Rich website metadata and screenshots
- **Chrome Storage API** - Persistent user preferences

### Architecture
```
cleanup-extension/
├── manifest.json          # Extension configuration
├── content.js            # Main content script (runs on Google)
├── popup.html            # Extension popup UI
├── popup.js              # Popup logic & settings
├── styles.css            # Popup styling
└── icons/                # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### How It Works
1. **Content Script Injection**: `content.js` runs on every Google search page
2. **DOM Manipulation**: Identifies and removes unwanted elements (AI Overview, navbar items)
3. **Event Listeners**: Attaches hover listeners to search result links
4. **Real-time Previews**: Fetches metadata via Microlink API with caching
5. **Storage Sync**: Settings persist across browser sessions

---

## 🎨 Smart Preview Features

### Security Indicators
- 🔒 **HTTPS Secure** - Site uses encrypted connection
- ⚠️ **Not Secure** - HTTP connection (use caution)

### Reliability Badges
- ✓ **High Reliability** - Wikipedia, BBC, Reuters, AP News, Nature, Science, .edu domains
- ⬅️ **Left-Leaning** - HuffPost, MSNBC, CNN, NYT, WaPo, The Guardian, Vox
- ➡️ **Right-Leaning** - Fox News, Breitbart, Daily Wire, Newsmax, OANN, NY Post

### Content Type Tags
- 📚 **Encyclopedia** - Wikipedia
- 💻 **Code** - GitHub, coding platforms
- ❓ **Q&A** - Stack Overflow, forums
- 💬 **Forum** - Reddit, discussion boards
- 🎥 **Video** - YouTube, Vimeo
- 🐦 **Social** - Twitter/X, social networks
- 💼 **Professional** - LinkedIn

---

## ⚙️ Configuration

### Default Settings
All features are **enabled by default**:
- ✅ AI Overview blocking
- ✅ Navbar cleanup
- ✅ Smart previews

### Customization
Toggle any feature on/off through the extension popup. Changes apply:
- **AI Overview & Navbar**: Requires page reload
- **Smart Previews**: Changes apply instantly (no reload needed)

### Storage
Settings are saved to `chrome.storage.sync` and persist across:
- Browser sessions
- Different devices (if Chrome sync is enabled)
- Extension updates

---

## 🐛 Troubleshooting

### Extension not working?
1. **Refresh the page** - Press F5 or Ctrl+R
2. **Check if enabled** - Click the extension icon to verify settings
3. **Reload extension** - Go to `chrome://extensions` and click the reload button

### Previews not showing?
1. **Check the toggle** - Ensure "Smart Previews" is enabled
2. **Wait 300ms** - Previews trigger after a short hover delay
3. **API limit reached** - Free tier allows 50 requests/day per IP

### "Extension context invalidated" error?
This occurs when the extension is updated while a page is open:
1. Close all Google search tabs
2. Reopen a fresh search page
3. The extension will reinitialize properly

---

## 🔒 Privacy & Permissions

### Required Permissions
- **`activeTab`** - Access current Google search page
- **`storage`** - Save your preferences
- **`tabs`** - Reload tabs when settings change

### Data Collection
**CleanUP! collects ZERO personal data.** 
- No tracking
- No analytics  
- No data sent to external servers (except Microlink API for previews)
- All settings stored locally in your browser

### Third-Party Services
- **Microlink API** - Used only for website previews (screenshots, metadata)
- Free tier: 50 requests/day per IP
- No account required
- [Privacy Policy](https://microlink.io/privacy)

---

## 🚧 Roadmap

### Coming Soon
- [ ] Remove sponsored results completely
- [ ] Custom domain blocking
- [ ] Keyboard shortcuts
- [ ] Export/import settings
- [ ] Firefox support
- [ ] Safari support

### Under Consideration
- [ ] Custom CSS themes
- [ ] Pin favorite search filters
- [ ] Search history tracking (privacy-first)
- [ ] Result filtering by date/domain

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Setup
```bash
# Clone the repo
git clone https://github.com/yourusername/cleanup-extension.git

# Make your changes
# Test in Chrome by loading unpacked extension

# Submit PR with:
# - Clear description of changes
# - Screenshots if UI changes
# - Testing steps
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

Having issues? Found a bug? Have a feature request?

-
