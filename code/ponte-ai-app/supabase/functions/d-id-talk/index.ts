import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const D_ID_API_KEY = Deno.env.get('D_ID_API_KEY');
const D_ID_BASE_URL = 'https://api.d-id.com';

serve(async (req) => {
  try {
    // Initialize Supabase client for RLS if needed
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { 'x-my-custom-header': 'd-id-edge-function' },
        },
      }
    );

    // Get the JWT from the request headers
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization header missing' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // At this point, 'user' object contains the authenticated user's data.
    // You can add more specific authorization checks here if needed,
    // e.g., checking user roles or specific permissions.
    // For example:
    // if (user.email !== 'allowed_user@example.com') {
    //   return new Response(JSON.stringify({ error: 'Unauthorized access' }), { status: 403 });
    // }

    const body = await req.json();

    const payload = {
      source_url: body.source_url,
      script: {
        type: 'audio',
        audio_url: body.audio_url,
        reduce_noise: true,
        ssml: false,
      },
      config: {
        result_format: 'mp4',
        fluent: true,
        pad_audio: 0.0,
        stitch: true,
        align_driver: true,
        align_expand_factor: 1.0,
      }
    };

    const didRes = await fetch(`${D_ID_BASE_URL}/talks`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${D_ID_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const didData = await didRes.json();

    if (!didRes.ok) {
      return new Response(JSON.stringify({ error: didData }), {
        status: didRes.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ id: didData.id, status: didData.status }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});