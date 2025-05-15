"use client";

import React from "react";
import { TopNavbar } from "./top-navbar";
import { LeftSidebar } from "./left-sidebar";
import { MainCanvas } from "./main-canvas";
import { PropertyPanel } from "./property-panel";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export default function AppLayout() {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <TopNavbar />
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <LeftSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60}>
            <MainCanvas />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <PropertyPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
