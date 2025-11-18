# Deployment Guide

## Netlify Deployment

### Quick Start (Web UI)

1. **Deploy to Netlify**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select `adamzwasserman/stateless`
   - Netlify will auto-detect settings from `netlify.toml`
   - Click "Deploy site"

2. **Add Custom Domain**
   - Go to Site settings → Domain management
   - Click "Add custom domain"
   - Enter: `stateless.software`
   - Follow DNS instructions

3. **DNS Configuration**
   At your domain registrar (e.g., Namecheap, Cloudflare, etc.):
   ```
   Type: CNAME
   Name: @ (or leave empty for root domain)
   Value: [your-site-name].netlify.app
   ```

   Or use Netlify DNS:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5

   Type: CNAME
   Name: www
   Value: [your-site-name].netlify.app
   ```

### Automatic Deployments

Every push to `main` branch will automatically deploy to production.

### Local Preview

```bash
cd website
python3 -m http.server 8000
```

Visit http://localhost:8000

## npm Package Deployment

### Build

```bash
npm run build
```

### Publish to npm

```bash
# First time
npm publish --access public

# Updates
npm version patch  # or minor, or major
npm publish
```

### Pre-publish Checklist

- [ ] All tests passing (`npm test`)
- [ ] Build successful (`npm run build`)
- [ ] Version bumped in `package.json`
- [ ] CHANGELOG updated (if exists)
- [ ] Git committed and pushed

## Site Structure

```
/website
  ├── index.html    # Landing page
  ├── style.css     # Styles (multicardz aesthetic)
  └── script.js     # Interactive features

/src                # Package source code
/dist               # Built package (npm)
```

## URLs

- **Website**: https://stateless.software
- **GitHub**: https://github.com/adamzwasserman/stateless
- **npm**: https://www.npmjs.com/package/stateless
