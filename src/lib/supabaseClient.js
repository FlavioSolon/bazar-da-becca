import { createClient } from '@supabase/supabase-js';
import { S3Client } from '@aws-sdk/client-s3';

// Hardcoded credentials as requested to bypass build issues
const PUBLIC_SUPABASE_URL = 'https://npancuwcmzpmaozxdfvr.supabase.co';
const PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wYW5jdXdjbXpwbWFvenhkZnZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MTI5MDcsImV4cCI6MjA4MzI4ODkwN30.7esIirY3TMf4BwWMy-vWmJjgadtYIY7Ew2TDjUeDD6Q';

const AWS_REGION = 'us-west-2';
const AWS_ACCESS_KEY_ID = 'sb_publishable_2AcPCWh6OhbXeFFBWraGaA_Sgn6wxU2';
const AWS_SECRET_ACCESS_KEY = 'sb_secret_bmC5lMxUa32gGNk9GpB5PQ_fwg6LayJ';
export const bucketName = 'products'; // Defaulting to products bucket

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

// S3 Configuration
export const s3Config = {
    endpoint: `https://npancuwcmzpmaozxdfvr.storage.supabase.co/storage/v1/s3`,
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    },
    forcePathStyle: true
};

export const s3 = new S3Client(s3Config);
