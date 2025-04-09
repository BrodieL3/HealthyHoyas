"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useSupabaseWithClerk } from "../../hooks/useSupabaseWithClerk";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, isLoaded: isClerkLoaded } = useUser();
  const { supabase, loading: isSupabaseLoading } = useSupabaseWithClerk();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Redirect if not signed in
    if (isClerkLoaded && !user) {
      router.push("/sign-in");
      return;
    }

    // Fetch user data from Supabase if we have both user and supabase client
    if (isClerkLoaded && user && supabase && !isSupabaseLoading) {
      async function fetchUserData() {
        try {
          // Example query to fetch user-specific data from Supabase
          const { data, error } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("clerk_user_id", user.id)
            .single();

          if (error) {
            console.error("Error fetching user data:", error);
          } else {
            setUserData(data);
          }
        } catch (error) {
          console.error("Error in user data fetch", error);
        } finally {
          setIsLoading(false);
        }
      }

      fetchUserData();
    }
  }, [user, isClerkLoaded, supabase, isSupabaseLoading, router]);

  if (!isClerkLoaded || isSupabaseLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user) {
    return null; // We're redirecting in the useEffect
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Clerk User Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium">User ID:</p>
            <p className="text-gray-700">{user.id}</p>
          </div>
          <div>
            <p className="font-medium">Email:</p>
            <p className="text-gray-700">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
          <div>
            <p className="font-medium">Full Name:</p>
            <p className="text-gray-700">{user.fullName || "Not provided"}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Supabase User Data</h2>
        {isLoading ? (
          <p>Loading user data...</p>
        ) : userData ? (
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(userData, null, 2)}
          </pre>
        ) : (
          <p>
            No user profile found in Supabase. You may need to create one first.
          </p>
        )}
      </div>
    </div>
  );
}
