import {
  Briefcase,
  CheckSquare,
  ListChecks,
  Clock,
  Receipt,
  Send,
  FileCheck,
  ClipboardList,
  FolderPlus,
  FilePlus,
  KanbanSquare,
  Users2,
} from "lucide-react";

// Layout Components
import { BackgroundLayer, Navbar, Footer } from "@/components/layout";

// Section Components
import { HeroSection, FeaturesSection } from "@/components/sections";

// Dashboard Components
import {
  Sidebar,
  DashboardHeader,
  StatCard,
  EarningsChart,
  ActionsGrid,
} from "@/components/dashboard";

export default function HomePage() {
  // Stats data
  const statsData = [
    { icon: Briefcase, label: "Total projects", value: "455", change: "+16.4%", isPositive: true },
    { icon: CheckSquare, label: "Active projects", value: "55", change: "-4.8%", isPositive: false },
    { icon: ListChecks, label: "Completed projects", value: "400", change: "+12.8%", isPositive: true },
    { icon: Clock, label: "Total hours worked", value: "600hrs", change: "-1.2%", isPositive: false },
  ];

  // Quick actions data
  const actionsData = [
    { icon: Receipt, label: "Send an invoice" },
    { icon: Send, label: "Draft a proposal" },
    { icon: FileCheck, label: "Create a contract" },
    { icon: ClipboardList, label: "Add a form" },
    { icon: FolderPlus, label: "Create a project" },
    { icon: FilePlus, label: "File Tax" },
  ];

  // Features data
  const featuresData = [
    {
      icon: KanbanSquare,
      title: "Project Management",
      description: "Track tasks, set milestones, and manage timelines without the clutter. Keep every project moving forward.",
    },
    {
      icon: Receipt,
      title: "Invoicing & Payments",
      description: "Create professional invoices in seconds, track expenses automatically, and get paid faster.",
    },
    {
      icon: Users2,
      title: "Client CRM",
      description: "Maintain a complete record of every client. Store contracts, contact details, and history in one secure place.",
    },
  ];

  return (
    <div className="antialiased min-h-screen overflow-x-hidden selection:bg-black selection:text-white text-slate-800 font-sans bg-[#ABCDE9] relative">
      {/* Background Layer */}
      <BackgroundLayer />

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <Navbar />

        {/* Hero Section */}
        <main className="flex-grow flex flex-col items-center pt-16 pb-20 px-4 md:px-6 w-full max-w-7xl mx-auto">
          <HeroSection
            title={
              <>
                Ahorra en cada
                <br />
                reabastecimiento
              </>
            }
            description="Calculamos la ruta óptima hacia la estación de servicio más económica cerca de ti o en tu trayecto planificado."
          />

          {/* Dashboard Mockup */}
          <div
            className="w-full max-w-[1300px] bg-[#FDFBF9] rounded-t-[32px] shadow-2xl border border-white/60 overflow-hidden flex flex-col md:flex-row relative animate-slide-up"
            style={{
              animationDelay: "0.3s",
              boxShadow: "0 50px 100px -20px rgba(50, 50, 93, 0.15), 0 30px 60px -30px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 md:p-8 bg-[#FDFBF9] pt-6 pr-6 pb-6 pl-6 max-h-[70vh] md:max-h-none overflow-y-auto">
              {/* Header */}
              <DashboardHeader />

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statsData.map((stat, index) => (
                  <StatCard key={index} {...stat} />
                ))}
              </div>

              {/* Bottom Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Section */}
                <EarningsChart />

                {/* Actions Grid */}
                <ActionsGrid actions={actionsData} />
              </div>
            </div>
          </div>
        </main>

        {/* Features Section */}
        <FeaturesSection
          title="Everything you need in one place"
          description="Stop switching between different apps. Centralize your entire workflow and focus on the work that matters."
          features={featuresData}
        />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
