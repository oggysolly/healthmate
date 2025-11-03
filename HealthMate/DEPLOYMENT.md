# HealthMate Deployment Guide

## Vercel Deployment Instructions

### Step 1: Prepare Your Code

1. Make sure all environment variables are set up
2. Test locally before deploying
3. Ensure MongoDB Atlas is configured and accessible

### Step 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel
```

### Step 3: Configure Environment Variables

After first deployment, go to Vercel Dashboard:

1. Select your project
2. Go to Settings → Environment Variables
3. Add the following variables:

**Production:**
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - A strong random secret (use: `openssl rand -base64 32`)
- `OPENAI_API_KEY` - (Optional) Your OpenAI API key

**Preview/Development:**
- Same variables as production

### Step 4: Configure Build Settings

In Vercel Dashboard → Settings → General:

- **Framework Preset:** Other
- **Build Command:** `cd client && npm run build`
- **Output Directory:** `client/dist`
- **Install Command:** `npm install && cd client && npm install && cd ../api && npm install`

### Step 5: API Routes Configuration

The API routes are automatically detected by Vercel:
- Files in `/api` directory become serverless functions
- All routes are accessible at `/api/*`

### Step 6: Update Frontend API URL

After deployment, you need to update the API URL. Options:

**Option A: Environment Variable (Recommended)**
1. Add `VITE_API_URL` in Vercel environment variables
2. Set it to: `https://your-project.vercel.app/api`
3. Redeploy

**Option B: Update Code**
Update `client/src/utils/api.js` to use the deployed URL in production.

### Step 7: Redeploy

After setting environment variables:
```bash
vercel --prod
```

## Database Setup

### MongoDB Atlas Configuration

1. **Network Access:**
   - Go to Network Access in MongoDB Atlas
   - Add IP Address: `0.0.0.0/0` (allows all IPs - use for serverless)
   - Or add Vercel's IP ranges for better security

2. **Database User:**
   - Create a database user with read/write permissions
   - Save the username and password securely

3. **Connection String:**
   - Get your connection string from Atlas
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/healthmate?retryWrites=true&w=majority`
   - Replace `username`, `password`, and `cluster` with your values

## Post-Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] MongoDB Atlas network access configured
- [ ] API URL updated in frontend
- [ ] Test registration/login
- [ ] Test health tracking features
- [ ] Test alerts system
- [ ] Verify voice alerts work
- [ ] Check mobile responsiveness
- [ ] Test multi-language support

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `VITE_API_URL` to use custom domain

## Monitoring & Logs

- View logs in Vercel Dashboard → Deployments → Click on deployment
- Check MongoDB Atlas for database logs
- Monitor API usage in Vercel Analytics

## Troubleshooting

### Build Fails
- Check build logs in Vercel
- Ensure all dependencies are in package.json
- Verify Node.js version (should be 18.x)

### API Routes Not Working
- Check Vercel function logs
- Verify environment variables are set
- Ensure MongoDB connection string is correct

### CORS Issues
- Check vercel.json headers configuration
- Verify API URL is correct in frontend

### Database Connection Errors
- Verify MongoDB Atlas IP whitelist
- Check connection string format
- Ensure database user has correct permissions

## Security Considerations

1. **JWT Secret:** Use a strong, random secret
2. **MongoDB:** Use strong passwords, enable MFA
3. **Environment Variables:** Never commit to git
4. **CORS:** Configure properly for production
5. **Rate Limiting:** Consider adding rate limiting for production

## Performance Optimization

1. **Database Indexing:** Add indexes for frequently queried fields
2. **Caching:** Consider Redis for session management
3. **CDN:** Vercel automatically provides CDN for static assets
4. **Image Optimization:** Use next/image or similar for images
5. **Code Splitting:** Already handled by Vite

## Scaling

Vercel serverless functions automatically scale, but consider:
- MongoDB Atlas cluster tier for higher traffic
- Connection pooling for database
- Rate limiting for API endpoints
- Caching frequently accessed data

## Backup & Recovery

- MongoDB Atlas provides automatic backups (enabled on paid tiers)
- Keep environment variables backed up securely
- Version control your code (Git)
- Document any manual configurations

For more help, refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
