# Quick Setup Guide

## Installation Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```
   
   The site will be available at [http://localhost:3000](http://localhost:3000)

3. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Customizing Content

Edit `lib/content.ts` to customize:

### Registration URL
```typescript
REGISTRATION_URL: "#register"  // Change to your actual registration form URL
```

### Contact Information
```typescript
supportEmail: "support@tesda.gov.ph"
hotline: "1-800-TESDA-00"
```

### Registration Steps
Add, remove, or modify steps in the `REGISTRATION_STEPS` array.

### Requirements
Update the `REQUIREMENTS` array with your specific document requirements.

### FAQs
Modify the `FAQS` array to add or change frequently asked questions.

## Deployment Options

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Other Platforms
- **Netlify**: Supports Next.js with zero config
- **AWS Amplify**: Full Next.js support
- **Self-hosted**: Use `npm run build && npm start`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Port already in use
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- -p 3001
```

### Build errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### TypeScript errors
```bash
# Check for type errors
npx tsc --noEmit
```
