
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const url = new URL(req.url);
    const method = req.method;

    console.log(`${method} request to adverse-events:`, url.pathname);

    switch (method) {
      case 'GET': {
        console.log('Fetching adverse events from ezc_adverse_event_info');
        
        const { data, error } = await supabaseClient
          .from('ezc_adverse_event_info')
          .select('*')
          .order('eaei_id', { ascending: false });

        if (error) {
          console.error('Database error:', error);
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        console.log(`Successfully fetched ${data?.length || 0} adverse events`);
        return new Response(
          JSON.stringify({ success: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'POST': {
        const requestData = await req.json();
        console.log('Creating adverse event:', requestData);

        // Add current timestamp if needed
        const adverseEventData = {
          ...requestData,
        };

        const { data, error } = await supabaseClient
          .from('ezc_adverse_event_info')
          .insert([adverseEventData])
          .select()
          .single();

        if (error) {
          console.error('Database error:', error);
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        console.log('Successfully created adverse event:', data);
        return new Response(
          JSON.stringify({ success: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'PUT': {
        const id = url.searchParams.get('id');
        if (!id) {
          return new Response(
            JSON.stringify({ success: false, error: 'ID parameter is required' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        const requestData = await req.json();
        console.log(`Updating adverse event ${id}:`, requestData);

        const { data, error } = await supabaseClient
          .from('ezc_adverse_event_info')
          .update(requestData)
          .eq('eaei_id', parseInt(id))
          .select()
          .single();

        if (error) {
          console.error('Database error:', error);
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        console.log('Successfully updated adverse event:', data);
        return new Response(
          JSON.stringify({ success: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'DELETE': {
        const id = url.searchParams.get('id');
        const ids = url.searchParams.get('ids');

        if (ids) {
          // Bulk delete
          const idArray = ids.split(',').map(id => parseInt(id.trim()));
          console.log('Bulk deleting adverse events:', idArray);

          const { error } = await supabaseClient
            .from('ezc_adverse_event_info')
            .delete()
            .in('eaei_id', idArray);

          if (error) {
            console.error('Database error:', error);
            return new Response(
              JSON.stringify({ success: false, error: error.message }),
              { 
                status: 500, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          }

          console.log(`Successfully deleted ${idArray.length} adverse events`);
          return new Response(
            JSON.stringify({ success: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else if (id) {
          // Single delete
          console.log(`Deleting adverse event ${id}`);

          const { error } = await supabaseClient
            .from('ezc_adverse_event_info')
            .delete()
            .eq('eaei_id', parseInt(id));

          if (error) {
            console.error('Database error:', error);
            return new Response(
              JSON.stringify({ success: false, error: error.message }),
              { 
                status: 500, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          }

          console.log('Successfully deleted adverse event');
          return new Response(
            JSON.stringify({ success: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else {
          return new Response(
            JSON.stringify({ success: false, error: 'ID parameter is required' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
      }

      default:
        return new Response(
          JSON.stringify({ success: false, error: 'Method not allowed' }),
          { 
            status: 405, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
