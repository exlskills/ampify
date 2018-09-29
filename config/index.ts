import * as dotenv from 'dotenv';

// Load whatever's in the .env file
dotenv.config();

export default {
    port: process.env.AMP_PORT || 3000,
    auth: {
        apiBaseURL: process.env.AMP_AUTH_API_BASE_URL || 'https://auth-api.exlskills.com'
    },
    gql: {
        endpoint: process.env.AMP_GQL_ENDPOINT || 'https://gql-api.exlskills.com/graph'
    },
    cors: {
        origin: process.env.AMP_CORS_REGEX
            ? [new RegExp(process.env.AMP_CORS_REGEX)]
            : [/localhost/, /exlskills.com/, /\.exlskills\.com$/]
    },
    logLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
}
