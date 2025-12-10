
import React, { useState, useEffect } from 'react';
import { AIModel, TaskAssignment, AIProvider, AppMode } from '../types';
import { BrainCircuit, Cpu, Zap, Plus, Trash2, Server, CheckCircle, ExternalLink, Sparkles, Image as ImageIcon, Activity, Gauge } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { getTheme } from '../utils/theme';
import { logger } from '../utils/logger';
import { updateTaskAssignments } from '../services/dataService';

interface ModelsProps {
    models: AIModel[];
    setModels: React.Dispatch<React.SetStateAction<AIModel[]>>;
    taskAssignments: TaskAssignment;
    setTaskAssignments: React.Dispatch<React.SetStateAction<TaskAssignment>>;
    appMode: AppMode;
}

const Models: React.FC<ModelsProps> = ({ models, setModels, taskAssignments, setTaskAssignments, appMode }) => {
    const theme = getTheme(appMode);

    // Config State
    const [isAdding, setIsAdding] = useState(false);
    const [newModel, setNewModel] = useState<Partial<AIModel>>({
        provider: 'Custom',
        name: '',
        modelId: ''
    });
    const [testingModelId, setTestingModelId] = useState<string | null>(null);
    const [modelLatencies, setModelLatencies] = useState<Record<string, number | 'Error'>>({});

    // Save task assignments to backend when they change
    useEffect(() => {
        const saveAssignments = async () => {
            try {
                await updateTaskAssignments(taskAssignments);
            } catch (error) {
                logger.error('Failed to save task assignments', error);
            }
        };
        saveAssignments();
    }, [taskAssignments]);

    const handleAddModel = () => {
        if (!newModel.name || !newModel.modelId) return;
        const model: AIModel = {
            id: Date.now().toString(),
            name: newModel.name,
            provider: newModel.provider as AIProvider,
            modelId: newModel.modelId,
            apiKey: newModel.apiKey,
            endpoint: newModel.endpoint
        };
        setModels(prev => [...prev, model]);
        setIsAdding(false);
        setNewModel({ provider: 'Custom', name: '', modelId: '' });
    };

    const handleDeleteModel = (id: string) => {
        setModels(prev => prev.filter(m => m.id !== id));
        // Reset assignments if deleted model was used
        if (taskAssignments.drafting === id) setTaskAssignments(prev => ({ ...prev, drafting: models[0].id }));
        if (taskAssignments.analysis === id) setTaskAssignments(prev => ({ ...prev, analysis: models[0].id }));
        if (taskAssignments.quickReplies === id) setTaskAssignments(prev => ({ ...prev, quickReplies: models[0].id }));
        if (taskAssignments.imageGeneration === id) setTaskAssignments(prev => ({ ...prev, imageGeneration: models[0].id }));
    };

    const handleTestLatency = async (model: AIModel) => {
        setTestingModelId(model.id);
        const start = performance.now();

        try {
            // Simulate network request for demo purposes to prevent client-side env issues
            await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));

            const duration = Math.round(performance.now() - start);
            setModelLatencies(prev => ({ ...prev, [model.id]: duration }));
        } catch (error) {
            logger.error("Model latency test failed", error);
            setModelLatencies(prev => ({ ...prev, [model.id]: 'Error' }));
        } finally {
            setTestingModelId(null);
        }
    };

    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Models & API</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Manage AI providers, task routing, and performance testing.</p>
                </div>
            </div>

            <div className="space-y-8 animate-slide-up">
                {/* Task Assignments */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                    <Card className="border-indigo-200 bg-indigo-50/30 dark:bg-indigo-900/10 dark:border-indigo-800">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <BrainCircuit className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                <CardTitle className="text-sm">Drafting & Reasoning</CardTitle>
                            </div>
                            <CardDescription className="text-xs">Generating full message drafts.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <select
                                className="w-full h-9 rounded-md border border-indigo-200 bg-white dark:bg-gray-900 dark:border-indigo-800 dark:text-gray-100 px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                                value={taskAssignments.drafting}
                                onChange={(e) => setTaskAssignments(prev => ({ ...prev, drafting: e.target.value }))}
                            >
                                {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </CardContent>
                    </Card>

                    <Card className="border-purple-200 bg-purple-50/30 dark:bg-purple-900/10 dark:border-purple-800">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                <CardTitle className="text-sm">Fast Analysis & Tagging</CardTitle>
                            </div>
                            <CardDescription className="text-xs">Sentiment & priority classification.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <select
                                className="w-full h-9 rounded-md border border-purple-200 bg-white dark:bg-gray-900 dark:border-purple-800 dark:text-gray-100 px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500"
                                value={taskAssignments.analysis}
                                onChange={(e) => setTaskAssignments(prev => ({ ...prev, analysis: e.target.value }))}
                            >
                                {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </CardContent>
                    </Card>

                    <Card className="border-amber-200 bg-amber-50/30 dark:bg-amber-900/10 dark:border-amber-800">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <Cpu className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                <CardTitle className="text-sm">Quick Replies</CardTitle>
                            </div>
                            <CardDescription className="text-xs">Generating instant smart chips.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <select
                                className="w-full h-9 rounded-md border border-amber-200 bg-white dark:bg-gray-900 dark:border-amber-800 dark:text-gray-100 px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
                                value={taskAssignments.quickReplies}
                                onChange={(e) => setTaskAssignments(prev => ({ ...prev, quickReplies: e.target.value }))}
                            >
                                {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </CardContent>
                    </Card>

                    <Card className="border-pink-200 bg-pink-50/30 dark:bg-pink-900/10 dark:border-pink-800">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                                <CardTitle className="text-sm">Image Generation</CardTitle>
                            </div>
                            <CardDescription className="text-xs">Visuals for marketing campaigns.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <select
                                className="w-full h-9 rounded-md border border-pink-200 bg-white dark:bg-gray-900 dark:border-pink-800 dark:text-gray-100 px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pink-500"
                                value={taskAssignments.imageGeneration}
                                onChange={(e) => setTaskAssignments(prev => ({ ...prev, imageGeneration: e.target.value }))}
                            >
                                {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </CardContent>
                    </Card>
                </div>

                {/* Model List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Configured Models</h2>
                        <Button onClick={() => setIsAdding(!isAdding)} className={`${theme.bg} ${theme.hover} text-white`}>
                            <Plus className="w-4 h-4 mr-2" /> Add Custom Model
                        </Button>
                    </div>

                    {isAdding && (
                        <Card className="mb-6 border-dashed border-2 border-gray-200 dark:border-gray-700 shadow-none animate-fade-in">
                            <CardHeader>
                                <CardTitle>Add New Model</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1 block text-gray-700 dark:text-gray-300">Friendly Name</label>
                                        <Input
                                            placeholder="e.g. My Custom GPT"
                                            value={newModel.name}
                                            onChange={e => setNewModel(prev => ({ ...prev, name: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block text-gray-700 dark:text-gray-300">Provider</label>
                                        <select
                                            className="flex h-9 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-transparent dark:bg-gray-900 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 dark:text-gray-100"
                                            value={newModel.provider}
                                            onChange={e => setNewModel(prev => ({ ...prev, provider: e.target.value as AIProvider }))}
                                        >
                                            <option value="Custom">Custom HTTP</option>
                                            <option value="Google Gemini">Google Gemini</option>
                                            <option value="OpenAI">OpenAI</option>
                                            <option value="Anthropic">Anthropic</option>
                                            <option value="DeepSeek">DeepSeek</option>
                                            <option value="xAI">xAI (Grok)</option>
                                            <option value="Meta">Meta Llama</option>
                                            <option value="Mistral">Mistral</option>
                                            <option value="OpenRouter">OpenRouter</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block text-gray-700 dark:text-gray-300">Model ID / Deployment Name</label>
                                        <Input
                                            placeholder="e.g. gpt-4-turbo, gemini-1.5-pro, deepseek-r1"
                                            value={newModel.modelId}
                                            onChange={e => setNewModel(prev => ({ ...prev, modelId: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block text-gray-700 dark:text-gray-300">API Key (Optional)</label>
                                        <Input
                                            type="password"
                                            placeholder="sk-..."
                                            value={newModel.apiKey || ''}
                                            onChange={e => setNewModel(prev => ({ ...prev, apiKey: e.target.value }))}
                                        />
                                    </div>
                                    {newModel.provider === 'Custom' && (
                                        <div className="md:col-span-2">
                                            <label className="text-sm font-medium mb-1 block text-gray-700 dark:text-gray-300">Endpoint URL</label>
                                            <Input
                                                placeholder="https://api.custom-llm.com/v1/completions"
                                                value={newModel.endpoint || ''}
                                                onChange={e => setNewModel(prev => ({ ...prev, endpoint: e.target.value }))}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                                    <Button onClick={handleAddModel} className={`${theme.bg} ${theme.hover} text-white`}>Save Configuration</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {models.map(model => (
                            <Card key={model.id} className={`group relative hover:${theme.border} dark:hover:border-opacity-50 transition-all`}>
                                <CardContent className="p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${model.provider === 'Google Gemini' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                                                {model.provider === 'Google Gemini' ? <Sparkles className="w-5 h-5" /> : <Server className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">{model.name}</h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{model.modelId}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`text-xs h-7 gap-1 ${modelLatencies[model.id] ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : 'text-gray-500'}`}
                                                onClick={() => handleTestLatency(model)}
                                                disabled={testingModelId === model.id}
                                            >
                                                {testingModelId === model.id ? (
                                                    <Activity className="w-3 h-3 animate-spin" />
                                                ) : modelLatencies[model.id] ? (
                                                    <span className="font-mono">{modelLatencies[model.id]}ms</span>
                                                ) : (
                                                    <>Test <Gauge className="w-3 h-3" /></>
                                                )}
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                                                onClick={() => handleDeleteModel(model.id)}
                                                disabled={model.provider === 'Google Gemini'}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-4">
                                        <Badge variant="outline" className="text-[10px] text-gray-500 dark:text-gray-400 font-normal border-gray-200 dark:border-gray-700">
                                            {model.provider}
                                        </Badge>
                                        {model.endpoint && (
                                            <Badge variant="outline" className="text-[10px] text-gray-500 dark:text-gray-400 font-normal flex gap-1 items-center border-gray-200 dark:border-gray-700">
                                                <ExternalLink className="w-3 h-3" /> Custom Endpoint
                                            </Badge>
                                        )}
                                        {model.provider === 'Google Gemini' && (
                                            <Badge variant="secondary" className="text-[10px] bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 gap-1 border-0">
                                                <CheckCircle className="w-3 h-3" /> Verified
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Models;

