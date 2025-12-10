import React, { useState } from 'react';
import { Logo } from './Logo';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar } from 'recharts';
import { ArrowRight, Download, TrendingUp, Sparkles, Briefcase, PlayCircle, Users, DollarSign, Zap, Globe, Shield, Rocket, CheckCircle, Target, Award, TrendingDown, Clock, Building } from 'lucide-react';
import NeuralBackground from './NeuralBackground';

interface FundraisingProps {
  onBack: () => void;
}

const GROWTH_DATA = [
  { month: 'Jan', revenue: 12000, users: 45, churn: 8 },
  { month: 'Feb', revenue: 18000, users: 80, churn: 6 },
  { month: 'Mar', revenue: 25000, users: 150, churn: 5 },
  { month: 'Apr', revenue: 42000, users: 320, churn: 4 },
  { month: 'May', revenue: 68000, users: 580, churn: 3.5 },
  { month: 'Jun', revenue: 95000, users: 900, churn: 3 },
  { month: 'Jul', revenue: 145000, users: 1400, churn: 2.5 },
];

const UNIT_ECONOMICS = [
  { metric: 'CAC', value: 180, benchmark: 250 },
  { metric: 'LTV', value: 2400, benchmark: 1800 },
  { metric: 'Payback', value: 3.2, benchmark: 6 },
];

const COMPETITIVE_LANDSCAPE = [
  { name: 'Traditional Tools', market: 45, growth: 2, ai: 0 },
  { name: 'Point Solutions', market: 30, growth: 8, ai: 20 },
  { name: 'We Do', market: 5, growth: 118, ai: 95 },
  { name: 'Enterprise', market: 20, growth: 5, ai: 40 },
];

export const Fundraising: React.FC<FundraisingProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'team'>('overview');
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white font-sans overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
            <Logo className="w-8 h-8" textClassName="text-xl" />
            <Badge variant="outline" className="ml-2 border-indigo-200 text-indigo-700 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800">
                Series Seed
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>Back to App</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full">
              Invest Now
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 lg:pt-52 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-gray-950 z-0"></div>
        <NeuralBackground className="absolute inset-0 z-0 opacity-40" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wider mb-6 border border-green-200 dark:border-green-800 animate-pulse-subtle">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Round 65% Filled
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            The Operating System for <br/>
            <span className="text-indigo-600 dark:text-indigo-500">The Service Economy.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            We Do isn't just a chatbot. It's an autonomous AI workforce that handles bookings, support, inventory, and logistics for 500M+ businesses worldwide.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/30 w-full sm:w-auto">
              Request Access to Data Room <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 w-full sm:w-auto hover:bg-gray-100 dark:hover:bg-gray-900">
              <Download className="mr-2 w-5 h-5" /> Download Pitch Deck
            </Button>
          </div>
        </div>
      </section>

      {/* 1. WHY NOW? Macro Trends */}
      <section className="py-24 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold mb-4">Why Now?</h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400">Three massive trends are converging to create the perfect storm.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Card className="border-0 shadow-lg bg-gray-50 dark:bg-gray-900/50">
                      <CardHeader>
                          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl flex items-center justify-center mb-4">
                              <TrendingUp className="w-6 h-6" />
                          </div>
                          <CardTitle>The Labor Crisis</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="space-y-4">
                              <div className="flex justify-between text-sm font-medium">
                                  <span>Labor Cost</span>
                                  <span className="text-red-500">+18% YoY</span>
                              </div>
                              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div className="h-full bg-red-500 w-[85%]"></div>
                              </div>
                              <p className="text-sm text-gray-500 leading-relaxed">
                                  SMBs can no longer afford human receptionists. The workforce is shrinking while wages skyrocket. Automation is now a survival necessity.
                              </p>
                          </div>
                      </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-gray-50 dark:bg-gray-900/50">
                      <CardHeader>
                          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                              <Sparkles className="w-6 h-6" />
                          </div>
                          <CardTitle>AI Adoption Curve</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="relative h-24 w-full flex items-end gap-1 mb-4">
                              {[20, 35, 50, 75, 95, 120, 150].map((h, i) => (
                                  <div key={i} className="flex-1 bg-purple-200 dark:bg-purple-900/30 rounded-t-sm relative group">
                                      <div style={{height: `${h/1.5}%`}} className="absolute bottom-0 w-full bg-purple-600 rounded-t-sm transition-all group-hover:bg-purple-500"></div>
                                  </div>
                              ))}
                          </div>
                          <p className="text-sm text-gray-500 leading-relaxed">
                              LLMs have finally reached human-level reliability. Businesses are shifting budget from "Experimental" to "Core Infrastructure" this year.
                          </p>
                      </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-gray-50 dark:bg-gray-900/50">
                      <CardHeader>
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                              <Briefcase className="w-6 h-6" />
                          </div>
                          <CardTitle>Vertical SaaS Fatigue</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="flex flex-wrap gap-2 mb-4">
                              {['Scheduling', 'Messaging', 'Payments', 'Reviews', 'Inventory'].map(tag => (
                                  <span key={tag} className="text-[10px] px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded text-gray-500 line-through decoration-red-500 decoration-2">{tag}</span>
                              ))}
                              <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded font-bold">One OS</span>
                          </div>
                          <p className="text-sm text-gray-500 leading-relaxed">
                              Businesses are tired of paying for 15 disconnected tools. They want one intelligent layer that does it all.
                          </p>
                      </CardContent>
                  </Card>
              </div>
          </div>
      </section>

      {/* 2. MARKET SIZING */}
      <section className="py-24 bg-gray-50 dark:bg-black overflow-hidden relative">
          {/* Background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div>
                      <h2 className="text-4xl font-bold mb-6">A $500B Opportunity.</h2>
                      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                          We are targeting the massive, underserved market of service businesses that are too small for Enterprise ERPs but too complex for basic tools.
                      </p>
                      <ul className="space-y-6">
                          <li className="flex items-start gap-4">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 shrink-0 font-bold">1</div>
                              <div>
                                  <h4 className="font-bold text-gray-900 dark:text-white">Total Addressable Market (TAM)</h4>
                                  <p className="text-sm text-gray-500">Global Service Economy digitization spend.</p>
                              </div>
                          </li>
                          <li className="flex items-start gap-4">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 shrink-0 font-bold">2</div>
                              <div>
                                  <h4 className="font-bold text-gray-900 dark:text-white">Serviceable Available Market (SAM)</h4>
                                  <p className="text-sm text-gray-500">Digitally native SMBs in US/EU/UK.</p>
                              </div>
                          </li>
                          <li className="flex items-start gap-4">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 shrink-0 font-bold">3</div>
                              <div>
                                  <h4 className="font-bold text-gray-900 dark:text-white">Serviceable Obtainable Market (SOM)</h4>
                                  <p className="text-sm text-gray-500">Our 5-year target (5% market share).</p>
                              </div>
                          </li>
                      </ul>
                  </div>

                  <div className="relative h-[500px] w-full flex items-center justify-center">
                      {/* Concentric Circles Visualization */}
                      <div className="absolute w-[500px] h-[500px] rounded-full border border-gray-300 dark:border-gray-700 flex items-start justify-center pt-8 bg-gray-100/50 dark:bg-gray-900/20 backdrop-blur-sm animate-pulse-subtle">
                          <div className="text-center">
                              <div className="text-3xl font-extrabold text-gray-400">$500B</div>
                              <div className="text-xs text-gray-500 uppercase tracking-widest">TAM</div>
                          </div>
                      </div>
                      <div className="absolute w-[350px] h-[350px] rounded-full border-2 border-indigo-300 dark:border-indigo-800 flex items-start justify-center pt-10 bg-indigo-50/50 dark:bg-indigo-900/10 backdrop-blur-md shadow-lg">
                          <div className="text-center">
                              <div className="text-4xl font-extrabold text-indigo-400">$85B</div>
                              <div className="text-xs text-indigo-400 uppercase tracking-widest">SAM</div>
                          </div>
                      </div>
                      <div className="absolute w-[200px] h-[200px] rounded-full bg-indigo-600 text-white flex flex-col items-center justify-center shadow-2xl shadow-indigo-500/50 scale-100 hover:scale-110 transition-transform cursor-default">
                          <div className="text-5xl font-extrabold">$2.5B</div>
                          <div className="text-sm font-medium uppercase tracking-widest mt-1 opacity-80">SOM</div>
                          <div className="text-[10px] mt-2 bg-indigo-700 px-2 py-0.5 rounded text-indigo-200">5-Year Goal</div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* METRICS */}
      <section className="py-24 bg-white dark:bg-gray-950 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-3xl font-bold mb-4">Traction speaks louder than words.</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                        Since launching our beta, we've seen explosive organic growth across our core verticals: Property, Restaurants, and Automotive.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <div className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-1">$1.4M</div>
                            <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">Projected ARR</div>
                        </div>
                        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <div className="text-4xl font-extrabold text-green-600 dark:text-green-400 mb-1">118%</div>
                            <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">MoM Growth</div>
                        </div>
                        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <div className="text-4xl font-extrabold text-purple-600 dark:text-purple-400 mb-1">5k+</div>
                            <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">Active Businesses</div>
                        </div>
                        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <div className="text-4xl font-extrabold text-orange-600 dark:text-orange-400 mb-1">$45M</div>
                            <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">GMV Processed</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6 pl-2">Monthly Recurring Revenue (Projected)</h3>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={GROWTH_DATA}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                                <XAxis dataKey="month" stroke="#9ca3af" tickLine={false} axisLine={false} />
                                <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    formatter={(val: number) => [`$${val.toLocaleString()}`, 'Revenue']}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 4. ROADMAP TIMELINE */}
      <section className="py-24 bg-gray-50 dark:bg-black relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 relative z-10">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Strategic Roadmap</h2>
                  <p className="text-gray-500">Our path to $100M ARR.</p>
              </div>

              <div className="relative">
                  {/* Timeline Line */}
                  <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 -translate-y-1/2 z-0"></div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      {[
                          { date: 'Q3 2026', title: 'Seed Round', desc: 'Closed $2.5M. Core Team Hired.', status: 'current' },
                          { date: 'Q1 2027', title: 'Web Application', desc: 'iOS & Android Apps. Voice 2.0.', status: 'upcoming' },
                          { date: 'Q3 2027', title: 'Series A', desc: '$15M Target. US Expansion.', status: 'upcoming' },
                          { date: 'Q4 2028', title: 'Global Scale', desc: 'EU/APAC Markets. Enterprise Tier.', status: 'upcoming' },
                      ].map((item, i) => (
                          <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                              <div className={`w-4 h-4 rounded-full border-4 mb-4 ${item.status === 'current' ? 'bg-indigo-600 border-indigo-200 dark:border-indigo-900 scale-125' : 'bg-gray-200 dark:bg-gray-800 border-white dark:border-gray-950'}`}></div>
                              <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm w-full hover:shadow-lg transition-all hover:-translate-y-1">
                                  <div className="text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-1">{item.date}</div>
                                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h4>
                                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-indigo-600 dark:bg-indigo-900 text-white text-center">
          <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Don't miss the ship.</h2>
              <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                  The AI revolution is happening now. We Do is positioned to become the default OS for the next generation of businesses.
              </p>
              
              <div className="bg-white dark:bg-gray-900 p-2 rounded-full max-w-md mx-auto flex">
                  <input 
                    type="email" 
                    placeholder="investor@fund.com" 
                    className="flex-1 bg-transparent border-0 px-6 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-0"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button className="rounded-full px-8 bg-indigo-600 hover:bg-indigo-700 text-white">
                      Request Term Sheet
                  </Button>
              </div>
              <p className="text-xs text-indigo-200 mt-4">
                  Qualified accredited investors only. Minimum check size $25k.
              </p>
          </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 py-12 border-t border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                  <Logo className="w-6 h-6" textClassName="text-lg" />
              </div>
              <div className="text-sm text-gray-500">
                  &copy; 2026 We Do Inc. Confidential.
              </div>
          </div>
      </footer>
    </div>
  );
};