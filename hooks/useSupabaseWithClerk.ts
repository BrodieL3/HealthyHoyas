import { useState, useEffect } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/nextjs";
import { createClientWithAuth } from "../lib/supabase";

/**
 * This hook creates and returns a Supabase client that uses the user's Clerk JWT
 * to authenticate with Supabase.
 */
export function useSupabaseWithClerk() {
  const { isLoaded, isSignedIn } = useAuth();
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only initialize Supabase if Clerk auth is loaded
    if (!isLoaded) return;

    async function initializeSupabase() {
      setLoading(true);

      try {
        // Only create an authenticated client if the user is signed in
        if (isSignedIn) {
          const client = await createClientWithAuth();
          setSupabaseClient(client);
        } else {
          setSupabaseClient(null);
        }
      } catch (error) {
        console.error("Error initializing Supabase client:", error);
        setSupabaseClient(null);
      } finally {
        setLoading(false);
      }
    }

    initializeSupabase();
  }, [isLoaded, isSignedIn]);

  return { supabase: supabaseClient, loading };
}
