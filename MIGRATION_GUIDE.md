# Migration Guide: Supabase to Vercel

This application has been successfully migrated from Supabase to Vercel's blob storage and authentication system. Here's what changed and how to set it up.

## What Changed

### 🔐 Authentication System
- **Before**: Simple password protection with exposed credentials
- **After**: Secure session-based authentication using Vercel KV storage
- **Security**: Passwords are now hashed with SHA-256 and salted
- **Session Management**: Secure HTTP-only cookies with expiration

### 💾 Data Storage
- **Before**: Supabase PostgreSQL database
- **After**: Vercel Blob Storage (JSON files)
- **Benefits**: Simpler, more cost-effective, no database management needed
- **Data Structure**: All data stored as JSON files in blob storage

### 🚀 API Architecture
- **Before**: Direct Supabase client calls from frontend
- **After**: RESTful API routes with proper authentication middleware
- **Security**: All API endpoints require authentication
- **Error Handling**: Improved error handling and user feedback

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Vercel Services

#### A. Vercel Blob Storage
1. Go to your Vercel dashboard
2. Navigate to Storage → Blob
3. Create a new blob storage
4. Copy the `BLOB_READ_WRITE_TOKEN`

#### B. Vercel KV Storage
1. Go to your Vercel dashboard
2. Navigate to Storage → KV
3. Create a new KV database
4. Copy the `KV_REST_API_URL` and `KV_REST_API_TOKEN`

### 3. Configure Environment Variables

#### A. Generate Password Hash
```bash
node scripts/generate-password-hash.js "YourSecurePassword123"
```

#### B. Create `.env.local` file
```bash
# Copy from .env.example
cp .env.example .env.local
```

#### C. Fill in your values
```env
# Generated password hash and salt
APP_PASSWORD_HASH=your-generated-hash-here
PASSWORD_SALT=your-generated-salt-here

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your-blob-token-here

# Vercel KV Storage
KV_REST_API_URL=your-kv-url-here
KV_REST_API_TOKEN=your-kv-token-here
```

### 4. Deploy to Vercel

#### A. Install Vercel CLI
```bash
npm i -g vercel
```

#### B. Deploy
```bash
vercel
```

#### C. Set Environment Variables in Vercel Dashboard
1. Go to your project in Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Add all the variables from your `.env.local` file

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with password
- `POST /api/auth/logout` - Logout and clear session
- `GET /api/auth/verify` - Verify current session

### Data Management
- `GET /api/assets` - Get all assets
- `POST /api/assets` - Create new asset
- `PUT /api/assets` - Update existing asset
- `DELETE /api/assets?id=<id>` - Delete asset

- `GET /api/snapshots` - Get all portfolio snapshots
- `POST /api/snapshots` - Create new snapshot
- `PUT /api/snapshots` - Update existing snapshot
- `DELETE /api/snapshots?id=<id>` - Delete snapshot

- `GET /api/fx-rates` - Get FX rates
- `POST /api/fx-rates` - Update FX rates

- `GET /api/liquidation-settings` - Get liquidation settings
- `POST /api/liquidation-settings` - Create liquidation setting
- `PUT /api/liquidation-settings` - Update liquidation setting
- `DELETE /api/liquidation-settings?id=<id>` - Delete liquidation setting

## Data Migration

If you have existing data in Supabase, you'll need to export it and import it into the new system. The data structure remains the same, so you can:

1. Export your data from Supabase as JSON
2. Use the API endpoints to import the data
3. Or manually add the data through the UI

## Security Improvements

### ✅ What's Now Secure
- Passwords are hashed with SHA-256 and salted
- Session tokens are cryptographically secure
- All API endpoints require authentication
- Sensitive data is not exposed in frontend code
- Environment variables are properly managed

### 🔒 Security Best Practices
- Use strong passwords (12+ characters, mixed case, numbers, symbols)
- Regularly rotate your password
- Keep your environment variables secure
- Monitor your Vercel usage and costs
- Consider enabling Vercel's security features

## Troubleshooting

### Common Issues

#### 1. Authentication Fails
- Check that `APP_PASSWORD_HASH` and `PASSWORD_SALT` are correctly set
- Ensure the password hash was generated with the same salt
- Verify that KV storage is properly configured

#### 2. Data Not Loading
- Check that `BLOB_READ_WRITE_TOKEN` is correctly set
- Verify that Vercel Blob storage is properly configured
- Check the browser console for API errors

#### 3. API Errors
- Ensure all environment variables are set in Vercel dashboard
- Check that the API routes are properly deployed
- Verify that authentication is working

### Getting Help
- Check the browser console for error messages
- Review the Vercel function logs
- Ensure all environment variables are properly configured
- Verify that Vercel services (Blob, KV) are active

## Benefits of This Migration

1. **Security**: Proper authentication and data protection
2. **Simplicity**: No database management required
3. **Cost**: More cost-effective than Supabase for this use case
4. **Performance**: Faster data access with blob storage
5. **Scalability**: Vercel's infrastructure handles scaling automatically
6. **Maintenance**: Less infrastructure to maintain

## Next Steps

1. Test the application thoroughly
2. Set up monitoring and alerts in Vercel
3. Consider implementing additional security features
4. Plan for data backups (export functionality)
5. Document any custom configurations

The application is now more secure, simpler to deploy, and easier to maintain!