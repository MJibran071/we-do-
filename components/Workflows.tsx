import React, { useState, useEffect } from 'react';
import { Workflow, TriggerType, WorkflowCondition, WorkflowAction, AppMode } from '../types';
import { Play, Pause, Plus, ArrowRight, Zap, MessageSquare, AlertTriangle, Trash2, GitFork, Calendar, LogOut, Check, X, Save, ChevronDown, Mail, Bell, Send, Ticket, MousePointerClick, UtensilsCrossed, ShoppingBag, Truck, Package, RefreshCw, Star, Clock, CreditCard, UserCheck, Wrench, PartyPopper, Heart, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { getTheme } from '../utils/theme';

interface WorkflowsProps {
    appMode: AppMode;
}

// Dynamic Configuration based on Business Type
const getWorkflowOptions = (mode: AppMode) => {
    const commonTriggers = [
        { type: 'message_received', label: 'Message Received', desc: 'When a customer sends a text', icon: MessageSquare, color: 'text-blue-500' },
        { type: 'negative_sentiment', label: 'Negative Sentiment', desc: 'AI detects angry message', icon: AlertTriangle, color: 'text-red-500' },
    ];

    const commonActions = [
        { type: 'notify_team', label: 'Notify Team', desc: 'Send internal alert (Slack/SMS)', icon: Bell, color: 'text-orange-500' },
        { type: 'send_message', label: 'Auto Reply', desc: 'Send AI-drafted response', icon: Send, color: 'text-green-500' },
        { type: 'send_email', label: 'Send Email', desc: 'Send formal email notification', icon: Mail, color: 'text-blue-500' },
    ];

    switch (mode) {
        case 'service':
            return {
                triggers: [
                    ...commonTriggers,
                    { type: 'appointment_booked', label: 'Appt Booked', desc: 'New appointment confirmed', icon: Calendar, color: 'text-cyan-500' },
                    { type: 'no_show', label: 'Client No-Show', desc: 'Client missed appointment', icon: UserCheck, color: 'text-red-500' },
                    { type: 'treatment_completed', label: 'Treatment Done', desc: 'Service marked complete', icon: Heart, color: 'text-pink-500' },
                ],
                actions: [
                    ...commonActions,
                    { type: 'send_survey', label: 'Send Survey', desc: 'Request feedback', icon: Star, color: 'text-yellow-500' },
                    { type: 'reschedule_request', label: 'Reschedule', desc: 'Suggest new times', icon: Calendar, color: 'text-blue-500' },
                ],
                defaults: [
                    {
                        id: 'wf-svc-1',
                        name: 'Post-Treatment Follow-up',
                        active: true,
                        trigger: { type: 'treatment_completed' },
                        conditions: [],
                        actions: [{ type: 'send_survey', config: {} }],
                        runs: 45
                    },
                    {
                        id: 'wf-svc-2',
                        name: 'No-Show Recovery',
                        active: true,
                        trigger: { type: 'no_show' },
                        conditions: [],
                        actions: [{ type: 'reschedule_request', config: {} }],
                        runs: 12
                    }
                ]
            };
        case 'automotive':
            return {
                triggers: [
                    ...commonTriggers,
                    { type: 'parts_arrived', label: 'Parts Arrived', desc: 'Ordered parts checked in', icon: Package, color: 'text-amber-500' },
                    { type: 'service_completed', label: 'Work Done', desc: 'Repair marked complete', icon: Wrench, color: 'text-slate-500' },
                    { type: 'estimate_declined', label: 'Estimate Declined', desc: 'Customer rejected quote', icon: X, color: 'text-red-500' },
                ],
                actions: [
                    ...commonActions,
                    { type: 'notify_customer', label: 'Notify Customer', desc: 'SMS update on car status', icon: MessageSquare, color: 'text-green-500' },
                    { type: 'schedule_pickup', label: 'Schedule Pickup', desc: 'Coordinate retrieval', icon: Calendar, color: 'text-blue-500' },
                ],
                defaults: [
                    {
                        id: 'wf-auto-1',
                        name: 'Parts Arrival Notification',
                        active: true,
                        trigger: { type: 'parts_arrived' },
                        conditions: [],
                        actions: [{ type: 'notify_customer', config: { message: "Your parts are here!" } }],
                        runs: 89
                    },
                    {
                        id: 'wf-auto-2',
                        name: 'Service Completion Alert',
                        active: true,
                        trigger: { type: 'service_completed' },
                        conditions: [],
                        actions: [{ type: 'notify_customer', config: { message: "Your car is ready." } }],
                        runs: 156
                    }
                ]
            };
        case 'event':
            return {
                triggers: [
                    ...commonTriggers,
                    { type: 'inquiry_received', label: 'New Lead', desc: 'Event inquiry form submitted', icon: PartyPopper, color: 'text-rose-500' },
                    { type: 'contract_signed', label: 'Contract Signed', desc: 'Client finalized agreement', icon: FileText, color: 'text-green-600' },
                    { type: 'payment_received', label: 'Payment Received', desc: 'Deposit confirmed', icon: CreditCard, color: 'text-blue-500' },
                ],
                actions: [
                    ...commonActions,
                    { type: 'send_welcome_kit', label: 'Send Welcome Kit', desc: 'Email onboarding docs', icon: Package, color: 'text-purple-500' },
                    { type: 'assign_coordinator', label: 'Assign Planner', desc: 'Route to staff member', icon: UserCheck, color: 'text-orange-500' },
                ],
                defaults: [
                    {
                        id: 'wf-evt-1',
                        name: 'New Lead Auto-Response',
                        active: true,
                        trigger: { type: 'inquiry_received' },
                        conditions: [],
                        actions: [{ type: 'send_message', config: { template: 'event_brochure' } }],
                        runs: 230
                    },
                    {
                        id: 'wf-evt-2',
                        name: 'Contract Onboarding',
                        active: true,
                        trigger: { type: 'contract_signed' },
                        conditions: [],
                        actions: [{ type: 'send_welcome_kit', config: {} }],
                        runs: 45
                    }
                ]
            };
        case 'restaurant':
            return {
                triggers: [
                    ...commonTriggers,
                    { type: 'reservation_created', label: 'Reservation Created', desc: 'New table booking confirmed', icon: Calendar, color: 'text-orange-500' },
                    { type: 'vip_arrival', label: 'VIP Arrival', desc: 'High-value guest checks in', icon: Star, color: 'text-yellow-500' },
                    { type: 'order_delayed', label: 'Order Delayed', desc: 'Kitchen ticket exceeds time', icon: Clock, color: 'text-red-400' },
                ],
                actions: [
                    ...commonActions,
                    { type: 'offer_discount', label: 'Offer Discount', desc: 'Send coupon code', icon: Ticket, color: 'text-purple-500' },
                    { type: 'alert_manager', label: 'Alert Manager', desc: 'Urgent ping to floor manager', icon: UserCheck, color: 'text-red-500' },
                ],
                defaults: [
                    {
                        id: 'wf-rest-1',
                        name: 'VIP Table Alert',
                        active: true,
                        trigger: { type: 'vip_arrival' },
                        conditions: [{ field: 'party_size', operator: 'greater_than', value: '4' }],
                        actions: [{ type: 'alert_manager', config: {} }],
                        runs: 12
                    },
                    {
                        id: 'wf-rest-2',
                        name: 'Bad Review Auto-Apology',
                        active: true,
                        trigger: { type: 'negative_sentiment' },
                        conditions: [],
                        actions: [{ type: 'offer_discount', config: { amount: '10%' } }],
                        runs: 8
                    }
                ]
            };
        case 'ecommerce':
            return {
                triggers: [
                    ...commonTriggers,
                    { type: 'order_placed', label: 'Order Placed', desc: 'New purchase confirmed', icon: ShoppingBag, color: 'text-green-600' },
                    { type: 'cart_abandoned', label: 'Cart Abandoned', desc: 'Items left in cart > 1hr', icon: ShoppingBag, color: 'text-purple-500' },
                    { type: 'return_requested', label: 'Return Request', desc: 'Customer asks for refund', icon: RefreshCw, color: 'text-orange-500' },
                ],
                actions: [
                    ...commonActions,
                    { type: 'create_ticket', label: 'Support Ticket', desc: 'Log in helpdesk', icon: Ticket, color: 'text-gray-500' },
                    { type: 'issue_refund', label: 'Issue Refund', desc: 'Process payment reversal', icon: CreditCard, color: 'text-red-500' },
                ],
                defaults: [
                    {
                        id: 'wf-ecom-1',
                        name: 'Abandoned Cart Recovery',
                        active: true,
                        trigger: { type: 'cart_abandoned' },
                        conditions: [{ field: 'cart_value', operator: 'greater_than', value: '50' }],
                        actions: [{ type: 'send_email', config: { template: 'recovery_discount' } }],
                        runs: 342
                    },
                    {
                        id: 'wf-ecom-2',
                        name: 'High Value Order Alert',
                        active: true,
                        trigger: { type: 'order_placed' },
                        conditions: [{ field: 'total', operator: 'greater_than', value: '200' }],
                        actions: [{ type: 'notify_team', config: { channel: 'slack_sales' } }],
                        runs: 45
                    }
                ]
            };
        case 'property':
        default:
            return {
                triggers: [
                    ...commonTriggers,
                    { type: 'booking_created', label: 'Booking Created', desc: 'New reservation confirmed', icon: Calendar, color: 'text-green-500' },
                    { type: 'checkout_completed', label: 'Checkout', desc: 'Guest departure date', icon: LogOut, color: 'text-purple-500' },
                    { type: 'maintenance_reported', label: 'Maintenance Issue', desc: 'Guest reports damage', icon: Zap, color: 'text-orange-500' },
                ],
                actions: [
                    ...commonActions,
                    { type: 'create_ticket', label: 'Create Ticket', desc: 'Log maintenance issue', icon: Ticket, color: 'text-gray-500' },
                    { type: 'schedule_cleaning', label: 'Schedule Cleaner', desc: 'Auto-assign turnover', icon: RefreshCw, color: 'text-blue-400' },
                ],
                defaults: [
                    {
                        id: 'wf-prop-1',
                        name: 'Negative Sentiment Alert',
                        active: true,
                        trigger: { type: 'negative_sentiment' },
                        conditions: [{ field: 'priority', operator: 'equals', value: 'High' }],
                        actions: [{ type: 'notify_team', config: { channel: 'Slack', urgency: 'High' } }],
                        runs: 142
                    },
                    {
                        id: 'wf-prop-2',
                        name: 'Check-in Guide Automated',
                        active: true,
                        trigger: { type: 'booking_created' },
                        conditions: [],
                        actions: [{ type: 'send_message', config: { template: 'check_in_guide' } }],
                        runs: 850
                    }
                ]
            };
    }
};

const Workflows: React.FC<WorkflowsProps> = ({ appMode }) => {
  const theme = getTheme(appMode);
  const options = getWorkflowOptions(appMode);
  
  // Initialize with defaults if empty, otherwise simulate loading saved ones
  const [workflows, setWorkflows] = useState<Workflow[]>(options.defaults as Workflow[]);
  
  // Reset workflows when switching modes (for demo purposes)
  useEffect(() => {
      setWorkflows(options.defaults as Workflow[]);
  }, [appMode]);

  const [isCreating, setIsCreating] = useState(false);

  // Builder State
  const [workflowName, setWorkflowName] = useState('');
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
  const [conditions, setConditions] = useState<WorkflowCondition[]>([]);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const toggleWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(wf => 
      wf.id === id ? { ...wf, active: !wf.active } : wf
    ));
  };

  const deleteWorkflow = (id: string) => {
    setWorkflows(prev => prev.filter(wf => wf.id !== id));
  };

  const handleSave = () => {
    // Allow saving if trigger and action are selected. Name is optional.
    if (!selectedTrigger || !selectedAction) return;

    // Generate default name if missing
    let finalName = workflowName;
    if (!finalName) {
        const triggerLabel = options.triggers.find(t => t.type === selectedTrigger)?.label || 'Unknown Trigger';
        const actionLabel = options.actions.find(a => a.type === selectedAction)?.label || 'Unknown Action';
        finalName = `${triggerLabel} → ${actionLabel}`;
    }

    const newWorkflow: Workflow = {
        id: `wf-${Date.now()}`,
        name: finalName,
        active: true,
        trigger: { type: selectedTrigger as any },
        conditions: conditions,
        actions: [{ type: selectedAction as any, config: {} }],
        runs: 0
    };

    setWorkflows([newWorkflow, ...workflows]);
    setIsCreating(false);
    resetBuilder();
  };

  const resetBuilder = () => {
      setWorkflowName('');
      setSelectedTrigger(null);
      setConditions([]);
      setSelectedAction(null);
  };

  const addCondition = () => {
      setConditions([...conditions, { field: 'sentiment', operator: 'equals', value: '' }]);
  };

  const updateCondition = (index: number, field: keyof WorkflowCondition, value: string) => {
      const newConditions = [...conditions];
      newConditions[index] = { ...newConditions[index], [field]: value };
      setConditions(newConditions);
  };

  const removeCondition = (index: number) => {
      setConditions(conditions.filter((_, i) => i !== index));
  };

  const getTriggerIcon = (type: string) => {
      const t = options.triggers.find(t => t.type === type);
      if (t) return <t.icon className={`w-5 h-5 ${t.color}`} />;
      return <Zap className="w-5 h-5 text-gray-500" />;
  };

  const getActionIcon = (type: string) => {
      const a = options.actions.find(a => a.type === type);
      if (a) return <a.icon className={`w-5 h-5 ${a.color}`} />;
      return <Zap className="w-5 h-5" />;
  };

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              {appMode === 'restaurant' ? 'Restaurant Automation' : appMode === 'ecommerce' ? 'Store Automations' : 'Automation Workflows'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Build "If-This-Then-That" rules to automate your {appMode}.</p>
        </div>
        {!isCreating && (
            <Button onClick={() => setIsCreating(true)} className={`${theme.bg} ${theme.hover} text-white`}>
            <Plus className="w-4 h-4 mr-2" /> Create Workflow
            </Button>
        )}
      </div>

      {isCreating ? (
          <div className="max-w-4xl mx-auto animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                  <Button variant="ghost" onClick={() => { setIsCreating(false); resetBuilder(); }}>
                      <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                  <div className="flex gap-2">
                      <Button variant="outline" onClick={resetBuilder}>Reset</Button>
                      <Button onClick={handleSave} disabled={!selectedTrigger || !selectedAction} className="bg-green-600 hover:bg-green-700 text-white">
                          <Save className="w-4 h-4 mr-2" /> Save Workflow
                      </Button>
                  </div>
              </div>

              {/* Workflow Name */}
              <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name your workflow <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <Input 
                    placeholder={selectedTrigger && selectedAction 
                        ? `${options.triggers.find(t => t.type === selectedTrigger)?.label} → ${options.actions.find(a => a.type === selectedAction)?.label}`
                        : "e.g. Auto-reply to angry guests"
                    } 
                    className="text-lg py-6" 
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    autoFocus
                  />
              </div>

              <div className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-800 space-y-12 pb-12">
                  
                  {/* STEP 1: TRIGGER */}
                  <div className="relative">
                      <div className={`absolute -left-[41px] top-0 w-8 h-8 rounded-full ${theme.bg} text-white flex items-center justify-center font-bold text-sm border-4 border-gray-50 dark:border-gray-900 z-10`}>1</div>
                      <Card className={`border-${theme.name}-200 dark:border-${theme.name}-900 shadow-lg shadow-${theme.name}-100/20 dark:shadow-none overflow-visible`}>
                          <CardHeader className={`${theme.lightBg}/50 dark:bg-opacity-20 border-b border-${theme.name}-100 dark:border-${theme.name}-900/50 py-4`}>
                              <CardTitle className={`text-base flex items-center gap-2 ${theme.text.replace('600', '900')} dark:${theme.text.replace('600', '200')}`}>
                                  <Zap className="w-4 h-4" /> When this happens...
                              </CardTitle>
                          </CardHeader>
                          <CardContent className="p-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {options.triggers.map(t => (
                                      <div 
                                        key={t.type}
                                        onClick={() => setSelectedTrigger(t.type)}
                                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center text-center gap-3 hover:shadow-md ${selectedTrigger === t.type ? `border-${theme.name}-600 ${theme.lightBg} dark:bg-opacity-30` : `border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:${theme.border}`}`}
                                      >
                                          <div className={`p-3 rounded-full ${selectedTrigger === t.type ? 'bg-white dark:bg-gray-800 shadow-sm' : 'bg-gray-50 dark:bg-gray-800'}`}>
                                              <t.icon className={`w-5 h-5 ${t.color}`} />
                                          </div>
                                          <div>
                                              <div className="font-semibold text-sm text-gray-900 dark:text-white">{t.label}</div>
                                              <div className="text-xs text-gray-500 mt-1">{t.desc}</div>
                                          </div>
                                          {selectedTrigger === t.type && (
                                              <div className={`absolute top-2 right-2 ${theme.text}`}>
                                                  <Check className="w-4 h-4" />
                                              </div>
                                          )}
                                      </div>
                                  ))}
                              </div>
                          </CardContent>
                      </Card>
                  </div>

                  {/* STEP 2: CONDITIONS */}
                  <div className="relative">
                      <div className="absolute -left-[41px] top-0 w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center font-bold text-sm border-4 border-gray-50 dark:border-gray-900 z-10">2</div>
                      <Card className="overflow-visible">
                          <CardHeader className="py-4 flex flex-row items-center justify-between">
                              <CardTitle className="text-base flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                  <GitFork className="w-4 h-4" /> Only if... (Optional)
                              </CardTitle>
                              <Button size="sm" variant="outline" onClick={addCondition} className="text-xs h-8">
                                  <Plus className="w-3 h-3 mr-1" /> Add Condition
                              </Button>
                          </CardHeader>
                          {conditions.length > 0 && (
                              <CardContent className="p-6 pt-2 space-y-3">
                                  {conditions.map((cond, idx) => (
                                      <div key={idx} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg animate-slide-up">
                                          <div className="font-mono text-xs text-gray-400 px-2">IF</div>
                                          <select 
                                              className="h-9 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm px-2"
                                              value={cond.field}
                                              onChange={(e) => updateCondition(idx, 'field', e.target.value)}
                                          >
                                              <option value="sentiment">Sentiment</option>
                                              <option value="priority">Priority</option>
                                              <option value="platform">Platform</option>
                                              <option value="total_value">Total Value</option>
                                              <option value="guest_status">Guest Status</option>
                                          </select>
                                          <select 
                                              className="h-9 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm px-2"
                                              value={cond.operator}
                                              onChange={(e) => updateCondition(idx, 'operator', e.target.value as any)}
                                          >
                                              <option value="equals">Equals</option>
                                              <option value="contains">Contains</option>
                                              <option value="greater_than">Greater Than</option>
                                              <option value="not_equals">Does not equal</option>
                                          </select>
                                          <Input 
                                              className="h-9 flex-1" 
                                              placeholder="Value (e.g. Negative)"
                                              value={cond.value}
                                              onChange={(e) => updateCondition(idx, 'value', e.target.value)}
                                          />
                                          <Button variant="ghost" size="icon" onClick={() => removeCondition(idx)} className="text-red-400 hover:text-red-600">
                                              <Trash2 className="w-4 h-4" />
                                          </Button>
                                      </div>
                                  ))}
                              </CardContent>
                          )}
                      </Card>
                  </div>

                  {/* STEP 3: ACTION */}
                  <div className="relative">
                      <div className="absolute -left-[41px] top-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm border-4 border-gray-50 dark:border-gray-900 z-10">3</div>
                      <Card className={`${selectedAction ? 'border-green-200 dark:border-green-900' : ''} overflow-visible`}>
                          <CardHeader className={`py-4 ${selectedAction ? 'bg-green-50/50 dark:bg-green-900/20' : ''}`}>
                              <CardTitle className="text-base flex items-center gap-2 text-gray-900 dark:text-white">
                                  <MousePointerClick className="w-4 h-4" /> Then do this...
                              </CardTitle>
                          </CardHeader>
                          <CardContent className="p-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {options.actions.map(a => (
                                      <div 
                                        key={a.type}
                                        onClick={() => setSelectedAction(a.type)}
                                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center text-center gap-3 hover:shadow-md ${selectedAction === a.type ? 'border-green-500 bg-green-50 dark:bg-green-900/30' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-green-300'}`}
                                      >
                                          <div className={`p-3 rounded-full ${selectedAction === a.type ? 'bg-white dark:bg-gray-800 shadow-sm' : 'bg-gray-50 dark:bg-gray-800'}`}>
                                              <a.icon className={`w-5 h-5 ${a.color}`} />
                                          </div>
                                          <div>
                                              <div className="font-semibold text-sm text-gray-900 dark:text-white">{a.label}</div>
                                              <div className="text-xs text-gray-500 mt-1">{a.desc}</div>
                                          </div>
                                          {selectedAction === a.type && (
                                              <div className="absolute top-2 right-2 text-green-600">
                                                  <Check className="w-4 h-4" />
                                              </div>
                                          )}
                                      </div>
                                  ))}
                              </div>
                          </CardContent>
                      </Card>
                  </div>

              </div>
          </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 animate-fade-in">
            {workflows.length === 0 && (
                 <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                     <GitFork className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                     <h3 className="text-lg font-medium text-gray-900 dark:text-white">No workflows yet</h3>
                     <p className="text-gray-500 mb-6">Create your first automation to save time.</p>
                     <Button onClick={() => setIsCreating(true)}>Create Workflow</Button>
                 </div>
            )}

            {workflows.map((wf) => (
            <Card key={wf.id} className={`transition-all duration-300 ${wf.active ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-gray-300 opacity-70'}`}>
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 flex-1">
                    <div className={`p-3 rounded-lg ${wf.active ? 'bg-green-50 text-green-600 dark:bg-green-900/20' : 'bg-gray-100 text-gray-500'}`}>
                        <GitFork className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{wf.name}</h3>
                            <Badge variant="outline" className={`text-[10px] ${wf.active ? 'bg-green-100 text-green-800 border-green-200' : ''}`}>
                                {wf.active ? 'Active' : 'Paused'}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                            <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
                            {getTriggerIcon(wf.trigger.type)} 
                            <span className="capitalize font-medium text-gray-700 dark:text-gray-300">{wf.trigger.type.replace('_', ' ')}</span>
                            </span>
                            
                            {wf.conditions.length > 0 && (
                                <>
                                    <ArrowRight className="w-3 h-3 text-gray-400" />
                                    <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
                                        <GitFork className="w-3 h-3" /> {wf.conditions.length} Conditions
                                    </span>
                                </>
                            )}

                            <ArrowRight className="w-3 h-3 text-gray-400" />
                            
                            <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
                                {getActionIcon(wf.actions[0].type)}
                                <span className="capitalize font-medium text-gray-700 dark:text-gray-300">{wf.actions[0].type.replace('_', ' ')}</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-center">
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{wf.runs}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Runs</p>
                    </div>
                    
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => toggleWorkflow(wf.id)}>
                            {wf.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => deleteWorkflow(wf.id)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                </CardContent>
            </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default Workflows;
