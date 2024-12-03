import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditTeam } from "./editTeam"
import { useState } from "react"

export function UpdateTeam(team: any) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
                <span className="!border-none p-3">
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                        <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                    </svg>
                </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 backdrop-blur-[10.5px] bg-[rgba(49,38,85,0.07)] !border-none">
                <DropdownMenuLabel className="!text-white">{team.team.TeamName}</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem onSelect={(e) => {
                        e.preventDefault();
                    }}>
                        <div className="w-full">
                            <EditTeam
                                team={team.team}
                              
                            />
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        New Team
                        <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}