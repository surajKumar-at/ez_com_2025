
// This is just to make TypeScript happy about the Headers type
declare global {
  interface Headers {
    entries(): IterableIterator<[string, string]>;
  }
}

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
