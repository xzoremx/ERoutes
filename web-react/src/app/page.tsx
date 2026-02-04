import {
  Home, Users, FolderOpen, Clock, Receipt, FileText, DollarSign, TrendingUp, Landmark,
  ArrowLeftCircle, Search, LifeBuoy, Folder, CircleDollarSign, Play, Briefcase, CheckSquare,
  ListChecks, ChevronDown, Download, Send, FileCheck, ClipboardList, FolderPlus, FilePlus,
  KanbanSquare, Users2
} from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="antialiased min-h-screen overflow-x-hidden selection:bg-black selection:text-white text-slate-800 font-sans bg-[#ABCDE9] relative">

      {/* Background Layer: Sky Image & Cloud/Gradient Simulation */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Sky Background Image */}
        <img
          src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/bfd2f4cf-65ed-4b1a-86d1-a1710619267b_1600w.png"
          alt="Sky Background"
          className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply"
        />

        {/* Gradient Overlay to create the fade-to-warm-beige effect at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#A6CBE8]/20 via-[#BFD9EF]/40 to-[#EAE3D6]"></div>

        {/* Cloud Decoration Left */}
        <img
          src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg"
          className="absolute top-[20%] -left-[10%] w-[50%] opacity-40 mix-blend-screen blur-xl pointer-events-none"
          alt="cloud"
        />

        {/* Cloud Decoration Right */}
        <img
          src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg"
          className="absolute top-[30%] -right-[10%] w-[50%] opacity-40 mix-blend-screen blur-xl pointer-events-none"
          alt="cloud"
        />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* Navigation */}
        <nav className="w-full px-6 py-6 md:px-12 flex items-center justify-between max-w-7xl mx-auto animate-fade-in">
          <div className="flex items-center gap-2">
            {/* Logo Icon */}
            <div className="w-6 h-6 bg-black rounded-tr-lg rounded-bl-lg"></div>
            <span className="text-xl font-bold text-slate-900 tracking-tight font-nunito">OnePro</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-700">
            <a href="#" className="hover:text-black transition-colors">Features</a>
            <a href="#" className="hover:text-black transition-colors">Pricing</a>
            <a href="#" className="hover:text-black transition-colors">Blog</a>
            <a href="#" className="hover:text-black transition-colors">Contact Us</a>
          </div>

          <div>
            <button className="bg-[#1A1A1A] text-white text-[15px] font-medium px-6 py-2.5 rounded-full hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Try Dreelio free
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="flex-grow flex flex-col items-center pt-16 pb-20 px-4 md:px-6 w-full max-w-7xl mx-auto">

          {/* Hero Text */}
          <div className="text-center max-w-4xl mx-auto mb-16 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h1 className="md:text-[80px] leading-[1] text-6xl font-semibold text-[#1A1A1A] tracking-tight font-nunito mb-8">
              Grow your business<br />from 0 to 1
            </h1>
            <p className="md:text-[19px] leading-relaxed text-lg font-medium text-slate-600 font-sans max-w-2xl mr-auto mb-10 ml-auto">
              One tool for managing clients, projects, and payments in one single place. From first contract to final invoice, grow like a pro.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="text-[17px] hover:bg-black transition-all hover:shadow-xl hover:-translate-y-0.5 sm:w-auto font-medium text-white bg-[#1A1A1A] w-full rounded-full pt-3.5 pr-8 pb-3.5 pl-8 shadow-lg">
                Try OnePro for free
              </button>
              <button className="bg-white/40 backdrop-blur-md border border-white/50 text-[#1A1A1A] text-[17px] font-medium px-8 py-3.5 rounded-full hover:bg-white/60 transition-all w-full sm:w-auto flex items-center justify-center gap-2">
                See features
              </button>
            </div>
          </div>

          {/* Dashboard Mockup */}
          <div
            className="w-full max-w-[1300px] bg-[#FDFBF9] rounded-t-[32px] shadow-2xl border border-white/60 overflow-hidden flex flex-col md:flex-row relative animate-slide-up"
            style={{ animationDelay: '0.3s', boxShadow: '0 50px 100px -20px rgba(50, 50, 93, 0.15), 0 30px 60px -30px rgba(0, 0, 0, 0.1)' }}
          >

            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-64 border-r border-slate-100 p-6 bg-white/50 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-8 px-2">
                <div className="w-5 h-5 bg-black rounded-tr-md rounded-bl-md"></div>
                <span className="text-lg font-bold text-slate-900 font-nunito">OnePro</span>
                <div className="ml-auto">
                  <ArrowLeftCircle className="w-5 h-5 text-slate-400 stroke-[1.5]" />
                </div>
              </div>

              <nav className="space-y-1 mb-8">
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#EAE5DC] text-slate-900 font-medium text-sm">
                  <Home className="w-4 h-4 stroke-[1.5]" />
                  Home
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors font-medium text-sm">
                  <Users className="w-4 h-4 stroke-[1.5]" />
                  Clients
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors font-medium text-sm">
                  <FolderOpen className="w-4 h-4 stroke-[1.5]" />
                  Projects
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors font-medium text-sm">
                  <Clock className="w-4 h-4 stroke-[1.5]" />
                  Time tracking
                </a>
              </nav>

              <div className="mt-auto">
                <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tools</p>
                <nav className="space-y-1">
                  <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors font-medium text-sm">
                    <Receipt className="w-4 h-4 stroke-[1.5]" />
                    Invoices
                  </a>
                  <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors font-medium text-sm">
                    <FileText className="w-4 h-4 stroke-[1.5]" />
                    Contracts
                  </a>
                  <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors font-medium text-sm">
                    <DollarSign className="w-4 h-4 stroke-[1.5]" />
                    Balance
                  </a>
                  <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors font-medium text-sm">
                    <TrendingUp className="w-4 h-4 stroke-[1.5]" />
                    Accounting
                  </a>
                  <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors font-medium text-sm">
                    <Landmark className="w-4 h-4 stroke-[1.5]" />
                    Taxes
                  </a>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:p-8 bg-[#FDFBF9] pt-6 pr-6 pb-6 pl-6 max-h-[70vh] md:max-h-none overflow-y-auto">

              {/* Header */}
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-nunito">Hello, James</h2>
                  <p className="text-sm text-slate-500 mt-0.5">What are you working on?</p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 stroke-[1.5]" />
                    <input
                      type="text"
                      placeholder="Search"
                      className="pl-10 pr-4 py-2 bg-white border border-slate-100 rounded-full text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100 w-64 shadow-sm"
                    />
                  </div>

                  {/* Icons */}
                  <div className="flex items-center gap-3 text-slate-400">
                    <button className="hover:text-slate-900 transition">
                      <LifeBuoy className="w-5 h-5 stroke-[1.5]" />
                    </button>
                    <button className="hover:text-slate-900 transition">
                      <Folder className="w-5 h-5 stroke-[1.5]" />
                    </button>
                    <button className="hover:text-slate-900 transition">
                      <CircleDollarSign className="w-5 h-5 stroke-[1.5]" />
                    </button>
                  </div>

                  {/* Timer */}
                  <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <span className="font-mono text-sm font-medium text-slate-700">0:00:00</span>
                    <button className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white shadow-lg hover:scale-105 transition">
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                  </div>
                </div>
              </header>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Stat Card 1 */}
                <div className="bg-[#F6F4F0] p-5 rounded-xl border border-transparent hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-2 text-slate-500 mb-6">
                    <div className="p-1.5 bg-white rounded-md shadow-sm">
                      <Briefcase className="w-4 h-4 text-slate-700 stroke-[1.5]" />
                    </div>
                    <span className="text-xs font-semibold">Total projects</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold font-nunito text-slate-900">455</span>
                    <span className="text-[11px] font-bold text-green-600 bg-green-100/50 px-1.5 py-0.5 rounded">+16.4%</span>
                  </div>
                </div>

                {/* Stat Card 2 */}
                <div className="bg-[#F6F4F0] p-5 rounded-xl border border-transparent hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-2 text-slate-500 mb-6">
                    <div className="p-1.5 bg-white rounded-md shadow-sm">
                      <CheckSquare className="w-4 h-4 text-slate-700 stroke-[1.5]" />
                    </div>
                    <span className="text-xs font-semibold">Active projects</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold font-nunito text-slate-900">55</span>
                    <span className="text-[11px] font-bold text-red-500 bg-red-100/50 px-1.5 py-0.5 rounded">-4.8%</span>
                  </div>
                </div>

                {/* Stat Card 3 */}
                <div className="bg-[#F6F4F0] p-5 rounded-xl border border-transparent hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-2 text-slate-500 mb-6">
                    <div className="p-1.5 bg-white rounded-md shadow-sm">
                      <ListChecks className="w-4 h-4 text-slate-700 stroke-[1.5]" />
                    </div>
                    <span className="text-xs font-semibold">Completed projects</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold font-nunito text-slate-900">400</span>
                    <span className="text-[11px] font-bold text-green-600 bg-green-100/50 px-1.5 py-0.5 rounded">+12.8%</span>
                  </div>
                </div>

                {/* Stat Card 4 */}
                <div className="bg-[#F6F4F0] p-5 rounded-xl border border-transparent hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-2 text-slate-500 mb-6">
                    <div className="p-1.5 bg-white rounded-md shadow-sm">
                      <Clock className="w-4 h-4 text-slate-700 stroke-[1.5]" />
                    </div>
                    <span className="text-xs font-semibold">Total hours worked</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold font-nunito text-slate-900">600hrs</span>
                    <span className="text-[11px] font-bold text-red-500 bg-red-100/50 px-1.5 py-0.5 rounded">-1.2%</span>
                  </div>
                </div>
              </div>

              {/* Bottom Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Chart Section (2 cols wide) */}
                <div className="lg:col-span-2 bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-bold text-sm text-slate-900">Earning over time</h3>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50">
                        Month <ChevronDown className="w-3 h-3" />
                      </button>
                      <button className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-50">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold mb-6">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span className="text-slate-600">Bilable</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-200"></span>
                      <span className="text-slate-400">Non Billable</span>
                    </div>
                  </div>

                  {/* Chart Visualization */}
                  <div className="h-48 w-full flex items-end justify-between gap-2 md:gap-4 px-2">
                    {[30, 65, 25, 35, 25, 38, 58, 18, 32, 48, 12, 42].map((height, index) => {
                      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                      const isHighlighted = index === 6 || index === 9 || index === 11;
                      return (
                        <div key={index} className="w-full flex flex-col justify-end gap-0.5 h-full group">
                          <div
                            className={`w-full rounded-t-sm transition-colors ${isHighlighted ? 'bg-blue-300/60 group-hover:bg-blue-400/60' : 'bg-blue-200/40 group-hover:bg-blue-300/50'}`}
                            style={{ height: `${height}%` }}
                          ></div>
                          <div className="text-[9px] text-center text-slate-400 mt-2">{months[index]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions Grid (1 col wide) */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Receipt, label: "Send an invoice" },
                    { icon: Send, label: "Draft a proposal" },
                    { icon: FileCheck, label: "Create a contract" },
                    { icon: ClipboardList, label: "Add a form" },
                    { icon: FolderPlus, label: "Create a project" },
                    { icon: FilePlus, label: "File Tax" },
                  ].map((action, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-start justify-center gap-3 hover:border-slate-300 transition-colors cursor-pointer group">
                      <div className="p-2 bg-[#F6F4F0] rounded-lg group-hover:bg-[#EAE5DC] transition-colors">
                        <action.icon className="w-5 h-5 text-slate-700 stroke-[1.5]" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700">{action.label}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </main>

        {/* Features Section - One Platform */}
        <section className="w-full max-w-7xl mx-auto px-4 md:px-6 py-24 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <span className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-4 block font-sans">One Platform</span>
            <h2 className="md:text-5xl text-3xl font-semibold text-[#1A1A1A] tracking-tight font-nunito mb-6">Everything you need in one place</h2>
            <p className="text-lg text-slate-600 font-medium font-sans">Stop switching between different apps. Centralize your entire workflow and focus on the work that matters.</p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: KanbanSquare, title: "Project Management", description: "Track tasks, set milestones, and manage timelines without the clutter. Keep every project moving forward." },
              { icon: Receipt, title: "Invoicing & Payments", description: "Create professional invoices in seconds, track expenses automatically, and get paid faster." },
              { icon: Users2, title: "Client CRM", description: "Maintain a complete record of every client. Store contracts, contact details, and history in one secure place." },
            ].map((card, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-md rounded-[32px] p-8 border border-white/60 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent opacity-50 pointer-events-none"></div>
                <div className="w-14 h-14 bg-[#F6F4F0] rounded-2xl flex items-center justify-center mb-6 text-slate-900 shadow-sm group-hover:scale-110 transition-transform duration-300 border border-white">
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] font-nunito mb-3">{card.title}</h3>
                <p className="text-[15px] leading-relaxed text-slate-600 font-sans">{card.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <section className="overflow-hidden bg-[#F6F4F0] w-full z-10 border-white/40 border-t pt-32 pb-0 relative">
          <div className="max-w-7xl mx-auto px-6">
            <footer className="w-full max-w-7xl z-10 mx-auto pt-12 pr-6 pb-12 pl-6 relative">
              <div className="bg-[#D3E4F4] rounded-[40px] p-8 md:p-12 lg:p-16 shadow-sm border border-white/20">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-16 justify-between">

                  {/* Brand Section */}
                  <div className="max-w-sm">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-6 h-6 bg-[#1A1A1A] rounded-tr-md rounded-bl-md"></div>
                      <span className="text-xl font-semibold text-[#1A1A1A] tracking-tight font-nunito">OnePro</span>
                    </div>
                    <p className="text-[15px] leading-relaxed text-slate-600 font-medium font-sans mb-8">
                      Your favourite business management software. Built for early startup founders.
                    </p>
                  </div>

                  {/* Links Section */}
                  <div className="flex gap-12 sm:gap-24">
                    {/* Product Column */}
                    <div className="flex flex-col gap-4">
                      <h4 className="text-xs font-semibold tracking-widest text-[#1A1A1A] uppercase mb-1 font-nunito">Product</h4>
                      <a href="#" className="text-[15px] text-slate-600 hover:text-[#1A1A1A] transition-colors font-sans">Features</a>
                      <a href="#" className="text-[15px] text-slate-600 hover:text-[#1A1A1A] transition-colors font-sans">Pricing</a>
                      <a href="#" className="text-[15px] text-slate-600 hover:text-[#1A1A1A] transition-colors font-sans">Blog</a>
                    </div>

                    {/* Information Column */}
                    <div className="flex flex-col gap-4">
                      <h4 className="text-xs font-semibold tracking-widest text-[#1A1A1A] uppercase mb-1 font-nunito">Information</h4>
                      <a href="#" className="text-[15px] text-slate-600 hover:text-[#1A1A1A] transition-colors font-sans">Contact</a>
                      <a href="#" className="text-[15px] text-slate-600 hover:text-[#1A1A1A] transition-colors font-sans">Terms of use</a>
                      <a href="#" className="text-[15px] text-slate-600 hover:text-[#1A1A1A] transition-colors font-sans">Privacy</a>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-slate-900/5 mb-8"></div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[13px] text-slate-500 font-sans">
                  <div>
                    © 2026 OnePro. Created by <span className="font-semibold text-slate-900">François Savard</span>
                  </div>
                  <div>
                    Made with <span className="font-semibold text-slate-900">Aura Builder</span>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </section>

      </div>
    </div>
  );
}
