#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const testIndex = args.indexOf('--test');
const testNumber = testIndex !== -1 ? parseInt(args[testIndex + 1]) : null;

const clerkTokenIndex = args.indexOf('--clerk-session-token');
const clerkSessionToken = clerkTokenIndex !== -1 ? args[clerkTokenIndex + 1] : '';

if (!testNumber) {
    console.error('Usage: node ticket-002_tests.js --test <test_number> [--clerk-session-token <token>]');
    console.error('Available tests: 4, 5, 6, 7, 8, 9, 10');
    console.error('');
    console.error('Examples:');
    console.error('  node ticket-002_tests.js --test 4');
    console.error('  node ticket-002_tests.js --test 4 --clerk-session-token eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...');
    process.exit(1);
}

// Configuration
const BASE_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:3001';
const API_BASE = `${BASE_URL}/api/users`;
const BACKEND_API_BASE = `${BACKEND_URL}/api/users`;

// Note: For testing with Clerk authentication, you need to:
// 1. Start the dev server: npm run dev
// 2. Sign in through the browser at http://localhost:3000
// 3. Get the session token from browser dev tools
// 4. Use that token with --clerk-session-token flag

// Use the provided Clerk session token or empty string for unauthenticated tests
const AUTH_HEADER = clerkSessionToken;

// Test data
const testUser = {
    email: 'test@example.com',
    role: 'client'
};

const updatedUser = {
    email: 'updated@example.com',
    role: 'talent'
};

// Helper function to run cURL command
function runCurlCommand(command, description) {
    console.log(`\n🔍 ${description}`);
    console.log(`📝 Command: ${command}`);
    console.log('─'.repeat(80));
    
    try {
        const result = execSync(command, { 
            encoding: 'utf8',
            timeout: 10000 // 10 second timeout
        });
        console.log('✅ Success:');
        console.log(result);
        return { success: true, output: result };
    } catch (error) {
        console.log('❌ Error:');
        console.log(error.message);
        if (error.stdout) {
            console.log('STDOUT:', error.stdout);
        }
        if (error.stderr) {
            console.log('STDERR:', error.stderr);
        }
        return { success: false, error: error.message };
    }
}

// Helper function to format JSON for cURL
function formatJson(data) {
    return JSON.stringify(data).replace(/"/g, '\\"');
}

// Test functions
const tests = {
    4: async function() {
        console.log('\n🧪 Test 4: API Endpoints Testing');
        console.log('='.repeat(80));
        
        // Test 4a: Create User (POST /api/users)
        console.log('\n📋 4a. Create User (POST /api/users)');
        const createCommand = `curl -X POST ${API_BASE} \\
  -H "Content-Type: application/json" \\
  ${AUTH_HEADER ? `-H "Authorization: Bearer ${AUTH_HEADER}"` : ''} \\
  -d "${formatJson(testUser)}" \\
  -w "\\nHTTP Status: %{http_code}\\n"`;
        
        const createResult = runCurlCommand(createCommand, 'Creating test user');
        
        // Test 4b: Get User (GET /api/users/[clerkUserId])
        console.log('\n📋 4b. Get User (GET /api/users/[clerkUserId])');
        const getCommand = `curl -X GET ${API_BASE}/${AUTH_HEADER} \\
  -H "Content-Type: application/json" \\
  ${AUTH_HEADER ? `-H "Authorization: Bearer ${AUTH_HEADER}"` : ''} \\
  -w "\\nHTTP Status: %{http_code}\\n"`;
        
        const getResult = runCurlCommand(getCommand, 'Getting test user');
        
        // Test 4c: Update User (PUT /api/users/[clerkUserId])
        console.log('\n📋 4c. Update User (PUT /api/users/[clerkUserId])');
        const updateCommand = `curl -X PUT ${API_BASE}/${AUTH_HEADER} \\
  -H "Content-Type: application/json" \\
  ${AUTH_HEADER ? `-H "Authorization: Bearer ${AUTH_HEADER}"` : ''} \\
  -d "${formatJson(updatedUser)}" \\
  -w "\\nHTTP Status: %{http_code}\\n"`;
        
        const updateResult = runCurlCommand(updateCommand, 'Updating test user');
        
        // Test 4d: Get All Users (GET /api/users)
        console.log('\n📋 4d. Get All Users (GET /api/users)');
        const getAllCommand = `curl -X GET ${API_BASE} \\
  -H "Content-Type: application/json" \\
  ${AUTH_HEADER ? `-H "Authorization: Bearer ${AUTH_HEADER}"` : ''} \\
  -w "\\nHTTP Status: %{http_code}\\n"`;
        
        const getAllResult = runCurlCommand(getAllCommand, 'Getting all users');
        
        // Test 4e: Delete User (DELETE /api/users/[clerkUserId])
        console.log('\n📋 4e. Delete User (DELETE /api/users/[clerkUserId])');
        const deleteCommand = `curl -X DELETE ${API_BASE}/${AUTH_HEADER} \\
  -H "Content-Type: application/json" \\
  ${AUTH_HEADER ? `-H "Authorization: Bearer ${AUTH_HEADER}"` : ''} \\
  -w "\\nHTTP Status: %{http_code}\\n"`;
        
        const deleteResult = runCurlCommand(deleteCommand, 'Deleting test user');
        
        return {
            create: createResult,
            get: getResult,
            update: updateResult,
            getAll: getAllResult,
            delete: deleteResult
        };
    },
    
    5: async function() {
        console.log('\n🧪 Test 5: Error Handling Testing');
        console.log('='.repeat(80));
        
        // Test 5a: Missing Required Fields
        console.log('\n📋 5a. Missing Required Fields');
        const missingFieldsCommand = `curl -X POST ${API_BASE} \\
  -H "Content-Type: application/json" \\
  ${AUTH_HEADER ? `-H "Authorization: Bearer ${AUTH_HEADER}"` : ''} \\
  -d "${formatJson({ email: 'test@example.com' })}" \\
  -w "\\nHTTP Status: %{http_code}\\n"`;
        
        const missingFieldsResult = runCurlCommand(missingFieldsCommand, 'Creating user without role (should fail)');
        
        // Test 5b: Invalid Role
        console.log('\n📋 5b. Invalid Role');
        const invalidRoleCommand = `curl -X POST ${API_BASE} \\
  -H "Content-Type: application/json" \\
  ${AUTH_HEADER ? `-H "Authorization: Bearer ${AUTH_HEADER}"` : ''} \\
  -d "${formatJson({ ...testUser, role: 'invalid_role' })}" \\
  -w "\\nHTTP Status: %{http_code}\\n"`;
        
        const invalidRoleResult = runCurlCommand(invalidRoleCommand, 'Creating user with invalid role');
        
        // Test 5c: Duplicate User
        console.log('\n📋 5c. Duplicate User');
        const duplicateCommand = `curl -X POST ${API_BASE} \\
  -H "Content-Type: application/json" \\
  ${AUTH_HEADER ? `-H "Authorization: Bearer ${AUTH_HEADER}"` : ''} \\
  -d "${formatJson(testUser)}" \\
  -w "\\nHTTP Status: %{http_code}\\n"`;
        
        const duplicateResult = runCurlCommand(duplicateCommand, 'Creating duplicate user');
        
        return {
            missingFields: missingFieldsResult,
            invalidRole: invalidRoleResult,
            duplicate: duplicateResult
        };
    },
    
    6: async function() {
        console.log('\n🧪 Test 6: TypeScript Types Testing');
        console.log('='.repeat(80));
        
        console.log('📋 Checking TypeScript types in src/lib/supabase.ts');
        
        try {
            const supabasePath = path.join(__dirname, '../../src/lib/supabase.ts');
            if (fs.existsSync(supabasePath)) {
                const content = fs.readFileSync(supabasePath, 'utf8');
                
                // Check for type definitions
                const hasDatabaseInterface = content.includes('interface Database');
                const hasUserType = content.includes('interface User') || content.includes('type User');
                const hasUserInsertType = content.includes('interface UserInsert') || content.includes('type UserInsert');
                const hasUserUpdateType = content.includes('interface UserUpdate') || content.includes('type UserUpdate');
                
                console.log('✅ Database interface exists:', hasDatabaseInterface);
                console.log('✅ User type exists:', hasUserType);
                console.log('✅ UserInsert type exists:', hasUserInsertType);
                console.log('✅ UserUpdate type exists:', hasUserUpdateType);
                
                // Check for TypeScript compilation
                try {
                    execSync('npx tsc --noEmit src/lib/supabase.ts', { 
                        encoding: 'utf8',
                        cwd: path.join(__dirname, '../..'),
                        timeout: 5000
                    });
                    console.log('✅ No TypeScript errors in supabase.ts');
                } catch (tsError) {
                    console.log('❌ TypeScript errors found:');
                    console.log(tsError.message);
                }
            } else {
                console.log('❌ supabase.ts file not found');
            }
        } catch (error) {
            console.log('❌ Error checking TypeScript types:', error.message);
        }
    },
    
    7: async function() {
        console.log('\n🧪 Test 7: Jest Tests Verification');
        console.log('='.repeat(80));
        
        console.log('📋 Running Jest tests for Supabase integration');
        
        try {
            const testResult = execSync('npm test src/lib/__tests__/supabase.test.ts', { 
                encoding: 'utf8',
                cwd: path.join(__dirname, '../..'),
                timeout: 30000
            });
            console.log('✅ Jest tests passed:');
            console.log(testResult);
        } catch (error) {
            console.log('❌ Jest tests failed:');
            console.log(error.message);
            if (error.stdout) {
                console.log('STDOUT:', error.stdout);
            }
            if (error.stderr) {
                console.log('STDERR:', error.stderr);
            }
        }
        
        console.log('\n📋 Running Jest tests for API routes');
        
        try {
            const apiTestResult = execSync('npm test src/app/api/users/__tests__/route.test.ts', { 
                encoding: 'utf8',
                cwd: path.join(__dirname, '../..'),
                timeout: 30000
            });
            console.log('✅ API route tests passed:');
            console.log(apiTestResult);
        } catch (error) {
            console.log('❌ API route tests failed:');
            console.log(error.message);
            if (error.stdout) {
                console.log('STDOUT:', error.stdout);
            }
            if (error.stderr) {
                console.log('STDERR:', error.stderr);
            }
        }
    },
    
    8: async function() {
        console.log('\n🧪 Test 8: Database Constraints Testing');
        console.log('='.repeat(80));
        
        console.log('📋 Testing database constraints via API');
        
        // Test 8a: Insert without clerk_user_id
        console.log('\n📋 8a. Insert without clerk_user_id');
        const noUserIdCommand = `curl -X POST ${API_BASE} \\
  -H "Content-Type: application/json" \\
  -d "${formatJson({ email: 'test@example.com', role: 'client' })}" \\
  -w "\\nHTTP Status: %{http_code}\\n"`;
        
        runCurlCommand(noUserIdCommand, 'Inserting user without clerk_user_id');
        
        // Test 8b: Insert with invalid role
        console.log('\n📋 8b. Insert with invalid role');
        const invalidRoleCommand = `curl -X POST ${API_BASE} \\
  -H "Content-Type: application/json" \\
  -d "${formatJson({ clerk_user_id: 'test_123', email: 'test@example.com', role: 'invalid' })}" \\
  -w "\\nHTTP Status: %{http_code}\\n"`;
        
        runCurlCommand(invalidRoleCommand, 'Inserting user with invalid role');
        
        // Test 8c: Insert duplicate clerk_user_id
        console.log('\n📋 8c. Insert duplicate clerk_user_id');
        const duplicateIdCommand = `curl -X POST ${API_BASE} \\
  -H "Content-Type: application/json" \\
  -d "${formatJson({ clerk_user_id: 'duplicate_test', email: 'test1@example.com', role: 'client' })}" \\
  -w "\\nHTTP Status: %{http_code}\\n"`;
        
        runCurlCommand(duplicateIdCommand, 'First insertion with clerk_user_id');
        
        const duplicateIdCommand2 = `curl -X POST ${API_BASE} \\
  -H "Content-Type: application/json" \\
  -d "${formatJson({ clerk_user_id: 'duplicate_test', email: 'test2@example.com', role: 'talent' })}" \\
  -w "\\nHTTP Status: %{http_code}\\n"`;
        
        runCurlCommand(duplicateIdCommand2, 'Second insertion with same clerk_user_id (should fail)');
    },
    
    9: async function() {
        console.log('\n🧪 Test 9: Auto-update Trigger Testing');
        console.log('='.repeat(80));
        
        console.log('📋 Testing auto-update trigger via API');
        
        // Create a test user first
        console.log('\n📋 9a. Creating test user for trigger testing');
        const createCommand = `curl -X POST ${API_BASE} \\
  -H "Content-Type: application/json" \\
  ${AUTH_HEADER ? `-H "Authorization: Bearer ${AUTH_HEADER}"` : ''} \\
  -d "${formatJson({ clerk_user_id: 'trigger_test_user', email: 'trigger@example.com', role: 'client' })}" \\
  -w "\\nHTTP Status: %{http_code}\\n"`;
        
        const createResult = runCurlCommand(createCommand, 'Creating test user');
        
        if (createResult.success) {
            // Update the user
            console.log('\n📋 9b. Updating test user to trigger updated_at');
            const updateCommand = `curl -X PUT ${API_BASE}/trigger_test_user \\
  -H "Content-Type: application/json" \\
  ${AUTH_HEADER ? `-H "Authorization: Bearer ${AUTH_HEADER}"` : ''} \\
  -d "${formatJson({ email: 'updated_trigger@example.com' })}" \\
  -w "\\nHTTP Status: %{http_code}\\n"`;
            
            const updateResult = runCurlCommand(updateCommand, 'Updating test user');
            
            // Get the user to see the updated timestamp
            console.log('\n📋 9c. Getting updated user to verify timestamp');
            const getCommand = `curl -X GET ${API_BASE}/trigger_test_user \\
  -H "Content-Type: application/json" \\
  ${AUTH_HEADER ? `-H "Authorization: Bearer ${AUTH_HEADER}"` : ''} \\
  -w "\\nHTTP Status: %{http_code}\\n"`;
            
            runCurlCommand(getCommand, 'Getting updated user');
            
            // Clean up
            console.log('\n📋 9d. Cleaning up test user');
            const deleteCommand = `curl -X DELETE ${API_BASE}/trigger_test_user \\
  -H "Content-Type: application/json" \\
  ${AUTH_HEADER ? `-H "Authorization: Bearer ${AUTH_HEADER}"` : ''} \\
  -w "\\nHTTP Status: %{http_code}\\n"`;
            
            runCurlCommand(deleteCommand, 'Deleting test user');
        }
    },
    
    10: async function() {
        console.log('\n🧪 Test 10: Frontend Integration Testing');
        console.log('='.repeat(80));
        
        console.log('📋 Testing API calls from browser context');
        console.log('📋 Note: This test simulates browser API calls');
        
        // Test with browser-like headers
        const browserHeaders = `-H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"`;
        
        // Test 10a: Create user with browser headers
        console.log('\n📋 10a. Create user with browser headers');
        const createCommand = `curl -X POST ${API_BASE} \\
  ${browserHeaders} \\
  -d "${formatJson({ clerk_user_id: 'browser_test_user', email: 'browser@example.com', role: 'client' })}" \\
  -w "\\nHTTP Status: %{http_code}\\n"`;
        
        const createResult = runCurlCommand(createCommand, 'Creating user with browser headers');
        
        if (createResult.success) {
            // Test 10b: Get user with browser headers
            console.log('\n📋 10b. Get user with browser headers');
            const getCommand = `curl -X GET ${API_BASE}/browser_test_user \\
  ${browserHeaders} \\
  -w "\\nHTTP Status: %{http_code}\\n"`;
            
            runCurlCommand(getCommand, 'Getting user with browser headers');
            
            // Test 10c: Update user with browser headers
            console.log('\n📋 10c. Update user with browser headers');
            const updateCommand = `curl -X PUT ${API_BASE}/browser_test_user \\
  ${browserHeaders} \\
  -d "${formatJson({ role: 'talent' })}" \\
  -w "\\nHTTP Status: %{http_code}\\n"`;
            
            runCurlCommand(updateCommand, 'Updating user with browser headers');
            
            // Test 10d: Get all users with browser headers
            console.log('\n📋 10d. Get all users with browser headers');
            const getAllCommand = `curl -X GET ${API_BASE} \\
  ${browserHeaders} \\
  -w "\\nHTTP Status: %{http_code}\\n"`;
            
            runCurlCommand(getAllCommand, 'Getting all users with browser headers');
            
            // Clean up
            console.log('\n📋 10e. Clean up browser test user');
            const deleteCommand = `curl -X DELETE ${API_BASE}/browser_test_user \\
  ${browserHeaders} \\
  -w "\\nHTTP Status: %{http_code}\\n"`;
            
            runCurlCommand(deleteCommand, 'Deleting browser test user');
        }
    },
    
    11: async function() {
        console.log('\n🧪 Test 11: Backend Direct Testing');
        console.log('='.repeat(80));
        
        console.log('📋 Testing backend API directly (bypassing frontend authentication)');
        
        // Test 11a: Create user directly on backend
        console.log('\n📋 11a. Create user directly on backend');
        const createCommand = `curl -X POST ${BACKEND_API_BASE} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${AUTH_HEADER}" \\
  -d "${formatJson({ email: 'backend_test@example.com', role: 'client' })}" \\
  -w "\\nHTTP Status: %{http_code}\\n"`;
        
        const createResult = runCurlCommand(createCommand, 'Creating user directly on backend');
        
        if (createResult.success) {
            // Test 11b: Get user directly from backend
            console.log('\n📋 11b. Get user directly from backend');
            const getCommand = `curl -X GET ${BACKEND_API_BASE}/${AUTH_HEADER} \\
  -H "Content-Type: application/json" \\
  -w "\\nHTTP Status: %{http_code}\\n"`;
            
            runCurlCommand(getCommand, 'Getting user directly from backend');
            
            // Test 11c: Update user directly on backend
            console.log('\n📋 11c. Update user directly on backend');
            const updateCommand = `curl -X PUT ${BACKEND_API_BASE}/${AUTH_HEADER} \\
  -H "Content-Type: application/json" \\
  -d "${formatJson({ role: 'talent' })}" \\
  -w "\\nHTTP Status: %{http_code}\\n"`;
            
            runCurlCommand(updateCommand, 'Updating user directly on backend');
            
            // Test 11d: Get all users directly from backend
            console.log('\n📋 11d. Get all users directly from backend');
            const getAllCommand = `curl -X GET ${BACKEND_API_BASE} \\
  -H "Content-Type: application/json" \\
  -w "\\nHTTP Status: %{http_code}\\n"`;
            
            runCurlCommand(getAllCommand, 'Getting all users directly from backend');
            
            // Test 11e: Delete user directly from backend
            console.log('\n📋 11e. Delete user directly from backend');
            const deleteCommand = `curl -X DELETE ${BACKEND_API_BASE}/${AUTH_HEADER} \\
  -H "Content-Type: application/json" \\
  -w "\\nHTTP Status: %{http_code}\\n"`;
            
            runCurlCommand(deleteCommand, 'Deleting user directly from backend');
        }
    }
};

// Main execution
async function main() {
    console.log(`🚀 Running Ticket-002 Test ${testNumber}`);
    console.log(`📍 Base URL: ${BASE_URL}`);
    console.log(`📍 API Base: ${API_BASE}`);
    console.log(`🔐 Authentication: ${AUTH_HEADER ? 'Using Clerk session token' : 'No authentication (will get 401 responses)'}`);
    
    if (!tests[testNumber]) {
        console.error(`❌ Test ${testNumber} not found. Available tests: ${Object.keys(tests).join(', ')}`);
        process.exit(1);
    }
    
    try {
        await tests[testNumber]();
        console.log(`\n✅ Test ${testNumber} completed successfully!`);
    } catch (error) {
        console.error(`\n❌ Test ${testNumber} failed:`, error.message);
        process.exit(1);
    }
}

// Run the test
main(); 