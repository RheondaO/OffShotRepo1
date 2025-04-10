import { useRoleVotes } from "@/hooks/use-role-votes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, ShieldCheck, Award } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserRoleBadge } from "./UserRoleBadge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

interface RoleVotingProps {
  userId: number;
  displayMode?: "compact" | "full";
  className?: string;
}

export function RoleVoting({ 
  userId, 
  displayMode = "full", 
  className 
}: RoleVotingProps) {
  const { user: currentUser } = useAuth();
  const {
    councilVotes,
    moderatorVotes,
    czarVotes,
    hasVotedForCouncil,
    hasVotedForModerator,
    hasVotedForCzar,
    councilVoteId,
    moderatorVoteId,
    czarVoteId,
    canVote,
    castVote,
    withdrawVote,
    isCasting,
    isWithdrawing,
    isLoading
  } = useRoleVotes({ userId });
  
  if (isLoading) {
    return <div className="h-16 animate-pulse bg-gray-100 rounded-md" />;
  }
  
  if (displayMode === "compact") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1">
                <Shield size={14} className="text-emerald-700" />
                <span className="text-xs text-emerald-700">{councilVotes}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Council Member Votes: {councilVotes}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1">
                <ShieldCheck size={14} className="text-indigo-700" />
                <span className="text-xs text-indigo-700">{moderatorVotes}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Moderator Votes: {moderatorVotes}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1">
                <Award size={14} className="text-amber-700" />
                <span className="text-xs text-amber-700">{czarVotes}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Czar Votes: {czarVotes}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  // Self voting is disabled
  if (currentUser?.id === userId) {
    return (
      <Card className={cn("p-4", className)}>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Community Role Votes</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col items-center justify-center p-2 rounded-md bg-gray-50">
            <Shield className="text-emerald-600 mb-1" size={20} />
            <div className="text-lg font-semibold">{councilVotes}</div>
            <div className="text-xs text-gray-500">Council</div>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-md bg-gray-50">
            <ShieldCheck className="text-indigo-600 mb-1" size={20} />
            <div className="text-lg font-semibold">{moderatorVotes}</div>
            <div className="text-xs text-gray-500">Moderator</div>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-md bg-gray-50">
            <Award className="text-amber-600 mb-1" size={20} />
            <div className="text-lg font-semibold">{czarVotes}</div>
            <div className="text-xs text-gray-500">Czar</div>
          </div>
        </div>
        <div className="text-xs text-gray-500 text-center">
          You cannot vote for yourself. Roles are assigned based on community votes.
        </div>
      </Card>
    );
  }
  
  return (
    <Card className={cn("p-4", className)}>
      <h3 className="text-sm font-medium text-gray-700 mb-3">Community Role Votes</h3>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="flex flex-col items-center justify-center p-2 rounded-md bg-gray-50">
          <Shield className="text-emerald-600 mb-1" size={20} />
          <div className="text-lg font-semibold">{councilVotes}</div>
          <div className="text-xs text-gray-500">Council</div>
        </div>
        <div className="flex flex-col items-center justify-center p-2 rounded-md bg-gray-50">
          <ShieldCheck className="text-indigo-600 mb-1" size={20} />
          <div className="text-lg font-semibold">{moderatorVotes}</div>
          <div className="text-xs text-gray-500">Moderator</div>
        </div>
        <div className="flex flex-col items-center justify-center p-2 rounded-md bg-gray-50">
          <Award className="text-amber-600 mb-1" size={20} />
          <div className="text-lg font-semibold">{czarVotes}</div>
          <div className="text-xs text-gray-500">Czar</div>
        </div>
      </div>
      
      {canVote && currentUser ? (
        <div className="grid grid-cols-3 gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button 
                    variant={hasVotedForCouncil ? "destructive" : "outline"}
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      if (hasVotedForCouncil && councilVoteId) {
                        withdrawVote(councilVoteId);
                      } else {
                        castVote('council_member');
                      }
                    }}
                    disabled={isCasting || isWithdrawing}
                  >
                    {hasVotedForCouncil ? 'Unvote' : 'Vote'}
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{hasVotedForCouncil ? 'Remove your vote for Council Member' : 'Vote for Council Member'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button 
                    variant={hasVotedForModerator ? "destructive" : "outline"}
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      if (hasVotedForModerator && moderatorVoteId) {
                        withdrawVote(moderatorVoteId);
                      } else {
                        castVote('moderator');
                      }
                    }}
                    disabled={isCasting || isWithdrawing}
                  >
                    {hasVotedForModerator ? 'Unvote' : 'Vote'}
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{hasVotedForModerator ? 'Remove your vote for Moderator' : 'Vote for Moderator'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button 
                    variant={hasVotedForCzar ? "destructive" : "outline"}
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      if (hasVotedForCzar && czarVoteId) {
                        withdrawVote(czarVoteId);
                      } else {
                        castVote('czar');
                      }
                    }}
                    disabled={isCasting || isWithdrawing}
                  >
                    {hasVotedForCzar ? 'Unvote' : 'Vote'}
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{hasVotedForCzar ? 'Remove your vote for Czar' : 'Vote for Czar'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ) : (
        <div className="text-xs text-gray-500 text-center">
          {!currentUser ? "Log in to vote for roles" : "You cannot vote for this user"}
        </div>
      )}
      
      <div className="mt-3 border-t pt-3">
        <div className="text-xs text-gray-600">
          <p className="mb-1">Role requirements:</p>
          <ul className="list-disc list-inside space-y-1">
            <li className="flex items-center"><UserRoleBadge role="council_member" size="sm" className="mr-1" /> 5+ votes</li>
            <li className="flex items-center"><UserRoleBadge role="moderator" size="sm" className="mr-1" /> 10+ votes</li>
            <li className="flex items-center"><UserRoleBadge role="czar" size="sm" className="mr-1" /> 20+ votes</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}