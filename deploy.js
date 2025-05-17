const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if .env.local exists, if not create it
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
    console.log('Creating .env.local file...');
    fs.writeFileSync(
        envPath,
        'MONGODB_URI=mongodb+srv://Soham1234:sohhammmm112234@taskcluster.ahmrhok.mongodb.net/finance-visualizer?retryWrites=true&w=majority&appName=TaskCluster'
    );
}

console.log('Building for production...');
execSync('npm run build', { stdio: 'inherit' });

console.log('Deploying to Vercel...');
try {
    // Deploy with Vercel CLI
    execSync('vercel --prod', { stdio: 'inherit' });
    console.log('Deployment completed successfully!');
} catch (error) {
    console.error('Deployment failed:', error.message);

    // Helpful suggestions
    console.log('\nTroubleshooting suggestions:');
    console.log('1. Make sure you\'re logged in to Vercel (run "vercel login")');
    console.log('2. Check your network connection');
    console.log('3. Ensure MongoDB Atlas IP whitelist includes Vercel\'s IPs (or set to allow all)');
    console.log('4. Try deploying manually through the Vercel dashboard at https://vercel.com/new');
} 