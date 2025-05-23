"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CanvasWidgetProps } from "@/components/layout/main-canvas";

// Define types for our history system
export type HistoryAction = {
  type: 'ADD_WIDGET' | 'UPDATE_WIDGET' | 'REMOVE_WIDGET' | 'ADD_QUERY' | 'UPDATE_QUERY' | 'REMOVE_QUERY';
  payload: any;
  timestamp: number;
  id: string;
};

export interface QueryInterface {
  id: string;
  name: string;
  type: string;
  query: string;
}

export interface EditorState {
  // Widgets state
  widgets: CanvasWidgetProps[];
  datasource: object;
  selectedWidgetId: string | null;

  // Queries state
  queries: QueryInterface[];
  selectedQueryId: string | null;

  // JavaScript code state
  jsCode: {
    [key: string]: string;
  };

  // History for undo/redo
  history: HistoryAction[];
  historyIndex: number;

  // Actions for widgets
  addWidget: (widget: CanvasWidgetProps) => void;
  updateWidget: (widgetId: string, data: Partial<CanvasWidgetProps>) => void;
  removeWidget: (widgetId: string) => void;
  selectWidget: (widgetId: string | null) => void;

  updateDataSource: () => void;

  // Actions for queries
  addQuery: (query: QueryInterface) => void;
  updateQuery: (queryId: string, data: Partial<QueryInterface>) => void;
  removeQuery: (queryId: string) => void;
  selectQuery: (queryId: string | null) => void;

  // Actions for JS code
  saveJSCode: (key: string, code: string) => void;
  getJSCode: (key: string) => string;

  // History actions
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  recordAction: (action: Omit<HistoryAction, 'timestamp' | 'id'>) => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      // Initial widgets state
      widgets: [
        {
          id: "button-1",
          type: "button",
          name: "Submit",
          position: { x: 100, y: 100 },
          size: { width: 120, height: 40 },
        },
        {
          id: "input-1",
          type: "input",
          name: "Name",
          position: { x: 100, y: 200 },
          size: { width: 250, height: 40 },
        },
      ],
      selectedWidgetId: null,

      datasource: {},

      // Initial queries state
      queries: [
        {
          id: "query1",
          name: "getUserData",
          type: "postgres",
          query: "SELECT * FROM users LIMIT 10;",
        },
        {
          id: "query2",
          name: "fetchProducts",
          type: "rest-api",
          query: "https://api.example.com/products",
        },
      ],
      selectedQueryId: null,

      // Initial JS code state
      jsCode: {},

      // Initialize history
      history: [],
      historyIndex: -1,

      // Record an action to the history
      recordAction: (action) => set((state) => {
        const newAction: HistoryAction = {
          ...action,
          timestamp: Date.now(),
          id: Math.random().toString(36).substring(2, 9),
        };

        // If we're not at the end of the history, truncate it
        let newHistory = [...state.history];
        if (state.historyIndex < state.history.length - 1) {
          newHistory = newHistory.slice(0, state.historyIndex + 1);
        }

        return {
          history: [...newHistory, newAction],
          historyIndex: newHistory.length,
        };
      }),

      // Widget actions
      addWidget: (widget) => {
        const { recordAction } = get();
        set((state) => ({
          widgets: [...state.widgets, widget],
          selectedWidgetId: widget.id
        }));
        recordAction({
          type: 'ADD_WIDGET',
          payload: { widget }
        });
      },

      updateWidget: (widgetId, data) => {
        const { recordAction } = get();
        const originalWidget = get().widgets.find(w => w.id === widgetId);

        set((state) => ({
          widgets: state.widgets.map(widget =>
            widget.id === widgetId ? { ...widget, ...data } : widget
          )
        }));

        recordAction({
          type: 'UPDATE_WIDGET',
          payload: { widgetId, oldData: originalWidget, newData: data }
        });
      },

      removeWidget: (widgetId) => {
        const { recordAction } = get();
        const widgetToRemove = get().widgets.find(w => w.id === widgetId);

        set((state) => ({
          widgets: state.widgets.filter(widget => widget.id !== widgetId),
          selectedWidgetId: state.selectedWidgetId === widgetId ? null : state.selectedWidgetId
        }));

        recordAction({
          type: 'REMOVE_WIDGET',
          payload: { widget: widgetToRemove }
        });
      },

      selectWidget: (widgetId) => set(() => ({
        selectedWidgetId: widgetId
      })),

      updateDataSource: () => {
        set((state) => ({
          datasource: {
            currentAppInfo: {
              name: 'jiuyu-appsmith',
              version: '1.0.0',
            },
            currentUserInfo: {
              name: 'jiuyu',
              email: 'jiuyu@jiuyu',
              age: 18,
            },
            widgets: state.widgets,
          },
        }));
      },

      // Query actions
      addQuery: (query) => {
        const { recordAction } = get();

        set((state) => ({
          queries: [...state.queries, query],
          selectedQueryId: query.id
        }));

        recordAction({
          type: 'ADD_QUERY',
          payload: { query }
        });
      },

      updateQuery: (queryId, data) => {
        const { recordAction } = get();
        const originalQuery = get().queries.find(q => q.id === queryId);

        set((state) => ({
          queries: state.queries.map(query =>
            query.id === queryId ? { ...query, ...data } : query
          )
        }));

        recordAction({
          type: 'UPDATE_QUERY',
          payload: { queryId, oldData: originalQuery, newData: data }
        });
      },

      removeQuery: (queryId) => {
        const { recordAction } = get();
        const queryToRemove = get().queries.find(q => q.id === queryId);

        set((state) => ({
          queries: state.queries.filter(query => query.id !== queryId),
          selectedQueryId: state.selectedQueryId === queryId ? null : state.selectedQueryId
        }));

        recordAction({
          type: 'REMOVE_QUERY',
          payload: { query: queryToRemove }
        });
      },

      selectQuery: (queryId) => set(() => ({
        selectedQueryId: queryId
      })),

      // JS code actions
      saveJSCode: (key, code) => set((state) => ({
        jsCode: {
          ...state.jsCode,
          [key]: code
        }
      })),

      getJSCode: (key) => {
        const state = get();
        return state.jsCode[key] || "";
      },

      // Undo/Redo functions
      canUndo: () => {
        const state = get();
        return state.historyIndex >= 0;
      },

      canRedo: () => {
        const state = get();
        return state.historyIndex < state.history.length - 1;
      },

      undo: () => {
        const state = get();
        if (!state.canUndo()) return;

        const action = state.history[state.historyIndex];

        // Handle different action types
        switch (action.type) {
          case 'ADD_WIDGET':
            set((state) => ({
              widgets: state.widgets.filter(w => w.id !== action.payload.widget.id),
              historyIndex: state.historyIndex - 1,
            }));
            break;

          case 'UPDATE_WIDGET':
            set((state) => ({
              widgets: state.widgets.map(w =>
                w.id === action.payload.widgetId
                  ? { ...w, ...action.payload.oldData }
                  : w
              ),
              historyIndex: state.historyIndex - 1,
            }));
            break;

          case 'REMOVE_WIDGET':
            set((state) => ({
              widgets: [...state.widgets, action.payload.widget],
              historyIndex: state.historyIndex - 1,
            }));
            break;

          case 'ADD_QUERY':
            set((state) => ({
              queries: state.queries.filter(q => q.id !== action.payload.query.id),
              historyIndex: state.historyIndex - 1,
            }));
            break;

          case 'UPDATE_QUERY':
            set((state) => ({
              queries: state.queries.map(q =>
                q.id === action.payload.queryId
                  ? { ...q, ...action.payload.oldData }
                  : q
              ),
              historyIndex: state.historyIndex - 1,
            }));
            break;

          case 'REMOVE_QUERY':
            set((state) => ({
              queries: [...state.queries, action.payload.query],
              historyIndex: state.historyIndex - 1,
            }));
            break;
        }
      },

      redo: () => {
        const state = get();
        if (!state.canRedo()) return;

        const action = state.history[state.historyIndex + 1];

        // Handle different action types
        switch (action.type) {
          case 'ADD_WIDGET':
            set((state) => ({
              widgets: [...state.widgets, action.payload.widget],
              historyIndex: state.historyIndex + 1,
            }));
            break;

          case 'UPDATE_WIDGET':
            set((state) => ({
              widgets: state.widgets.map(w =>
                w.id === action.payload.widgetId
                  ? { ...w, ...action.payload.newData }
                  : w
              ),
              historyIndex: state.historyIndex + 1,
            }));
            break;

          case 'REMOVE_WIDGET':
            set((state) => ({
              widgets: state.widgets.filter(w => w.id !== action.payload.widget.id),
              historyIndex: state.historyIndex + 1,
            }));
            break;

          case 'ADD_QUERY':
            set((state) => ({
              queries: [...state.queries, action.payload.query],
              historyIndex: state.historyIndex + 1,
            }));
            break;

          case 'UPDATE_QUERY':
            set((state) => ({
              queries: state.queries.map(q =>
                q.id === action.payload.queryId
                  ? { ...q, ...action.payload.newData }
                  : q
              ),
              historyIndex: state.historyIndex + 1,
            }));
            break;

          case 'REMOVE_QUERY':
            set((state) => ({
              queries: state.queries.filter(q => q.id !== action.payload.query.id),
              historyIndex: state.historyIndex + 1,
            }));
            break;
        }
      },
    }),
    {
      name: "appsmith-editor-state",
      partialize: (state) => ({
        widgets: state.widgets,
        queries: state.queries,
        jsCode: state.jsCode,
      }),
    }
  )
);
