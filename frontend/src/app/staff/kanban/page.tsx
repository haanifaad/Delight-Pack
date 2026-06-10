'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';

type Job = {
  id: string;
  sku: string;
  status: string;
  quantity: number;
};

const STAGES = ['QUEUED', 'PRINTING', 'DIE_CUT', 'QA', 'READY'];

export default function KanbanPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get('/staff/jobs');
      setJobs(data.jobs);
    } catch (e) {
      console.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    const newStatus = destination.droppableId;
    
    // Optimistic update
    setJobs(prev => prev.map(j => j.id === draggableId ? { ...j, status: newStatus } : j));

    try {
      await api.patch(`/staff/jobs/${draggableId}/status`, { status: newStatus });
    } catch (e) {
      console.error('Failed to update status');
      // Revert on fail
      fetchJobs();
    }
  };

  const getJobsByStage = (stage: string) => jobs.filter(j => j.status === stage);

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-amber-500" /></div>;
  }

  return (
    <div className="p-6 h-screen flex flex-col bg-neutral-900">
      <h1 className="text-2xl font-bold text-white mb-6">Live Production Kanban</h1>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 h-full overflow-x-auto pb-4">
          {STAGES.map((stage) => (
            <div key={stage} className="bg-neutral-800 rounded-lg border border-neutral-700 w-80 flex-shrink-0 flex flex-col">
              <div className="p-4 border-b border-neutral-700 bg-neutral-800 rounded-t-lg">
                <h2 className="font-bold text-neutral-300">{stage.replace('_', ' ')}</h2>
                <span className="text-xs text-neutral-500">{getJobsByStage(stage).length} Jobs</span>
              </div>
              
              <Droppable droppableId={stage}>
                {(provided, snapshot) => (
                  <div 
                    ref={provided.innerRef} 
                    {...provided.droppableProps}
                    className={`flex-1 p-4 space-y-3 overflow-y-auto transition-colors ${snapshot.isDraggingOver ? 'bg-neutral-700/50' : ''}`}
                  >
                    {getJobsByStage(stage).map((job, index) => (
                      <Draggable key={job.id} draggableId={job.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-neutral-700 p-4 rounded-md shadow-md border border-neutral-600 ${snapshot.isDragging ? 'ring-2 ring-amber-500' : ''}`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-sm font-mono text-amber-400">{job.sku}</span>
                              <span className="text-xs bg-neutral-900 px-2 py-1 rounded text-neutral-300">Qty: {job.quantity}</span>
                            </div>
                            <p className="text-xs text-neutral-400">ID: {job.id.substring(0, 8)}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
