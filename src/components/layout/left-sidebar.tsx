'use client';

import React, {useEffect, useState} from 'react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Input} from '@/components/ui/input';
import JsonView from '@uiw/react-json-view';
import {
  Search,
  PlusCircle,
  ChevronDown,
  ChevronRight,
  Layout as LayoutIcon,
  Square as SquareIcon,
  Table as TableIcon,
  ImageIcon,
  CalendarIcon,
  BarChartIcon,
  ListIcon,
  BoxIcon,
  TypeIcon,
  DatabaseIcon,
  ServerIcon,
  GlobeIcon,
} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import WidgetItem from './widget-item';
import { useEditorStore } from '@/store/editor-store';

const widgets = [
  {id: 'button', name: 'Button', icon: <SquareIcon className='h-4 w-4' />},
  {id: 'input', name: 'Input', icon: <TypeIcon className='h-4 w-4' />},
  {id: 'table', name: 'Table', icon: <TableIcon className='h-4 w-4' />},
  {id: 'container', name: 'Container', icon: <BoxIcon className='h-4 w-4' />},
  {id: 'image', name: 'Image', icon: <ImageIcon className='h-4 w-4' />},
  {id: 'list', name: 'List', icon: <ListIcon className='h-4 w-4' />},
  {
    id: 'calendar',
    name: 'Calendar',
    icon: <CalendarIcon className='h-4 w-4' />,
  },
  {id: 'chart', name: 'Chart', icon: <BarChartIcon className='h-4 w-4' />},
];

const dataSources = [
  {
    id: 'postgres',
    name: 'PostgreSQL',
    icon: <DatabaseIcon className='h-4 w-4' />,
  },
  {id: 'mysql', name: 'MySQL', icon: <DatabaseIcon className='h-4 w-4' />},
  {id: 'mongodb', name: 'MongoDB', icon: <DatabaseIcon className='h-4 w-4' />},
  {id: 'rest-api', name: 'REST API', icon: <GlobeIcon className='h-4 w-4' />},
  {id: 'graphql', name: 'GraphQL', icon: <ServerIcon className='h-4 w-4' />},
];

const queries = [
  {id: 'query1', name: 'getUserData', type: 'postgres', active: true},
  {id: 'query2', name: 'fetchProducts', type: 'rest-api', active: false},
];

const pages = [
  {id: 'page1', name: 'Page1', active: true},
  {id: 'page2', name: 'Page2', active: false},
];

export function LeftSidebar() {
  const { widgets } = useEditorStore((state) => state);
  const { datasource } = useEditorStore((state) => state);
  const updateDataSource = useEditorStore((state) => state.updateDataSource);

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPages, setExpandedPages] = useState(true);
  const [expandedQueries, setExpandedQueries] = useState(true);
  const [expandedDatasources, setExpandedDatasources] = useState(true);

  const filteredWidgets = widgets.filter((widget) =>
    widget.name && widget.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // console.log("🚀 ~ LeftSidebar ~ filteredWidgets:", filteredWidgets)

  const filteredDatasources = dataSources.filter((datasource) =>
    datasource.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    // console.log('🚀 ~ moveCard ~ dragIndex:', dragIndex, hoverIndex);
  };
  
  useEffect(() => {
    updateDataSource()
  }, [])

  return (
    <div className='h-full border-r bg-background flex flex-col'>
      <Tabs defaultValue='explorer' className='flex flex-col h-full'>
        <div className='border-b px-1'>
          <TabsList className='w-full justify-start my-1'>
            <TabsTrigger value='explorer' className='flex-1'>
              Explorer
            </TabsTrigger>
            <TabsTrigger value='widgets' className='flex-1'>
              Widgets
            </TabsTrigger>
            <TabsTrigger value='queries' className='flex-1'>
              Queries
            </TabsTrigger>
            <TabsTrigger value='datasource' className='flex-1'>
              Datasource
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value='explorer' className='flex-1 p-0'>
          <div className='p-2 flex justify-between items-center'>
            <h3 className='text-sm font-medium'>Pages</h3>
            <Button size='icon' variant='ghost' className='h-6 w-6'>
              <PlusCircle className='h-4 w-4' />
            </Button>
          </div>
          <div
            className='flex items-center px-2 py-1 cursor-pointer hover:bg-muted text-sm'
            onClick={() => setExpandedPages(!expandedPages)}
          >
            {expandedPages ? (
              <ChevronDown className='h-4 w-4 mr-1' />
            ) : (
              <ChevronRight className='h-4 w-4 mr-1' />
            )}
            <LayoutIcon className='h-4 w-4 mr-2' />
            <span>Pages</span>
          </div>

          {expandedPages && (
            <div className='ml-6 space-y-1'>
              {pages.map((page) => (
                <div
                  key={page.id}
                  className={cn(
                    'flex items-center px-2 py-1 text-sm rounded-md cursor-pointer',
                    page.active ? 'bg-muted' : 'hover:bg-muted/50'
                  )}
                >
                  <span>{page.name}</span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value='widgets' className='flex-1 p-0 flex flex-col'>
          <div className='p-2'>
            <div className='relative'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                type='search'
                placeholder='Search widgets...'
                className='pl-8'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className='flex-1'>
            <div className='grid grid-cols-2 gap-2 p-3'>
              {filteredWidgets.map((widget, index) => (
                <WidgetItem
                  key={widget.id}
                  id={widget.id}
                  widget={widget}
                  index={index}
                  moveCard={moveCard}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value='datasource' className='flex-1 p-0 flex flex-col'>
          <div className='w-full h-full py-2'>
            {/* <div className='px-4 py-2 mb-1 text-sm font-semibold'>变量系统</div> */}
            <div className='w-full h-[100vh] px-4 overflow-auto'>
              <JsonView
                value={datasource}
                enableClipboard={false}
                displayObjectSize={false}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value='queries' className='flex-1 p-0 flex flex-col'>
          <div className='p-2'>
            <div className='relative'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                type='search'
                placeholder='Search queries and datasources...'
                className='pl-8'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className='flex-1'>
            <div className='px-2 py-1 mt-2'>
              <div className='flex justify-between items-center mb-1'>
                <h3 className='text-sm font-medium'>Datasources</h3>
                <Button size='icon' variant='ghost' className='h-6 w-6'>
                  <PlusCircle className='h-4 w-4' />
                </Button>
              </div>

              <div
                className='flex items-center px-2 py-1 cursor-pointer hover:bg-muted text-sm'
                onClick={() => setExpandedDatasources(!expandedDatasources)}
              >
                {expandedDatasources ? (
                  <ChevronDown className='h-4 w-4 mr-1' />
                ) : (
                  <ChevronRight className='h-4 w-4 mr-1' />
                )}
                <DatabaseIcon className='h-4 w-4 mr-2' />
                <span>Datasources</span>
              </div>

              {expandedDatasources && (
                <div className='ml-6 space-y-1 mt-1'>
                  {filteredDatasources.map((datasource) => (
                    <div
                      key={datasource.id}
                      className='flex items-center px-2 py-1 text-sm rounded-md cursor-pointer hover:bg-muted/50'
                    >
                      {datasource.icon}
                      <span className='ml-2'>{datasource.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className='px-2 py-1 mt-3'>
              <div className='flex justify-between items-center mb-1'>
                <h3 className='text-sm font-medium'>Queries</h3>
                <Button size='icon' variant='ghost' className='h-6 w-6'>
                  <PlusCircle className='h-4 w-4' />
                </Button>
              </div>

              <div
                className='flex items-center px-2 py-1 cursor-pointer hover:bg-muted text-sm'
                onClick={() => setExpandedQueries(!expandedQueries)}
              >
                {expandedQueries ? (
                  <ChevronDown className='h-4 w-4 mr-1' />
                ) : (
                  <ChevronRight className='h-4 w-4 mr-1' />
                )}
                <ServerIcon className='h-4 w-4 mr-2' />
                <span>Queries</span>
              </div>

              {expandedQueries && (
                <div className='ml-6 space-y-1 mt-1'>
                  {queries.map((query) => (
                    <div
                      key={query.id}
                      className={cn(
                        'flex items-center px-2 py-1 text-sm rounded-md cursor-pointer',
                        query.active ? 'bg-muted' : 'hover:bg-muted/50'
                      )}
                    >
                      {query.type === 'postgres' ||
                      query.type === 'mysql' ||
                      query.type === 'mongodb' ? (
                        <DatabaseIcon className='h-4 w-4 mr-2' />
                      ) : query.type === 'rest-api' ? (
                        <GlobeIcon className='h-4 w-4 mr-2' />
                      ) : (
                        <ServerIcon className='h-4 w-4 mr-2' />
                      )}
                      <span>{query.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
