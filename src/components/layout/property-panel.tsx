"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CodeIcon } from "lucide-react";
import { CodeEditor } from "../editor/code-editor";
import { useEditorStore } from "@/store/editor-store";
import type { CanvasWidgetProps } from "./main-canvas";

export function PropertyPanel() {
  const selectedWidgetId = useEditorStore((state) => state.selectedWidgetId);
  const widgets = useEditorStore((state) => state.widgets);
  const updateWidget = useEditorStore((state) => state.updateWidget);
  const saveJSCode = useEditorStore((state) => state.saveJSCode);
  const getJSCode = useEditorStore((state) => state.getJSCode);

  const [jsDialogOpen, setJsDialogOpen] = useState(false);
  const [currentCodeKey, setCurrentCodeKey] = useState<string>("");
  const [currentWidget, setCurrentWidget] = useState<CanvasWidgetProps | null>(null);
  const [widgetName, setWidgetName] = useState("");
  const [widgetLabel, setWidgetLabel] = useState("");

  // Update the local state when a widget is selected
  useEffect(() => {
    if (selectedWidgetId) {
      const selectedWidget = widgets.find(w => w.id === selectedWidgetId);
      if (selectedWidget) {
        setCurrentWidget(selectedWidget);
        setWidgetName(selectedWidget.name);
        setWidgetLabel(selectedWidget.name);
      }
    } else {
      setCurrentWidget(null);
      setWidgetName("");
      setWidgetLabel("");
    }
  }, [selectedWidgetId, widgets]);

  const openJSEditor = (handlerName: string) => {
    if (!selectedWidgetId) return;

    const codeKey = `${selectedWidgetId}-${handlerName}`;
    setCurrentCodeKey(codeKey);
    setJsDialogOpen(true);
  };

  const handleJSSave = (code: string) => {
    if (currentCodeKey) {
      saveJSCode(currentCodeKey, code);
      setJsDialogOpen(false);
    }
  };

  const handleWidgetNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWidgetName(e.target.value);
    if (selectedWidgetId) {
      updateWidget(selectedWidgetId, { name: e.target.value });
    }
  };

  return (
    <div className="h-full border-l bg-background flex flex-col">
      <div className="border-b p-2 flex justify-between items-center">
        <h3 className="text-sm font-medium">Properties</h3>
        <Dialog open={jsDialogOpen} onOpenChange={setJsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost" className="gap-1">
              <CodeIcon className="h-4 w-4" />
              <span>JavaScript</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl h-[80vh] flex flex-col p-0">
            <DialogHeader className="px-6 py-3 border-b">
              <DialogTitle>JavaScript Editor</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-hidden p-4">
              <CodeEditor
                height="60vh"
                initialValue={currentCodeKey ? getJSCode(currentCodeKey) : undefined}
                onSave={handleJSSave}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {!selectedWidgetId && (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Select a widget to see its properties
        </div>
      )}

      {selectedWidgetId && currentWidget && (
        <Tabs defaultValue="basic" className="flex-1">
          <div className="border-b px-1">
            <TabsList className="w-full justify-start my-1">
              <TabsTrigger value="basic" className="flex-1">
                Basic
              </TabsTrigger>
              <TabsTrigger value="style" className="flex-1">
                Style
              </TabsTrigger>
              <TabsTrigger value="events" className="flex-1">
                Events
              </TabsTrigger>
            </TabsList>
          </div>
          <ScrollArea className="flex-1">
            <TabsContent value="basic" className="p-4 space-y-4">
              <div>
                <Accordion type="multiple" defaultValue={["general", "data"]}>
                  <AccordionItem value="general">
                    <AccordionTrigger>General</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            placeholder="widget1"
                            value={widgetName}
                            onChange={handleWidgetNameChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="label">Label</Label>
                          <Input
                            id="label"
                            placeholder="Submit"
                            value={widgetLabel}
                            onChange={(e) => setWidgetLabel(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="tooltip">Tooltip</Label>
                          <Input id="tooltip" placeholder="Click to submit" />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="data">
                    <AccordionTrigger>Data</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="default-value">Default Value</Label>
                          <Input id="default-value" placeholder="" />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="binding">Data Binding</Label>
                          <Input id="binding" placeholder="{{data.value}}" />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>
            <TabsContent value="style" className="p-4 space-y-4">
              <div>
                <Accordion type="multiple" defaultValue={["layout", "appearance"]}>
                  <AccordionItem value="layout">
                    <AccordionTrigger>Layout</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label htmlFor="width">Width</Label>
                          <Input
                            id="width"
                            placeholder="100px"
                            value={currentWidget.size.width}
                            onChange={(e) => {
                              const width = Number.parseInt(e.target.value);
                              if (!Number.isNaN(width)) {
                                updateWidget(selectedWidgetId, {
                                  size: { ...currentWidget.size, width }
                                });
                              }
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="height">Height</Label>
                          <Input
                            id="height"
                            placeholder="40px"
                            value={currentWidget.size.height}
                            onChange={(e) => {
                              const height = Number.parseInt(e.target.value);
                              if (!Number.isNaN(height)) {
                                updateWidget(selectedWidgetId, {
                                  size: { ...currentWidget.size, height }
                                });
                              }
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="x">X</Label>
                          <Input
                            id="x"
                            placeholder="0"
                            value={currentWidget.position.x}
                            onChange={(e) => {
                              const x = Number.parseInt(e.target.value);
                              if (!Number.isNaN(x)) {
                                updateWidget(selectedWidgetId, {
                                  position: { ...currentWidget.position, x }
                                });
                              }
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="y">Y</Label>
                          <Input
                            id="y"
                            placeholder="0"
                            value={currentWidget.position.y}
                            onChange={(e) => {
                              const y = Number.parseInt(e.target.value);
                              if (!Number.isNaN(y)) {
                                updateWidget(selectedWidgetId, {
                                  position: { ...currentWidget.position, y }
                                });
                              }
                            }}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="appearance">
                    <AccordionTrigger>Appearance</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="color">Text Color</Label>
                          <Input id="color" placeholder="#FFFFFF" />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="bg-color">Background Color</Label>
                          <Input id="bg-color" placeholder="#3366FF" />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="border-radius">Border Radius</Label>
                          <Input id="border-radius" placeholder="4px" />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>
            <TabsContent value="events" className="p-4 space-y-4">
              <div>
                <Accordion type="multiple" defaultValue={["actions"]}>
                  <AccordionItem value="actions">
                    <AccordionTrigger>Event Handlers</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="onClick">onClick</Label>
                          <div className="flex gap-2">
                            <Input id="onClick" placeholder="{{handleClick()}}" className="flex-1" />
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => openJSEditor("onClick")}
                            >
                              <CodeIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="onChange">onChange</Label>
                          <div className="flex gap-2">
                            <Input id="onChange" placeholder="{{updateValue()}}" className="flex-1" />
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => openJSEditor("onChange")}
                            >
                              <CodeIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      )}
    </div>
  );
}
