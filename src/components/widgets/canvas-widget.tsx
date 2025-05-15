'use client';

import type React from 'react';
import {useState, useRef, useCallback, useEffect} from 'react';
import type {CanvasWidgetProps} from '../layout/main-canvas';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {cn} from '@/lib/utils';
import {stat} from 'fs';
import {throttle} from '@/lib/tool';

interface WidgetContainerProps {
  widget: CanvasWidgetProps;
  isSelected: boolean;
  onClick: () => void;
  onResize?: (
    widgetId: string,
    newSize: {width: number; height: number}
  ) => void;
  onMove?: (widgetId: string, newPosition: {x: number; y: number}) => void;
}

export default function CanvasWidget({
  widget,
  isSelected,
  onClick,
  onResize,
  onMove,
}: WidgetContainerProps) {
  const resizingRef = useRef(false);
  const [moving, setMoving] = useState(false);
  // const moving = useRef(false)
  const initialPos = useRef({x: 0, y: 0});
  const [initialSize, setInitialSize] = useState({width: 0, height: 0});
  const widgetRef = useRef<HTMLDivElement>(null);

  const style = {
    position: 'absolute' as const,
    left: `${widget.position.x}px`,
    top: `${widget.position.y}px`,
    width: `${widget.size.width}px`,
    height: `${widget.size.height}px`,
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    resizingRef.current = true;

    initialPos.current = {
      x: e.clientX,
      y: e.clientY,
    };

    setInitialSize({
      width: widget.size.width,
      height: widget.size.height,
    });

    // Add event listeners for mouse move and up
    document.body.addEventListener('mousemove', handleResizeMove);
    document.body.addEventListener('mouseup', handleResizeEnd);
  };

  // useEffect(() => {
  //   console.log(resizing, 'useEffect-resizing');
  // }, [resizing]);

  const handleResizeMove = (e: MouseEvent) => {
    // console.log(resizing, 'handleResizeMove-resizing');
    if (!resizingRef.current) return;

    const deltaX = e.clientX - initialPos.current.x;
    const deltaY = e.clientY - initialPos.current.y;
    const newWidth = Math.max(1, initialSize.width + deltaX);
    const newHeight = Math.max(2, initialSize.height + deltaY);
    // console.log(widgetRef.current, 'widgetRef.current');
    if (widgetRef.current) {
      widgetRef.current.style.width = `${newWidth}px`;
      widgetRef.current.style.height = `${newHeight}px`;
    }
  };

  const handleResizeEnd = () => {
    resizingRef.current = false;
    // Remove event listeners
    document.body.removeEventListener('mousemove', handleResizeMove);
    document.body.removeEventListener('mouseup', handleResizeEnd);

    // Call the onResize callback if provided
    if (onResize && widgetRef.current) {
      const width = Number.parseInt(widgetRef.current.style.width);
      const height = Number.parseInt(widgetRef.current.style.height);
      onResize(widget.id, {width, height});
    }
  };

  const handleMoveStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMoving(true);

    initialPos.current = {
      x: e.clientX - widget.position.x,
      y: e.clientY - widget.position.y,
    };

    handleMoveMove(e)

    // Add event listeners for mouse move and up
    document.addEventListener('mousemove', handleMoveMove);
    document.addEventListener('mouseup', handleMoveEnd);
  };

  const handleMoveMove = useCallback((e: MouseEvent) => {
    console.log(moving, 'handleMoveMove');
    if (!moving) return;

    const newX = e.clientX - initialPos.current.x;
    // console.log("🚀 ~ handleMoveMove ~ newX:", newX)
    const newY = e.clientY - initialPos.current.y;

    if (widgetRef.current) {
      widgetRef.current.style.left = `${newX}px`;
      widgetRef.current.style.top = `${newY}px`;
    }
  }, [moving]);

  const handleMoveEnd = () => {
    setMoving(false);

    // Remove event listeners
    document.removeEventListener('mousemove',handleMoveMove);
    document.removeEventListener('mouseup', handleMoveEnd);

    // Call the onMove callback if provided
    if (onMove && widgetRef.current) {
      const left = Number.parseInt(widgetRef.current.style.left);
      const top = Number.parseInt(widgetRef.current.style.top);
      onMove(widget.id, {x: left, y: top});
    }
  };

  const renderWidget = () => {
    switch (widget.type) {
      case 'button':
        return <Button className='w-full h-full'>{widget.name}</Button>;
      case 'input':
        return <Input className='w-full h-full' placeholder={widget.name} />;
      case 'table':
        return (
          <div className='w-full h-full bg-white border rounded'>
            <div className='p-2 bg-gray-100 border-b'>{widget.name}</div>
            <div className='p-2'>Table Content</div>
          </div>
        );
      case 'container':
        return (
          <div className='w-full h-full border-2 border-dashed border-gray-300 p-2 rounded'>
            <div className='text-xs text-gray-500'>
              Container: {widget.name}
            </div>
          </div>
        );
      case 'image':
        return (
          <div className='w-full h-full flex items-center justify-center bg-gray-200 rounded'>
            <span className='text-gray-500'>Image: {widget.name}</span>
          </div>
        );
      case 'list':
        return (
          <div className='w-full h-full overflow-hidden border rounded'>
            <div className='p-1 bg-gray-100 border-b text-xs'>
              {widget.name}
            </div>
            <div className='p-1 text-xs'>Item 1</div>
            <div className='p-1 text-xs border-t'>Item 2</div>
            <div className='p-1 text-xs border-t'>Item 3</div>
          </div>
        );
      default:
        return (
          <div className='w-full h-full border p-2 rounded'>{widget.name}</div>
        );
    }
  };

  return (
    <div
      ref={widgetRef}
      style={style}
      onClick={onClick}
      onMouseDown={handleMoveStart}
      className={cn(
        'cursor-move transition-all p-1',
        isSelected && 'border-2 border-dotted border-blue-500 shadow-lg'
      )}
    >
      {renderWidget()}
      {isSelected && (
        <div
          className='absolute right-0 bottom-0 transform translate-x-1/2 translate-y-1/2 bg-blue-500 rounded-full w-4 h-4 cursor-se-resize'
          onMouseDown={handleResizeStart}
        />
      )}
    </div>
  );
}
