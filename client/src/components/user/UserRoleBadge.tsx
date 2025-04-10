import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type UserRole } from "@shared/schema";
import { ShieldCheck, Shield, Award, User } from "lucide-react";

interface UserRoleBadgeProps {
  role: UserRole;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function UserRoleBadge({ 
  role,
  className,
  showLabel = true,
  size = "md" 
}: UserRoleBadgeProps) {
  const badgeStyles = {
    member: "bg-slate-200 text-slate-700 hover:bg-slate-200",
    council_member: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    moderator: "bg-indigo-100 text-indigo-700 hover:bg-indigo-100",
    czar: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  };
  
  const sizeClasses = {
    sm: "h-5 text-xs",
    md: "h-6 text-sm",
    lg: "h-7 text-base"
  };
  
  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };
  
  const roleLabels = {
    member: "Member",
    council_member: "Council Member",
    moderator: "Moderator",
    czar: "Czar"
  };
  
  const RoleIcon = () => {
    switch (role) {
      case "council_member":
        return <Shield size={iconSizes[size]} className="mr-1" />;
      case "moderator":
        return <ShieldCheck size={iconSizes[size]} className="mr-1" />;
      case "czar":
        return <Award size={iconSizes[size]} className="mr-1" />;
      default:
        return <User size={iconSizes[size]} className="mr-1" />;
    }
  };
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-medium",
        badgeStyles[role],
        sizeClasses[size],
        className
      )}
    >
      <RoleIcon />
      {showLabel && roleLabels[role]}
    </Badge>
  );
}