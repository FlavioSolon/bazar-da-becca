import { createClient } from '@supabase/supabase-js';
import { S3Client } from '@aws-sdk/client-s3';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME } from '$env/static/private';

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

// S3 Configuration
export const s3Config = {
    endpoint: `${PUBLIC_SUPABASE_URL}/storage/v1/s3`,
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    },
    forcePathStyle: true
};

export const s3 = new S3Client(s3Config);
export const bucketName = AWS_BUCKET_NAME || 'products';
