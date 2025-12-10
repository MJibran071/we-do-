
import React, { useState, useRef, useEffect } from 'react';
import { LayoutItem, AppMode } from '../types';
import { Square, Circle, Box, ArrowRight, Move, RotateCw, Trash2, Maximize2, Type, Users, Save, X, GripHorizontal, DoorOpen, Flower2, LayoutGrid, Armchair, Car } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { getTheme } from '../utils/theme';

interface LayoutBuilderProps {
    initialItems: LayoutItem[];
    onSave: (items: LayoutItem[]) => void;
    onCancel: () => void;
    appMode: AppMode;
    currentTheme?: 'light' | 'dark';
}

export const LayoutBuilder: React.FC<LayoutBuilderProps> = ({ initialItems, onSave, onCancel, appMode, currentTheme = 'light' }) => {
    const theme = getTheme(appMode);
    const [items, setItems] = useState<LayoutItem[]>(initialItems);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const selectedItem = items.find(i => i.id === selectedId);

    // --- Drag Logic ---
    const handleDragStart = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setSelectedId(id);
        const item = items.find(i => i.id === id);
        if (!item || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        
        // Calculate offset from item's top-left corner
        const itemX = (item.x / 100) * containerRect.width;
        const itemY = (item.y / 100) * containerRect.height;
        
        setDragOffset({
            x: e.clientX - containerRect.left - itemX,
            y: e.clientY - containerRect.top - itemY
        });
        
        setIsDragging(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !selectedId || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        
        // Calculate new position relative to container
        let newXPx = e.clientX - containerRect.left - dragOffset.x;
        let newYPx = e.clientY - containerRect.top - dragOffset.y;

        // Grid Snap (5%)
        const snap = 2; // snap to 2% grid for smoother but aligned feel
        let newX = (newXPx / containerRect.width) * 100;
        let newY = (newYPx / containerRect.height) * 100;

        newX = Math.round(newX / snap) * snap;
        newY = Math.round(newY / snap) * snap;

        // Boundaries
        newX = Math.max(0, Math.min(95, newX));
        newY = Math.max(0, Math.min(95, newY));

        setItems(prev => prev.map(item => item.id === selectedId ? { ...item, x: newX, y: newY } : item));
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // --- Actions ---
    const addItem = (type: LayoutItem['type']) => {
        const newItem: LayoutItem = {
            id: `item-${Date.now()}`,
            type,
            x: 45, // Center
            y: 45,
            width: type === 'wall' ? 20 : type === 'zone' ? 30 : 10,
            height: type === 'wall' ? 2 : type === 'zone' ? 30 : 10,
            rotation: 0,
            label: type.includes('table') ? `T${items.length + 1}` : type === 'zone' ? 'Zone' : '',
            capacity: type.includes('table') ? 4 : undefined,
            color: type === 'zone' ? 'bg-blue-100/30' : 'bg-white'
        };
        setItems([...items, newItem]);
        setSelectedId(newItem.id);
    };

    const updateItem = (updates: Partial<LayoutItem>) => {
        if (!selectedId) return;
        setItems(prev => prev.map(item => item.id === selectedId ? { ...item, ...updates } : item));
    };

    const deleteItem = () => {
        if (!selectedId) return;
        setItems(prev => prev.filter(i => i.id !== selectedId));
        setSelectedId(null);
    };

    const renderItem = (item: LayoutItem) => {
        const isSelected = selectedId === item.id;
        
        let content = null;
        let baseStyle = `absolute flex items-center justify-center cursor-move transition-shadow ${isSelected ? 'ring-2 ring-blue-500 z-50 shadow-xl' : 'z-10 hover:ring-1 hover:ring-blue-300'}`;
        
        switch (item.type) {
            case 'table-rect':
                content = (
                    <div className="w-full h-full bg-white dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 rounded-sm flex items-center justify-center shadow-sm">
                        <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">{item.label}</span>
                    </div>
                );
                break;
            case 'table-round':
                content = (
                    <div className="w-full h-full bg-white dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">{item.label}</span>
                    </div>
                );
                break;
            case 'chair':
                content = (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg border border-gray-400 dark:border-gray-600"></div>
                );
                break;
            case 'wall':
                content = (
                    <div className="w-full h-full bg-gray-800 dark:bg-gray-200 shadow-md"></div>
                );
                break;
            case 'zone':
                content = (
                    <div className={`w-full h-full border-2 border-dashed border-blue-300 dark:border-blue-700 flex items-center justify-center ${item.color || 'bg-blue-50/50'}`}>
                        <span className="text-xs font-bold text-blue-500/50 uppercase tracking-widest">{item.label}</span>
                    </div>
                );
                baseStyle += " z-0"; // Zones behind
                break;
            case 'door':
                content = (
                    <div className="w-full h-full bg-transparent border-b-4 border-amber-600 dark:border-amber-500 relative">
                        <div className="absolute top-0 right-0 w-full h-full border-t-2 border-r-2 border-dashed border-gray-300 rounded-tr-full origin-bottom-left transform"></div>
                    </div>
                );
                break;
            case 'plant':
                content = (
                    <div className="w-full h-full flex items-center justify-center text-green-600 dark:text-green-400">
                        <Flower2 className="w-full h-full" />
                    </div>
                );
                break;
        }

        return (
            <div
                key={item.id}
                onMouseDown={(e) => handleDragStart(e, item.id)}
                className={baseStyle}
                style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    width: `${item.width}%`,
                    height: `${item.height}%`,
                    transform: `rotate(${item.rotation}deg)`
                }}
            >
                {content}
                {/* Resize Handle (Simplistic bottom-right) */}
                {isSelected && item.type !== 'chair' && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize" />
                )}
            </div>
        );
    };

    const isRestaurant = appMode === 'restaurant';
    const isRetail = appMode === 'ecommerce';
    const isAuto = appMode === 'automotive';

    return (
        <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-950 animate-fade-in relative overflow-hidden">
            {/* Header - Fixed overlap by moving actions to the left */}
            <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-6 z-20 shrink-0 gap-4">
                <div className="flex items-center gap-2">
                    <LayoutGrid className={`w-5 h-5 ${theme.text}`} />
                    <h2 className="font-bold text-gray-900 dark:text-white">Layout Builder</h2>
                    <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">Visual Editor</span>
                </div>
                
                <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2"></div>

                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
                    <Button size="sm" onClick={() => onSave(items)} className={`${theme.bg} ${theme.hover} text-white`}>
                        <Save className="w-4 h-4 mr-2" /> Save Layout
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Toolbar */}
                <div className="w-20 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col items-center py-4 gap-4 z-20 shadow-lg">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Assets</div>
                    
                    <button onClick={() => addItem('table-rect')} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border hover:border-blue-500 transition-colors group relative" title={isRetail ? "Shelf" : "Table (Rect)"}>
                        <Square className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        <span className="absolute left-full ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">{isRetail ? "Shelf" : "Table (Rect)"}</span>
                    </button>
                    
                    {(isRestaurant || appMode === 'event') && (
                        <button onClick={() => addItem('table-round')} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border hover:border-blue-500 transition-colors group relative" title="Round Table">
                            <Circle className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                            <span className="absolute left-full ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">Table (Round)</span>
                        </button>
                    )}

                    <button onClick={() => addItem('chair')} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border hover:border-blue-500 transition-colors group relative" title={isAuto ? "Bay" : "Chair"}>
                        {isAuto ? <Car className="w-6 h-6 text-gray-600" /> : <Armchair className="w-6 h-6 text-gray-600" />}
                        <span className="absolute left-full ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">{isAuto ? "Car Bay" : "Chair"}</span>
                    </button>

                    <div className="w-10 h-px bg-gray-200 dark:bg-gray-800"></div>
                    
                    <button onClick={() => addItem('wall')} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border hover:border-blue-500 transition-colors group relative" title="Wall">
                        <div className="w-6 h-1 bg-gray-800 dark:bg-gray-300"></div>
                        <span className="absolute left-full ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">Wall</span>
                    </button>
                    <button onClick={() => addItem('door')} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border hover:border-blue-500 transition-colors group relative" title="Door">
                        <DoorOpen className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        <span className="absolute left-full ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">Door</span>
                    </button>
                    <button onClick={() => addItem('zone')} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border hover:border-blue-500 transition-colors group relative" title="Zone">
                        <Box className="w-6 h-6 text-blue-500" />
                        <span className="absolute left-full ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">Zone Area</span>
                    </button>
                    <button onClick={() => addItem('plant')} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border hover:border-blue-500 transition-colors group relative" title="Plant">
                        <Flower2 className="w-6 h-6 text-green-600" />
                        <span className="absolute left-full ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">Decor</span>
                    </button>
                </div>

                {/* Canvas */}
                <div 
                    ref={containerRef}
                    className="flex-1 relative bg-white dark:bg-slate-900 overflow-hidden cursor-crosshair"
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onClick={() => setSelectedId(null)}
                    style={{
                        backgroundImage: `linear-gradient(to right, ${currentTheme === 'light' ? '#e5e7eb' : '#334155'} 1px, transparent 1px), linear-gradient(to bottom, ${currentTheme === 'light' ? '#e5e7eb' : '#334155'} 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                >
                    <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded pointer-events-none">
                        Canvas Size: 100% x 100%
                    </div>
                    {items.map(renderItem)}
                </div>

                {/* Properties Panel */}
                <div className={`w-64 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 p-4 transition-all duration-300 ${selectedId ? 'translate-x-0' : 'translate-x-full absolute right-0 h-full'}`}>
                    {selectedItem ? (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-sm uppercase text-gray-500">Properties</h3>
                                <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500 hover:bg-red-50" onClick={deleteItem}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1"><Type className="w-3 h-3" /> Label</label>
                                    <Input value={selectedItem.label || ''} onChange={(e) => updateItem({ label: e.target.value })} className="h-8" />
                                </div>

                                {(selectedItem.type.includes('table') || selectedItem.type === 'zone') && (
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1"><Users className="w-3 h-3" /> Capacity</label>
                                        <Input type="number" value={selectedItem.capacity || 0} onChange={(e) => updateItem({ capacity: parseInt(e.target.value) })} className="h-8" />
                                    </div>
                                )}

                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1"><RotateCw className="w-3 h-3" /> Rotation ({selectedItem.rotation}°)</label>
                                    <input 
                                        type="range" min="0" max="360" step="15" 
                                        value={selectedItem.rotation} 
                                        onChange={(e) => updateItem({ rotation: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1"><GripHorizontal className="w-3 h-3" /> Width</label>
                                        <Input type="number" value={selectedItem.width} onChange={(e) => updateItem({ width: parseInt(e.target.value) })} className="h-8" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1"><Maximize2 className="w-3 h-3" /> Height</label>
                                        <Input type="number" value={selectedItem.height} onChange={(e) => updateItem({ height: parseInt(e.target.value) })} className="h-8" />
                                    </div>
                                </div>
                                
                                {selectedItem.type === 'zone' && (
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 mb-1 block">Color Code</label>
                                        <div className="flex gap-2">
                                            {['bg-blue-100/30', 'bg-red-100/30', 'bg-green-100/30', 'bg-yellow-100/30'].map(c => (
                                                <button 
                                                    key={c}
                                                    onClick={() => updateItem({ color: c })}
                                                    className={`w-6 h-6 rounded-full border ${c.replace('/30','')} ${selectedItem.color === c ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-center text-gray-400">
                            <div>
                                <Move className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                <p className="text-sm">Select an item to edit</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
