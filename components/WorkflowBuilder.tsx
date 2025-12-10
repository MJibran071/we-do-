import React, { useState, useCallback } from 'react';
import { Plus, Play, Trash2, Save, Zap, GitBranch, Clock, Mail, MessageSquare, Bell } from 'lucide-react';
import { Workflow, WorkflowTrigger, WorkflowCondition, WorkflowAction, TriggerType } from '../types';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'delay';
  x: number;
  y: number;
  data: any;
}

interface WorkflowBuilderProps {
  workflow?: Workflow;
  onSave: (workflow: Workflow) => void;
  onClose: () => void;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ workflow, onSave, onClose }) => {
  const [name, setName] = useState(workflow?.name || 'New Workflow');
  const [nodes, setNodes] = useState<WorkflowNode[]>(
    workflow ? convertWorkflowToNodes(workflow) : [
      { id: '1', type: 'trigger', x: 50, y: 50, data: { type: 'message_received' } }
    ]
  );
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const addNode = useCallback((type: WorkflowNode['type']) => {
    const newNode: WorkflowNode = {
      id: Date.now().toString(),
      type,
      x: 50,
      y: nodes.length * 100 + 50,
      data: getDefaultNodeData(type)
    };
    setNodes([...nodes, newNode]);
  }, [nodes]);

  const updateNode = useCallback((id: string, data: any) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, data: { ...n.data, ...data } } : n));
  }, [nodes]);

  const deleteNode = useCallback((id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
    if (selectedNode === id) setSelectedNode(null);
  }, [nodes, selectedNode]);

  const handleSave = () => {
    const convertedWorkflow = convertNodesToWorkflow(name, nodes);
    onSave(convertedWorkflow);
  };

  const handleTest = () => {
    alert('Workflow test mode - This would simulate the workflow execution');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-indigo-600" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2"
              placeholder="Workflow Name"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleTest}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4" /> Test
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" /> Save
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Node Palette */}
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Add Nodes</h3>
            
            <div className="space-y-2">
              <button
                onClick={() => addNode('trigger')}
                className="w-full p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg flex items-center gap-2 text-left transition-colors"
              >
                <Zap className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-medium text-sm">Trigger</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Start workflow</div>
                </div>
              </button>

              <button
                onClick={() => addNode('condition')}
                className="w-full p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg flex items-center gap-2 text-left transition-colors"
              >
                <GitBranch className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-sm">Condition</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">If/then logic</div>
                </div>
              </button>

              <button
                onClick={() => addNode('action')}
                className="w-full p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg flex items-center gap-2 text-left transition-colors"
              >
                <Bell className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-sm">Action</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Do something</div>
                </div>
              </button>

              <button
                onClick={() => addNode('delay')}
                className="w-full p-3 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg flex items-center gap-2 text-left transition-colors"
              >
                <Clock className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="font-medium text-sm">Delay</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Wait period</div>
                </div>
              </button>
            </div>

            <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Workflow Stats</h4>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <div>Nodes: {nodes.length}</div>
                <div>Triggers: {nodes.filter(n => n.type === 'trigger').length}</div>
                <div>Actions: {nodes.filter(n => n.type === 'action').length}</div>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-gray-50 dark:bg-gray-950 p-8 overflow-auto relative">
            <div className="space-y-4">
              {nodes.map((node, index) => (
                <div key={node.id}>
                  <WorkflowNodeComponent
                    node={node}
                    isSelected={selectedNode === node.id}
                    onSelect={() => setSelectedNode(node.id)}
                    onUpdate={(data) => updateNode(node.id, data)}
                    onDelete={() => deleteNode(node.id)}
                  />
                  {index < nodes.length - 1 && (
                    <div className="flex justify-center my-2">
                      <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-700"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Properties Panel */}
          {selectedNode && (
            <div className="w-80 border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Node Properties</h3>
              <NodePropertiesPanel
                node={nodes.find(n => n.id === selectedNode)!}
                onUpdate={(data) => updateNode(selectedNode, data)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Workflow Node Component
const WorkflowNodeComponent: React.FC<{
  node: WorkflowNode;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (data: any) => void;
  onDelete: () => void;
}> = ({ node, isSelected, onSelect, onUpdate, onDelete }) => {
  const getNodeIcon = () => {
    switch (node.type) {
      case 'trigger': return <Zap className="w-5 h-5" />;
      case 'condition': return <GitBranch className="w-5 h-5" />;
      case 'action': return <Bell className="w-5 h-5" />;
      case 'delay': return <Clock className="w-5 h-5" />;
    }
  };

  const getNodeColor = () => {
    switch (node.type) {
      case 'trigger': return 'border-purple-500 bg-purple-50 dark:bg-purple-900/20';
      case 'condition': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'action': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      case 'delay': return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${getNodeColor()} ${
        isSelected ? 'ring-2 ring-indigo-500 shadow-lg' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {getNodeIcon()}
          <div>
            <div className="font-medium capitalize">{node.type}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {getNodeDescription(node)}
            </div>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="text-gray-400 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Node Properties Panel
const NodePropertiesPanel: React.FC<{
  node: WorkflowNode;
  onUpdate: (data: any) => void;
}> = ({ node, onUpdate }) => {
  switch (node.type) {
    case 'trigger':
      return <TriggerProperties data={node.data} onUpdate={onUpdate} />;
    case 'condition':
      return <ConditionProperties data={node.data} onUpdate={onUpdate} />;
    case 'action':
      return <ActionProperties data={node.data} onUpdate={onUpdate} />;
    case 'delay':
      return <DelayProperties data={node.data} onUpdate={onUpdate} />;
    default:
      return null;
  }
};

// Trigger Properties
const TriggerProperties: React.FC<{ data: any; onUpdate: (data: any) => void }> = ({ data, onUpdate }) => (
  <div className="space-y-3">
    <div>
      <label className="block text-sm font-medium mb-1">Trigger Type</label>
      <select
        value={data.type}
        onChange={(e) => onUpdate({ type: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
      >
        <option value="message_received">Message Received</option>
        <option value="booking_created">Booking Created</option>
        <option value="checkout_completed">Checkout Completed</option>
        <option value="negative_sentiment">Negative Sentiment</option>
        <option value="maintenance_reported">Maintenance Reported</option>
      </select>
    </div>
  </div>
);

// Condition Properties
const ConditionProperties: React.FC<{ data: any; onUpdate: (data: any) => void }> = ({ data, onUpdate }) => (
  <div className="space-y-3">
    <div>
      <label className="block text-sm font-medium mb-1">Field</label>
      <input
        type="text"
        value={data.field || ''}
        onChange={(e) => onUpdate({ field: e.target.value })}
        placeholder="e.g., priority"
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Operator</label>
      <select
        value={data.operator || 'equals'}
        onChange={(e) => onUpdate({ operator: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
      >
        <option value="equals">Equals</option>
        <option value="contains">Contains</option>
        <option value="greater_than">Greater Than</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Value</label>
      <input
        type="text"
        value={data.value || ''}
        onChange={(e) => onUpdate({ value: e.target.value })}
        placeholder="e.g., High"
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
      />
    </div>
  </div>
);

// Action Properties
const ActionProperties: React.FC<{ data: any; onUpdate: (data: any) => void }> = ({ data, onUpdate }) => (
  <div className="space-y-3">
    <div>
      <label className="block text-sm font-medium mb-1">Action Type</label>
      <select
        value={data.type || 'send_message'}
        onChange={(e) => onUpdate({ type: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
      >
        <option value="send_message">Send Message</option>
        <option value="send_email">Send Email</option>
        <option value="create_ticket">Create Ticket</option>
        <option value="notify_team">Notify Team</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Message</label>
      <textarea
        value={data.message || ''}
        onChange={(e) => onUpdate({ message: e.target.value })}
        placeholder="Enter message content..."
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
      />
    </div>
  </div>
);

// Delay Properties
const DelayProperties: React.FC<{ data: any; onUpdate: (data: any) => void }> = ({ data, onUpdate }) => (
  <div className="space-y-3">
    <div>
      <label className="block text-sm font-medium mb-1">Duration</label>
      <input
        type="number"
        value={data.duration || 1}
        onChange={(e) => onUpdate({ duration: parseInt(e.target.value) })}
        min="1"
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Unit</label>
      <select
        value={data.unit || 'minutes'}
        onChange={(e) => onUpdate({ unit: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
      >
        <option value="minutes">Minutes</option>
        <option value="hours">Hours</option>
        <option value="days">Days</option>
      </select>
    </div>
  </div>
);

// Helper functions
function getDefaultNodeData(type: WorkflowNode['type']): any {
  switch (type) {
    case 'trigger':
      return { type: 'message_received' };
    case 'condition':
      return { field: '', operator: 'equals', value: '' };
    case 'action':
      return { type: 'send_message', message: '' };
    case 'delay':
      return { duration: 1, unit: 'minutes' };
  }
}

function getNodeDescription(node: WorkflowNode): string {
  switch (node.type) {
    case 'trigger':
      return node.data.type?.replace(/_/g, ' ') || 'Not configured';
    case 'condition':
      return `${node.data.field} ${node.data.operator} ${node.data.value}` || 'Not configured';
    case 'action':
      return node.data.type?.replace(/_/g, ' ') || 'Not configured';
    case 'delay':
      return `Wait ${node.data.duration} ${node.data.unit}` || 'Not configured';
    default:
      return '';
  }
}

function convertWorkflowToNodes(workflow: Workflow): WorkflowNode[] {
  const nodes: WorkflowNode[] = [];
  
  nodes.push({
    id: '1',
    type: 'trigger',
    x: 50,
    y: 50,
    data: workflow.trigger
  });

  workflow.conditions.forEach((cond, i) => {
    nodes.push({
      id: `cond-${i}`,
      type: 'condition',
      x: 50,
      y: 150 + i * 100,
      data: cond
    });
  });

  workflow.actions.forEach((action, i) => {
    nodes.push({
      id: `action-${i}`,
      type: 'action',
      x: 50,
      y: 150 + workflow.conditions.length * 100 + i * 100,
      data: action
    });
  });

  return nodes;
}

function convertNodesToWorkflow(name: string, nodes: WorkflowNode[]): Workflow {
  const triggerNode = nodes.find(n => n.type === 'trigger');
  const conditionNodes = nodes.filter(n => n.type === 'condition');
  const actionNodes = nodes.filter(n => n.type === 'action');

  return {
    id: Date.now().toString(),
    name,
    active: true,
    trigger: triggerNode?.data || { type: 'message_received' },
    conditions: conditionNodes.map(n => n.data),
    actions: actionNodes.map(n => n.data),
    runs: 0
  };
}
