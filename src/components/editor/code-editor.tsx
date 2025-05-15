"use client";

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Play, Save } from 'lucide-react';

interface CodeEditorProps {
  initialValue?: string;
  language?: string;
  height?: string;
  onSave?: (value: string) => void;
  onRun?: (value: string) => void;
}

const defaultJavaScript = `// Write your JavaScript code here
// You can access data using the 'appsmith' object

function myFunction() {
  // Example: Update state of a widget
  // appsmith.store.update("widgetName", { value: "New Value" });

  // Example: Call a query
  // return appsmith.queries.getUserData.run()
  //   .then(data => {
  //     console.log(data);
  //     return data;
  //   });

  return "Hello world!";
}

// Return the result of the function
return myFunction();`;

export function CodeEditor({
  initialValue = defaultJavaScript,
  language = 'javascript',
  height = '400px',
  onSave,
  onRun
}: CodeEditorProps) {
  const [code, setCode] = useState(initialValue);
  const [output, setOutput] = useState<string | null>(null);

  const handleEditorChange = (value?: string) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(code);
    }
  };

  const handleRun = () => {
    try {
      // Create a mock appsmith global object
      const mockAppsmith = {
        store: {
          update: (widgetName: string, value: any) => {
            console.log(`Update widget ${widgetName} with`, value);
            return value;
          }
        },
        queries: {
          getUserData: {
            run: () => Promise.resolve({ id: 1, name: 'John Doe' })
          },
          fetchProducts: {
            run: () => Promise.resolve([
              { id: 1, name: 'Product 1', price: 100 },
              { id: 2, name: 'Product 2', price: 200 }
            ])
          }
        }
      };

      // Execute the code in a safe way
      const executeCode = new Function('appsmith', `
        try {
          ${code}
        } catch (error) {
          return { error: error.message };
        }
      `);

      const result = executeCode(mockAppsmith);

      // If the result is a promise, handle it appropriately
      if (result && typeof result.then === 'function') {
        result
          .then((data: any) => {
            setOutput(JSON.stringify(data, null, 2));
            if (onRun) onRun(code);
          })
          .catch((err: Error) => {
            setOutput(`Error: ${err.message}`);
          });
      } else {
        setOutput(typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result));
        if (onRun) onRun(code);
      }
    } catch (err) {
      if (err instanceof Error) {
        setOutput(`Error: ${err.message}`);
      } else {
        setOutput('An unknown error occurred');
      }
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">JavaScript Editor</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-2">
        <Editor
          height={height}
          language={language}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
          }}
        />
        {output !== null && (
          <div className="mt-2 p-3 bg-muted rounded border text-sm font-mono overflow-auto max-h-36">
            <div className="text-xs text-muted-foreground mb-1">Output:</div>
            <pre className="whitespace-pre-wrap">{output}</pre>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button onClick={handleRun} className="bg-green-600 hover:bg-green-700">
          <Play className="h-4 w-4 mr-2" />
          Run
        </Button>
      </CardFooter>
    </Card>
  );
}
