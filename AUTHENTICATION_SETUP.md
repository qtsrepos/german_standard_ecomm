# Authentication Setup Guide

## 🚨 **Current Issue: 401 Unauthorized Error**

The German Standard API returns `401 Unauthorized` because the NextAuth session is not properly configured.

## 🔧 **Root Cause**

1. **Missing Environment Variables**: `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are not set
2. **JWT Decryption Failure**: NextAuth cannot decrypt JWT tokens without proper secret
3. **No Valid Session**: API calls fail because no authentication token is available

## ✅ **Solution Steps**

### 1. **Create Environment File**

Create `.env.local` in the project root with:

```bash
# Copy from .env.example and fill in the values
cp .env.example .env.local
```

### 2. **Required Environment Variables**

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3035
NEXTAUTH_SECRET=your-super-secret-nextauth-secret-key-minimum-32-characters

# German Standard API
NEXT_PUBLIC_BASE_URL=http://103.120.178.195/Sang.GermanStandard.API/
```

### 3. **Generate NextAuth Secret**

```bash
# Generate a secure secret
openssl rand -base64 32
```

### 4. **Test Authentication**

1. **Restart the development server** after adding environment variables
2. **Navigate to `/login`** and authenticate with German Standard credentials
3. **Return to home page** - categories should now load successfully

## 🧪 **Testing Flow**

### **Before Login (Expected Behavior)**
- ❌ Categories API returns 401 Unauthorized
- ⚠️ User sees "Authentication Required" message
- 🔄 "Login" button redirects to `/login`

### **After Login (Expected Behavior)**
- ✅ German Standard token stored in NextAuth session
- ✅ Categories API succeeds with Bearer token
- ✅ Categories and products display properly

## 🔍 **Debugging**

Check browser console for these logs:
- `🔐 German Standard API - Session check`
- `📋 Request headers`
- `✅ Authorization header set with token`

## 📝 **Current Implementation Status**

✅ **Completed Features:**
- Authentication validation before API calls
- Comprehensive error handling for 401 errors
- Login prompts for unauthenticated users
- Detailed debugging logs
- Graceful fallback UI states

⏳ **Next Steps:**
1. Set up environment variables
2. Test complete authentication flow
3. Verify category loading after login