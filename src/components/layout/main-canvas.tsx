"use client";

import type React from "react";
import { useDrop } from "react-dnd";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import CanvasWidget from "../widgets/canvas-widget";
import { useEditorStore } from "@/store/editor-store";
import { DRAG_TYPES } from "@/const/drag";
import CanvasBg from "./canvas-bg";

export interface CanvasWidgetProps {
  id: string;
  type: string;
  name: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface DragItem {
  id: string;
  name: string;
  type: string;
}

export function MainCanvas() {
  const widgets = useEditorStore((state) => state.widgets);
  // console.log("🚀 ~ MainCanvas ~ widgets:", widgets)
  
  const selectedWidgetId = useEditorStore((state) => state.selectedWidgetId);
  const addWidget = useEditorStore((state) => state.addWidget);
  const updateWidget = useEditorStore((state) => state.updateWidget);
  const selectWidget = useEditorStore((state) => state.selectWidget);

  const [, drop] = useDrop({
    accept: DRAG_TYPES.WIDGET,
    drop: (item: DragItem, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset) {
        const canvasElement = document.getElementById("canvas-area");
        if (canvasElement) {
          const canvasRect = canvasElement.getBoundingClientRect();
          const x = offset.x - canvasRect.left;
          const y = offset.y - canvasRect.top;

          // Add the new widget
          const newWidget: CanvasWidgetProps = {
            id: `${item.id}-${Date.now()}`,
            type: item.id,
            name: item.name,
            position: { x, y },
            size: { width: 150, height: 40 },
          };

          addWidget(newWidget);
        }
      }
    },
  });

  const handleWidgetClick = (id: string) => {
    console.log("🚀 ~ handleWidgetClick ~ id:", id)
    selectWidget(id);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectWidget(null);
    }
  };

  const handleWidgetResize = (widgetId: string, newSize: { width: number; height: number }) => {
    updateWidget(widgetId, { size: newSize });
  };

  const handleWidgetMove = (widgetId: string, newPosition: { x: number; y: number }) => {
    updateWidget(widgetId, { position: newPosition });
  };

  return (
    <div className='h-full flex flex-col bg-background'>
      <div className='border-b p-2'>
        <div className='flex items-center'>
          <span className='text-sm font-medium'>Main Canvas</span>
        </div>
      </div>
      <ScrollArea className='flex-1 relative'>
        <CanvasBg moving={false} />
        <div
          id='canvas-area'
          ref={drop}
          className={cn(
            'w-full min-h-[calc(100vh-10rem)] relative bg-muted/30',
            'border-4 border-dashed border-muted-foreground/20 rounded-lg m-4'
          )}
          onClick={handleCanvasClick}
        >
          {widgets.map((widget) => (
            <CanvasWidget
              key={widget.id}
              widget={widget}
              isSelected={selectedWidgetId === widget.id}
              onClick={() => handleWidgetClick(widget.id)}
              onResize={handleWidgetResize}
              onMove={handleWidgetMove}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
