import mongoose from 'mongoose';

// Use MongoDB Atlas connection string directly
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Soham1234:sohhammmm112234@taskcluster.ahmrhok.mongodb.net/finance-visualizer?retryWrites=true&w=majority&appName=TaskCluster';

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
        };

        console.log('Connecting to MongoDB Atlas...');

        cached.promise = mongoose.connect(MONGODB_URI, opts)
            .then((mongoose) => {
                console.log('Connected to MongoDB Atlas successfully');
                return mongoose;
            })
            .catch((err) => {
                console.error('MongoDB Atlas connection error:', err);
                cached.promise = null;
                throw err;
            });
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (err) {
        cached.promise = null;
        throw err;
    }
}

export default connectDB; 