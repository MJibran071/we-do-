
import React from 'react';
import { Logo } from '../Logo';
import NeuralBackground from '../NeuralBackground';
import { AppMode } from '../../types';
import { getTheme } from '../../utils/theme';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  appMode?: AppMode;
}

const LAYOUT_CONFIG: Record<string, {
    headline: React.ReactNode;
    sub: string;
    testimonial: { name: string; role: string; quote: string; img: string };
    gradient: string;
    accent: string;
}> = {
    property: {
        headline: <>Automate your <span className="text-indigo-400">Guest Experience.</span></>,
        sub: "Join thousands of property managers using We Do to save 20+ hours a week on guest communication.",
        testimonial: { name: "Sarah J.", role: "Superhost", quote: "I used to wake up at 2AM to answer guests. Now We Do handles it.", img: "https://picsum.photos/id/1011/50" },
        gradient: "from-[#1e1b4b] via-[#312e81] to-[#2e1065]",
        accent: "indigo"
    },
    restaurant: {
        headline: <>Your 24/7 <span className="text-orange-400">AI Concierge.</span></>,
        sub: "Capture reservations, answer menu questions instantly, and reduce no-shows with automated confirmations.",
        testimonial: { name: "Mike T.", role: "Restaurant GM", quote: "No-shows dropped by 40% thanks to the automated SMS reminders.", img: "https://picsum.photos/id/1012/50" },
        gradient: "from-[#431407] via-[#7c2d12] to-[#451a03]",
        accent: "orange"
    },
    ecommerce: {
        headline: <>Turn Support into <span className="text-purple-400">Sales.</span></>,
        sub: "Instant answers for shipping & returns. Recover abandoned carts automatically on WhatsApp and SMS.",
        testimonial: { name: "Elena R.", role: "Store Owner", quote: "The abandoned cart recovery is magic. We recovered $4k last month.", img: "https://picsum.photos/id/1027/50" },
        gradient: "from-[#3b0764] via-[#6b21a8] to-[#4c1d95]",
        accent: "purple"
    },
    service: {
        headline: <>Focus on Care, Not <span className="text-cyan-400">Scheduling.</span></>,
        sub: "Automated booking, intake forms, and follow-ups for salons, spas, and clinics.",
        testimonial: { name: "Lisa M.", role: "Salon Owner", quote: "My reception desk is finally quiet, but my calendar is full.", img: "https://picsum.photos/id/1025/50" },
        gradient: "from-[#083344] via-[#0e7490] to-[#155e75]",
        accent: "cyan"
    },
    automotive: {
        headline: <>Streamline your <span className="text-slate-400">Shop Ops.</span></>,
        sub: "Automated status updates and quote approvals for repair shops and detailers.",
        testimonial: { name: "Robert F.", role: "Shop Manager", quote: "Customers love the proactive text updates. Less phone tag.", img: "https://picsum.photos/id/1005/50" },
        gradient: "from-[#0f172a] via-[#334155] to-[#1e293b]",
        accent: "slate"
    },
    event: {
        headline: <>Flawless Events, <span className="text-rose-400">Zero Chaos.</span></>,
        sub: "Coordinate vendors, manage guest lists, and handle inquiries for venues and planners.",
        testimonial: { name: "James L.", role: "Event Planner", quote: "Managing vendor questions used to take hours. Now it's instant.", img: "https://picsum.photos/id/1009/50" },
        gradient: "from-[#881337] via-[#be123c] to-[#9f1239]",
        accent: "rose"
    },
    custom: {
        headline: <>Automate your <span className="text-teal-400">Unique Workflow.</span></>,
        sub: "Tailored AI automation for your specific business needs. Adaptable, powerful, and easy to use.",
        testimonial: { name: "Alex P.", role: "Business Owner", quote: "Finally, a tool that adapts to how I run my business.", img: "https://picsum.photos/id/1005/50" },
        gradient: "from-[#042f2e] via-[#115e59] to-[#134e4a]",
        accent: "teal"
    }
};

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, appMode = 'property' }) => {
  const config = LAYOUT_CONFIG[appMode] || LAYOUT_CONFIG.property;
  const theme = getTheme(appMode as AppMode);

  return (
    <div className="min-h-screen w-full flex bg-gray-50 dark:bg-gray-950">
      {/* Left Side - Brand/Marketing */}
      <div className={`hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center bg-black`}>
        {/* Dark Gradient Base */}
        <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} z-0`}></div>
        
        {/* Dynamic Neural Mesh */}
        <NeuralBackground className="absolute inset-0 z-10 opacity-60" />
        
        {/* Animated Glow Blobs for Depth */}
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-${config.accent}-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse-subtle z-0`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-${config.accent}-400/10 rounded-full mix-blend-screen filter blur-[100px] animate-pulse-subtle animation-delay-2000 z-0`}></div>

        <div className="relative z-20 p-12 text-white max-w-lg">
          <div className="mb-8">
            <Logo className="w-16 h-16" textClassName="text-5xl" variant="light" />
          </div>
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            {config.headline}
          </h1>
          <p className="text-lg text-indigo-100 mb-8 leading-relaxed opacity-90">
            {config.sub}
          </p>
          
          <div className="space-y-4">
            <div className={`flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-colors`}>
              <div className="flex -space-x-2 shrink-0">
                 <img className={`w-10 h-10 rounded-full border-2 border-${config.accent}-500 object-cover`} src={config.testimonial.img} alt="User" />
              </div>
              <div className="text-sm">
                 <div className="flex text-yellow-400 text-xs mb-1">★★★★★</div>
                 <p className="italic text-white/90 mb-1">"{config.testimonial.quote}"</p>
                 <p className="font-bold text-white/70 text-xs">— {config.testimonial.name}, {config.testimonial.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 md:p-16 animate-slide-in-right">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
             <div className="lg:hidden flex justify-center mb-6">
                <Logo className="w-10 h-10" textClassName="text-2xl" />
             </div>
             <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
               {title}
             </h2>
             <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
               {subtitle}
             </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};
