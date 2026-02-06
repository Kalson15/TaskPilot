import { useState, useEffect, useCallback, useRef } from "react";
import { getTeamById } from '../lib/supabase/teams';
import type { TeamWithMemberDetails } from "@/types/team.types";

export function useTeamDetails(teamId: string | undefined) {
  const [team, setTeam] = useState<TeamWithMemberDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track the current request to prevent race conditions
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchTeamDetails = useCallback(async (isRefetch = false) => {
    if (!teamId) {
      setLoading(false);
      return;
    }

    try {
      // Only show the full loading state if it's the initial fetch
      if (!isRefetch) setLoading(true);
      setError(null);

      const data = await getTeamById(teamId);
      setTeam(data);
    } catch (err) {
      // Don't set error if the request was intentionally aborted
      if (err instanceof Error && err.name === 'AbortError') return;
      
      setError(err instanceof Error ? err.message : 'Failed to fetch team details');
      setTeam(null);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    // Reset state when teamId changes
    setTeam(null);
    setLoading(true);
    
    fetchTeamDetails();

    // Clean up if the component unmounts before the fetch finishes
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [teamId, fetchTeamDetails]);

  return {
    team,
    loading,
    error,
    /**
     * refetch: Triggers a full loading state
     * refresh: Updates data in the background (silent update)
     */
    refetch: () => fetchTeamDetails(false),
    refresh: () => fetchTeamDetails(true),
  };
}