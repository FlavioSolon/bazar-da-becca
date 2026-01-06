import { createClient } from '@supabase/supabase-js'
import { S3Client } from '@aws-sdk/client-s3'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// S3 Configuration
export const s3Config = {
    endpoint: `${import.meta.env.PUBLIC_SUPABASE_URL}/storage/v1/s3`,
    region: import.meta.env.AWS_REGION,
    credentials: {
        accessKeyId: import.meta.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.AWS_SECRET_ACCESS_KEY
    },
    forcePathStyle: true
}

export const s3 = new S3Client(s3Config)
