// supabase/functions/_shared/auth.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as jose from "https://deno.land/x/jose@v4.14.4/index.ts";

const JWT_SECRET = Deno.env.get("JWT_SECRET")!;

export interface AuthContext {
    user: any;
    supabase: any;
    isSmartWallet?: boolean;
    walletAddress?: string;
}

export async function authenticate(req: Request): Promise<AuthContext> {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
        throw new Error('Authorization header required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create client with service role for database operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract token from header
    const token = authHeader.replace('Bearer ', '');
    
    try {
        // Verify JWT token
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jose.jwtVerify(token, secret);
        
        // Check if this is a Smart Wallet JWT (has nonce claim)
        const isSmartWallet = !!payload.nonce;
        
        let user;
        let walletAddress;

        if (isSmartWallet) {
            // Smart Wallet authentication - extract custom claims
            const userId = payload['clear-vote/user_id'] || payload.sub;
            
            // Mock user data from JWT claims for Smart Wallet users
            user = {
                id: userId,
                email: payload.email,
                role: payload.role,
                is_active: payload.active !== false,
                institucion: payload['clear-vote/institution'],
                partido: payload['clear-vote/party'],
                // Smart Wallet specific fields
                smart_wallet: true,
                wallet_address: payload.wallet_address // If available
            };

            // For Smart Wallet users, we might not have them in the database yet
            // In a real implementation, you'd create/update the user record here
            console.log('Smart Wallet authentication for user:', userId);
            
        } else {
            // Traditional authentication - lookup user in database
            const { data: dbUser, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', payload.sub)
                .eq('is_active', true)
                .single();

            if (error || !dbUser) {
                throw new Error('User not found or inactive');
            }

            user = dbUser;
        }

        return { 
            user, 
            supabase,
            isSmartWallet,
            walletAddress
        };
    } catch (error) {
        console.error('Authentication error:', error);
        throw new Error('Invalid or expired token');
    }
}

export async function requireElectionOwner(
    supabase: any, 
    userId: string, 
    electionId: string
): Promise<boolean> {
    const { data } = await supabase
        .from('election_owners')
        .select('id')
        .eq('user_id', userId)
        .eq('election_id', electionId)
        .single();

    return !!data;
}

export function generateVoteHash(
    userId: string, 
    electionId: string, 
    candidateId: string,
    walletAddress?: string
): string {
    const timestamp = Date.now().toString();
    // Include wallet address in hash for Smart Wallet votes for additional uniqueness
    const data = walletAddress 
        ? `${userId}:${electionId}:${candidateId}:${walletAddress}:${timestamp}`
        : `${userId}:${electionId}:${candidateId}:${timestamp}`;
    
    return btoa(data).replace(/[+/=]/g, (m) => ({ '+': '-', '/': '_', '=': '' }[m] || m));
}
