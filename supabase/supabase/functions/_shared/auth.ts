// supabase/functions/_shared/auth.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as jose from "https://deno.land/x/jose@v4.14.4/index.ts";

const JWT_SECRET = Deno.env.get("JWT_SECRET")!;

export interface AuthContext {
    user: any;
    supabase: any;
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
        
        // Get user from database
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', payload.sub)
            .eq('is_active', true)
            .single();

        if (error || !user) {
            throw new Error('User not found or inactive');
        }

        return { user, supabase };
    } catch (error) {
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
    candidateId: string
): string {
    const timestamp = Date.now().toString();
    const data = `${userId}:${electionId}:${candidateId}:${timestamp}`;
    return btoa(data).replace(/[+/=]/g, (m) => ({ '+': '-', '/': '_', '=': '' }[m] || m));
}