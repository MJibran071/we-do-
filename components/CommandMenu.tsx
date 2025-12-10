
import React, { useState, useEffect } from 'react';
import { Search, LayoutDashboard, MessageSquare, Calendar, Settings, CreditCard, Moon, Sun, Wrench, User, ArrowRight } from 'lucide-react';
import { Dialog } from '@headlessui/react'; // Using standard divs for simulation if headlessui not available, but sticking to raw React for dependency safety
import { useNavigate } from 'react-router-dom'; // Mocking navigation prop
import { AppMode } from '../types';
import { getTheme } from '../utils/theme';

interface CommandMenuProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setView: (view: any) => void;
  toggleTheme: () => void;
  appMode: AppMode;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({ isOpen, setIsOpen, setView, toggleTheme, appMode }) => {
  const theme = getTheme(appMode);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const actions = [
    { id: 'nav-dash', label: 'Go to Dashboard', icon: LayoutDashboard, action: () => setView('dashboard'), group: 'Navigation' },
    { id: 'nav-inbox', label: 'Go to Inbox', icon: MessageSquare, action: () => setView('inbox'), group: 'Navigation' },
    { id: 'nav-cal', label: 'Go to Calendar', icon: Calendar, action: () => setView('calendar'), group: 'Navigation' },
    { id: 'nav-ops', label: 'Go to Operations', icon: Wrench, action: () => setView('operations'), group: 'Navigation' },
    { id: 'nav-settings', label: 'Go to Settings', icon: Settings, action: () => setView('settings'), group: 'Navigation' },
    { id: 'act-theme', label: 'Toggle Theme', icon: Sun, action: () => toggleTheme(), group: 'Actions' },
    { id: 'act-bill', label: 'View Billing', icon: CreditCard, action: () => setView('billing'), group: 'Actions' },
  ];

  const filteredActions = actions.filter(action => 
    action.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard navigation inside the menu
  useEffect(() => {
      if (!isOpen) return;
      const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'ArrowDown') {
              e.preventDefault();
              setSelectedIndex(prev => (prev + 1) % filteredActions.length);
          } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setSelectedIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
          } else if (e.key === 'Enter') {
              e.preventDefault();
              if (filteredActions[selectedIndex]) {
                  filteredActions[selectedIndex].action();
                  setIsOpen(false);
                  setQuery('');
              }
          }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredActions, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[20vh] px-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)}></div>
      
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-2xl ring-1 ring-black/5 overflow-hidden animate-scale-in">
        <div className="flex items-center px-4 border-b border-gray-100 dark:border-gray-800">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            className="flex-1 h-12 px-3 bg-transparent border-none text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-0 text-sm"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <div className="text-[10px] font-medium text-gray-400 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5">ESC</div>
        </div>

        <div className="max-h-[300px] overflow-y-auto py-2">
          {filteredActions.length === 0 ? (
             <div className="px-4 py-8 text-center text-sm text-gray-500">No results found.</div>
          ) : (
              <>
                {/* Simple grouping logic for demo */}
                <div className="px-2">
                    {filteredActions.map((action, index) => (
                        <button
                            key={action.id}
                            onClick={() => { action.action(); setIsOpen(false); }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-colors ${
                                index === selectedIndex 
                                    ? `${theme.bg} text-white` 
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <action.icon className={`w-4 h-4 ${index === selectedIndex ? 'text-white' : 'text-gray-500'}`} />
                                <span>{action.label}</span>
                            </div>
                            {index === selectedIndex && <ArrowRight className="w-3 h-3 opacity-70" />}
                        </button>
                    ))}
                </div>
              </>
          )}
        </div>
        
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 flex justify-between">
             <span>Use arrow keys to navigate</span>
             <div className="flex gap-2">
                 <span>↵ to select</span>
             </div>
        </div>
      </div>
    </div>
  );
};
