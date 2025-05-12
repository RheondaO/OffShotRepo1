import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/use-theme";
import { Palette as PaletteIcon } from "lucide-react";

export function ThemeToggle() {
  const { currentTheme, changeTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <PaletteIcon className="h-5 w-5" />
          <span className="sr-only">Toggle theme</span>
          <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
            <span className={`animate-pulse-slow rounded-full h-full w-full ${getThemeColor(currentTheme)}`} />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeTheme("cosmic")} className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-purple-500"></span>
          Cosmic
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme("cyberpunk")} className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-pink-500"></span>
          Cyberpunk
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme("midnight")} className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-blue-700"></span>
          Midnight
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme("retro")} className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-amber-500"></span>
          Retro
        </DropdownMenuItem>
        {/* Temporarily removed while we perfect the monochrome theme 
        <DropdownMenuItem onClick={() => changeTheme("monochrome")} className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-white border border-gray-500"></span>
          Monochrome
        </DropdownMenuItem>
        */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getThemeColor(theme: string) {
  switch (theme) {
    case "cosmic":
      return "bg-purple-500";
    case "cyberpunk":
      return "bg-pink-500";
    case "midnight":
      return "bg-blue-700";
    case "retro":
      return "bg-amber-500";
    case "monochrome":
      return "bg-white";
    default:
      return "bg-purple-500";
  }
}