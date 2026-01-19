import { MongoClient, Db } from 'mongodb';
import { unstable_cache } from 'next/cache';

const uri = process.env.DATABASE_URL || '';
const options = {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Connection pool - reused across requests
const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
};

if (uri) {
    if (process.env.NODE_ENV === 'development') {
        if (!globalWithMongo._mongoClientPromise) {
            client = new MongoClient(uri, options);
            globalWithMongo._mongoClientPromise = client.connect();
        }
        clientPromise = globalWithMongo._mongoClientPromise;
    } else {
        if (!globalWithMongo._mongoClientPromise) {
            client = new MongoClient(uri, options);
            globalWithMongo._mongoClientPromise = client.connect();
        }
        clientPromise = globalWithMongo._mongoClientPromise;
    }
}

// Get database instance
async function getDb(): Promise<Db | null> {
    if (!uri) return null;
    const client = await clientPromise;
    return client.db('scholarly_help');
}

// Cached home data fetcher - dramatically improves TTFB
export const getHomeData = unstable_cache(
    async () => {
        try {
            const db = await getDb();
            if (!db) return null;
            
            const query = { 
                $or: [
                    { id: "home_page" }, 
                    { id: "home" },
                    { id: "main" },
                    { slug: "home_page" },
                    { slug: "home" },
                    { slug: "main" }
                ]
            };
            
            const content = await db.collection('home').findOne(query);
            return content as any;
        } catch (error) {
            console.error('Error fetching home data:', error);
            return null;
        }
    },
    ['home-page-data'],
    { 
        revalidate: 60, // Cache for 60 seconds
        tags: ['home-page']
    }
);

// Generic page data fetcher with caching
export async function getPageData(collection: string, query: object) {
    try {
        const db = await getDb();
        if (!db) return null;
        
        const content = await db.collection(collection).findOne(query);
        return content as any;
    } catch (error) {
        console.error(`Error fetching ${collection} data:`, error);
        return null;
    }
}

export default clientPromise!;
