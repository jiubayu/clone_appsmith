"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ChevronDown,
  Eye,
  Search,
  Share,
  Settings,
  Save,
  Zap,
  Undo2,
  Redo2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEditorStore } from "@/store/editor-store";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function TopNavbar() {
  const canUndo = useEditorStore((state) => state.canUndo)();
  const canRedo = useEditorStore((state) => state.canRedo)();
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);

  return (
    <header className="border-b bg-background z-10 flex h-14 items-center px-4 gap-4">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-blue-600">appsmith_</span>
        <div className="h-6 w-[1px] bg-border mx-2" />
        <div className="flex items-center gap-1">
          <span className="font-medium">My First Application</span>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="ml-4 flex items-center gap-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Save className="h-3.5 w-3.5 mr-1" />
          <span>Saving...</span>
        </div>
      </div>

      <div className="flex items-center ml-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={!canUndo}
                onClick={undo}
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Undo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={!canRedo}
                onClick={redo}
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Redo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="relative ml-auto flex items-center gap-2">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-md pl-8 bg-muted border-none"
          />
        </div>

        <Button size="sm" variant="ghost" className="gap-1">
          <Eye className="h-4 w-4" />
          <span className="hidden md:inline">Preview</span>
        </Button>

        <Button size="sm" variant="ghost" className="gap-1">
          <Share className="h-4 w-4" />
          <span className="hidden md:inline">Share</span>
        </Button>

        <Button size="sm" variant="ghost" className="gap-1">
          <Settings className="h-4 w-4" />
        </Button>

        <Button size="sm" variant="default" className="gap-1 bg-blue-600 hover:bg-blue-700">
          <Zap className="h-4 w-4" />
          <span>Deploy</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
