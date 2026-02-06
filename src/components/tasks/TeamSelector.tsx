

import { useState } from 'react';
import { Users, X, Check } from 'lucide-react';
import { useTeams } from '../../hooks/useTeams';

interface TeamSelectorProps {
  selectedTeamId: string | null;
  onSelect: (teamId: string | null) => void;
  disabled?: boolean;
}

export function TeamSelector({
  selectedTeamId,
  onSelect,
  disabled = false,
}: TeamSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { teams, loading } = useTeams();

  // Find selected team
  const selectedTeam = teams.find((t) => t.id === selectedTeamId);

  const handleSelect = (teamId: string | null) => {
    onSelect(teamId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-2">
          {selectedTeam ? (
            <>
              <Users className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-900 dark:text-white">{selectedTeam.name}</span>
            </>
          ) : (
            <>
              <Users className="w-5 h-5 text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">No team</span>
            </>
          )}
        </div>
        {selectedTeamId && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(null);
            }}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute z-20 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Loading teams...
              </div>
            ) : teams.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No teams found. Create a team first.
              </div>
            ) : (
              <>
                {/* No team option */}
                <button
                  type="button"
                  onClick={() => handleSelect(null)}
                  className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">No team (Personal)</span>
                  </div>
                  {!selectedTeamId && (
                    <Check className="w-4 h-4 text-yellow-500" />
                  )}
                </button>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700" />

                {/* Teams */}
                {teams.map((team) => {
                  const isSelected = team.id === selectedTeamId;

                  return (
                    <button
                      key={team.id}
                      type="button"
                      onClick={() => handleSelect(team.id)}
                      className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-yellow-500" />
                        <span className="text-gray-900 dark:text-white">{team.name}</span>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-yellow-500" />
                      )}
                    </button>
                  );
                })}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}