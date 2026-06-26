import React, { useState, useEffect } from "react";
import { useFormSubmit } from "./hooks/useFormSubmit";
import { generateWhatsAppLink } from "./utils/whatsapp";
import { 
  Scale, 
  ShieldCheck, 
  Users, 
  Droplets, 
  Lightbulb, 
  MapPin, 
  Megaphone, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  Share2, 
  FileText, 
  Phone, 
  Mail, 
  Globe, 
  ChevronRight, 
  AlertTriangle, 
  X, 
  Plus, 
  Award, 
  UserPlus, 
  Menu,
  TrendingUp,
  Sliders,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import coastlineBanner from './assets/images/gqeberha_coastline_1782311255731.jpg';
import metroMonitorApp from './assets/images/livemetroapp.png'; // 👈 Changed this name!
// Interfaces
interface ServiceIssue {
  id: string;
  ward: string;
  issueType: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'submitted' | 'escalated' | 'resolved';
  submittedBy: string;
  date: string;
  votes: number;
}

interface Volunteer {
  name: string;
  email: string;
  phone: string;
  ward: string;
  skill: string;
  membershipId: string;
  date: string;
}

interface PressRelease {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  content: string;
  ward: string;
}

// South African Flag Heart icon representing the official "i❤️NA" slogan
function SouthAfricanFlagHeart({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <span className={`relative inline-block ${className} align-middle select-none group cursor-help`} id="sa-heart-container">
      <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-sm" id="sa-heart-svg">
        <defs>
          <clipPath id="sa-heart-clip">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </clipPath>
        </defs>
        <g clipPath="url(#sa-heart-clip)">
          {/* Top Red Band, Bottom Blue Band */}
          <rect x="0" y="0" width="24" height="12" fill="#E03C31" />
          <rect x="0" y="12" width="24" height="12" fill="#001489" />
          {/* White Y pall border */}
          <path d="M0 2 L12 12 L0 22 L4 22 L14 12 L4 2 Z M12 10 L24 10 L24 14 L12 14 Z" fill="#FFFFFF" />
          {/* Green Y pall */}
          <path d="M0 4 L10 12 L0 20 L3 20 L11.5 12 L3 4 Z M10 11 L24 11 L24 13 L10 13 Z" fill="#007A4D" />
          {/* Yellow chevron border */}
          <polygon points="0,6 7,12 0,18" fill="#FFB81C" />
          {/* Black triangle */}
          <polygon points="0,7.5 5.5,12 0,16.5" fill="#000000" />
        </g>
      </svg>
      {/* Tooltip explaining the colors of the South African flag */}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-56 bg-black text-white text-[10px] p-2.5 rounded shadow-xl font-normal leading-tight text-center z-50 transition-all border border-neutral-800" id="sa-heart-tooltip">
        Our heart icon incorporates the colors of the South African flag, representing unity, transformation, and service to NMB.
      </span>
    </span>
  );
}



export default function App() {
  // Navigation State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Community Issues State
  const [issues, setIssues] = useState<ServiceIssue[]>([
    {
      id: "issue-1",
      ward: "Ward 31 (Missionvale)",
      issueType: "Sanitation & Sewers",
      description: "Severe main line sewage leak near the secondary school on Aubrey Street, posing health hazards to schoolchildren.",
      urgency: "high",
      status: "escalated",
      submittedBy: "Mzukisi N.",
      date: "2026-06-22",
      votes: 147
    },
    {
      id: "issue-2",
      ward: "Ward 35 (Salsoneville)",
      issueType: "Electricity Failure",
      description: "Vandalized high-mast streetlights surrounding the sports fields left dark for over 4 months.",
      urgency: "medium",
      status: "resolved",
      submittedBy: "Fiona G.",
      date: "2026-06-18",
      votes: 92
    },
    {
      id: "issue-3",
      ward: "Ward 38 (Helenvale)",
      issueType: "Water Outage",
      description: "Chronic low water pressure and weekend-long complete water cuts without municipal water truck interventions.",
      urgency: "high",
      status: "submitted",
      submittedBy: "Lucretia B.",
      date: "2026-06-24",
      votes: 68
    },
    {
      id: "issue-4",
      ward: "Ward 40 (Bloemendal)",
      issueType: "Potholes & Roads",
      description: "Deep, axle-breaking craters stretching along Standford Road bypass, causing serious damage to local taxis and cars.",
      urgency: "medium",
      status: "escalated",
      submittedBy: "Devon J.",
      date: "2026-06-20",
      votes: 115
    }
  ]);

  // Volunteers state
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [currentMember, setCurrentMember] = useState<Volunteer | null>(null);

  // Form States
  const [issueForm, setIssueForm] = useState({
    ward: "Ward 31",
    issueType: "Water Outage",
    description: "",
    urgency: "medium" as 'low' | 'medium' | 'high',
    submittedBy: ""
  });

  const [volunteerForm, setVolunteerForm] = useState({
    name: "",
    email: "",
    phone: "",
    ward: "Ward 31",
    skill: "Door-to-door Campaigning"
  });

  // Google Sheets Integration & Submission Hooks
  const { submitForm: submitIssueToServer, loading: submittingIssue } = useFormSubmit();
  const { submitForm: submitVolunteerToServer, loading: submittingVolunteer } = useFormSubmit();
  const [lastSubmittedIssue, setLastSubmittedIssue] = useState<ServiceIssue | null>(null);

  // UI state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [selectedPress, setSelectedPress] = useState<PressRelease | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'submitted' | 'escalated' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [simulationState, setSimulationState] = useState<'deadlock' | 'na_broker'>('na_broker');

  // Load from local storage
  useEffect(() => {
    const savedIssues = localStorage.getItem("na_nmb_issues");
    if (savedIssues) {
      try { setIssues(JSON.parse(savedIssues)); } catch (e) { console.error(e); }
    }
    const savedVolunteers = localStorage.getItem("na_nmb_volunteers");
    if (savedVolunteers) {
      try { setVolunteers(JSON.parse(savedVolunteers)); } catch (e) { console.error(e); }
    }
  }, []);

  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Form Submissions
  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueForm.description.trim() || !issueForm.submittedBy.trim()) {
      triggerToast("Please fill in all fields before submitting.", "error");
      return;
    }

    const newIssue: ServiceIssue = {
      id: `issue-${Date.now()}`,
      ward: `${issueForm.ward} (Reported)`,
      issueType: issueForm.issueType,
      description: issueForm.description,
      urgency: issueForm.urgency,
      status: "submitted",
      submittedBy: issueForm.submittedBy,
      date: new Date().toISOString().split('T')[0],
      votes: 1
    };

    const serverResponse = await submitIssueToServer("issue", {
      id: newIssue.id,
      ward: newIssue.ward,
      issueType: newIssue.issueType,
      description: newIssue.description,
      urgency: newIssue.urgency,
      submittedBy: newIssue.submittedBy,
    });

    const updated = [newIssue, ...issues];
    setIssues(updated);
    localStorage.setItem("na_nmb_issues", JSON.stringify(updated));

    setLastSubmittedIssue(newIssue);

    if (serverResponse && serverResponse.success && !serverResponse.simulated) {
      triggerToast("Service delivery issue securely logged to Google Sheets database!", "success");
    } else {
      triggerToast("Logged locally. Connect Google Sheets in Settings to enable live logging.", "info");
    }

    setIssueForm({
      ward: "Ward 31",
      issueType: "Water Outage",
      description: "",
      urgency: "medium",
      submittedBy: ""
    });

    const tracker = document.getElementById("issue-tracker");
    if (tracker) { tracker.scrollIntoView({ behavior: 'smooth' }); }
  };

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!volunteerForm.name.trim() || !volunteerForm.email.trim() || !volunteerForm.phone.trim()) {
      triggerToast("Please provide your name, email, and phone number.", "error");
      return;
    }

    const membershipId = `NA-NMB-${volunteerForm.ward.replace(" ", "")}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newVolunteer: Volunteer = {
      name: volunteerForm.name,
      email: volunteerForm.email,
      phone: volunteerForm.phone,
      ward: volunteerForm.ward,
      skill: volunteerForm.skill,
      membershipId,
      date: new Date().toISOString().split('T')[0]
    };

    const serverResponse = await submitVolunteerToServer("volunteer", {
      name: newVolunteer.name,
      email: newVolunteer.email,
      phone: newVolunteer.phone,
      ward: newVolunteer.ward,
      skill: newVolunteer.skill,
      membershipId: newVolunteer.membershipId
    });

    const updated = [newVolunteer, ...volunteers];
    setVolunteers(updated);
    localStorage.setItem("na_nmb_volunteers", JSON.stringify(updated));
    setCurrentMember(newVolunteer);

    if (serverResponse && serverResponse.success && !serverResponse.simulated) {
      triggerToast(`Welcome to the Alliance! Membership ID ${membershipId} synced with Google Sheets database.`, "success");
    } else {
      triggerToast(`Welcome to the Alliance! Your official Membership ID is ${membershipId}`, "success");
    }

    setVolunteerForm({
      name: "",
      email: "",
      phone: "",
      ward: "Ward 31",
      skill: "Door-to-door Campaigning"
    });
  };

  const handleUpvote = (id: string) => {
    const updated = issues.map(issue => {
      if (issue.id === id) {
        return { ...issue, votes: issue.votes + 1 };
      }
      return issue;
    });
    setIssues(updated);
    localStorage.setItem("na_nmb_issues", JSON.stringify(updated));
    triggerToast("Issue upvoted! This prioritizes council advocacy efforts.", "info");
  };

  // Ward Victories / Press Releases data
  const pressReleases: PressRelease[] = [
    {
      id: "press-1",
      title: "R45M Metro Sanitation Funding Secured via Budget Deal",
      category: "Metro Council Victory",
      date: "June 20, 2026",
      summary: "National Alliance successfully uses structural leverage in council budget negotiations to mandate dedicated sewer rehabilitation for underfunded northern suburbs.",
      content: "GQEBERHA — Exercising our critical leverage in the Nelson Mandela Bay Metro Council, the National Alliance (NA) has successfully negotiated a binding budget allocation of R45 Million dedicated specifically to the rehabilitation of critical sanitation infrastructure across the northern areas, including Missionvale, Helenvale, and Bloemendal.\n\nParty leadership stated: 'We refused to pass the metro budget until structural commitments were made to address the constant sewage flows running through our children's school routes. This is the power of our balanced brokerage. We do not play politics; we deliver dignity.'\n\nThe funding has been ring-fenced in the 2026/27 municipal budget, and work is scheduled to commence within the next municipal quarter. Local NA oversight committees will monitor contractors on the ground to ensure corruption-free, high-quality delivery.",
      ward: "Metro Wide"
    },
    {
      id: "press-2",
      title: "Ward 31 High-Mast Security Lights Restored",
      category: "Community Victory",
      date: "June 12, 2026",
      summary: "Following intense community advocacy led by NA activists, six vital high-mast security floodlights are switched back on, restoring safety to local streets.",
      content: "GQEBERHA — Residents of Missionvale can walk with peace of mind after six major high-mast floodlights were restored to full operational status. The lights had been dark for over half a year due to vandalism and municipal neglect, creating high-risk areas exploited by criminal syndicates.\n\nFollowing community-led petitions and direct pressure applied in the council chambers by National Alliance representatives, the municipal technical department dispatched emergency restoration crews. All vandalized cables were replaced with anti-theft secure alloy materials.\n\n'This is a major victory for safety. The elderly and schoolchildren are no longer forced to navigate pitch darkness. We thank the community for standing united with the Alliance to hold municipal officials accountable.'",
      ward: "Ward 31 (Missionvale)"
    },
    {
      id: "press-3",
      title: "Emergency Water Tankers Dispatched to Wards 33, 35, & 38",
      category: "Direct Relief",
      date: "June 05, 2026",
      summary: "When the municipal water pump failed, leaving northern areas dry for 72 hours, NA coordinated private tanker relief directly to residents.",
      content: "GQEBERHA — In response to the catastrophic failure of the local water pump station which left thousands of residents without running water for over three consecutive days, the National Alliance mobilized independent emergency water distribution networks.\n\nBypassing the paralyzed municipal response, the NA coordinated with private water haulers to dispatch seven heavy-duty potable water tankers directly into community squares. Over 45,000 liters of clean, safe drinking water were successfully distributed to schools, clinics, and vulnerable households.\n\nAn NA representative commented: 'We cannot sit idle while our elders are forced to haul heavy buckets from dirty streams. If the metro council fails to act, we step up. Our community's immediate human rights are always our paramount priority.'",
      ward: "Wards 33, 35, & 38"
    }
  ];

  // Filter Issues
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = 
      issue.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.issueType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return issue.status === activeTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-red-600 selection:text-white antialiased" id="root-container">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
            id="toast-notification"
          >
            <div className={`p-4 rounded border-2 shadow-xl flex items-center justify-between ${
              toast.type === 'success' ? 'bg-black text-white border-red-600' :
              toast.type === 'error' ? 'bg-red-600 text-white border-black' :
              'bg-neutral-900 text-white border-red-600'
            }`}>
              <div className="flex items-center gap-3">
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0" />}
                {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-white shrink-0" />}
                {toast.type === 'info' && <Megaphone className="w-5 h-5 text-red-500 shrink-0" />}
                <p className="text-sm font-bold tracking-tight">{toast.message}</p>
              </div>
              <button onClick={() => setToast(null)} className="text-neutral-400 hover:text-white p-1" id="close-toast-btn">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header / Navigation */}
      <header className="sticky top-0 z-40 bg-white/98 border-b-4 border-black shadow-md" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo and Brand */}
            <a href="#" className="flex items-center gap-3 group" id="logo-link">
              <div className="relative flex items-center justify-center w-12 h-12 rounded bg-red-600 text-white font-extrabold shadow-sm group-hover:scale-105 transition-transform" id="logo-icon">
                <span className="font-display text-2xl tracking-widest">NA</span>
              </div>
              <div id="logo-text">
                <div className="flex items-center gap-2">
                  <h1 className="font-display font-black text-black tracking-tight text-xl leading-none">
                    National Alliance
                  </h1>
                  <span className="inline-flex items-center text-red-600 font-black text-sm uppercase select-none mt-0.5" title="i❤️NA">
                    i<SouthAfricanFlagHeart className="w-4 h-4 mx-0.5" />NA
                  </span>
                </div>
                <p className="text-[10px] text-red-600 font-extrabold tracking-widest uppercase mt-0.5">Voice of Nelson Mandela Bay</p>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8" id="desktop-nav">
              <a href="#about" className="text-xs font-black uppercase tracking-wider text-black hover:text-red-600 hover:underline decoration-2 transition-colors">Core Pillars</a>
              <a href="#council-balance" className="text-xs font-black uppercase tracking-wider text-black hover:text-red-600 hover:underline decoration-2 transition-colors">Balance of Power</a>
              <a href="#action-hub" className="text-xs font-black uppercase tracking-wider text-black hover:text-red-600 hover:underline decoration-2 transition-colors">Action Hub</a>
              <a href="#issue-tracker" className="text-xs font-black uppercase tracking-wider text-black hover:text-red-600 hover:underline decoration-2 transition-colors">Community Issues</a>
              <a href="#ward-updates" className="text-xs font-black uppercase tracking-wider text-black hover:text-red-600 hover:underline decoration-2 transition-colors">Ward Updates</a>
            </nav>

            {/* Slogan & CTA Button Group */}
            <div className="hidden sm:flex items-center gap-4" id="header-cta-group">
              <a 
                href="#action-hub" 
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("report-form");
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-black uppercase tracking-wider text-white bg-red-600 hover:bg-black border-2 border-red-600 hover:border-black transition-all shadow-sm"
                id="header-report-btn"
              >
                <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                Report Failure
              </a>
              <a 
                href="#volunteer-form"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("volunteer-form");
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-black uppercase tracking-wider text-white bg-black hover:bg-red-600 border-2 border-black hover:border-red-600 transition-all shadow-sm"
                id="header-join-btn"
              >
                Join Us
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="lg:hidden p-2 text-black hover:text-red-600 focus:outline-none"
              aria-label="Toggle menu"
              id="mobile-menu-toggle"
            >
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t-2 border-black bg-white overflow-hidden"
              id="mobile-dropdown"
            >
              <div className="px-4 py-4 space-y-3 flex flex-col">
                <a 
                  href="#about" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-black uppercase text-black hover:text-red-600 py-1"
                  id="mobile-nav-pillars"
                >
                  Core Pillars
                </a>
                <a 
                  href="#council-balance" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-black uppercase text-black hover:text-red-600 py-1"
                  id="mobile-nav-balance"
                >
                  Balance of Power
                </a>
                <a 
                  href="#action-hub" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-black uppercase text-black hover:text-red-600 py-1"
                  id="mobile-nav-hub"
                >
                  Action Hub
                </a>
                <a 
                  href="#issue-tracker" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-black uppercase text-black hover:text-red-600 py-1"
                  id="mobile-nav-issues"
                >
                  Community Issues Tracker
                </a>
                <a 
                  href="#ward-updates" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-black uppercase text-black hover:text-red-600 py-1"
                  id="mobile-nav-updates"
                >
                  Ward Updates
                </a>

                
                <div className="pt-3 flex flex-col gap-2 border-t border-neutral-200" id="mobile-action-buttons">
                  <a 
                    href="#action-hub"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setTimeout(() => {
                        const el = document.getElementById("report-form");
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="w-full inline-flex items-center justify-center py-3 bg-red-600 text-white font-black uppercase tracking-wider text-xs border-2 border-red-600"
                    id="mobile-report-btn"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Report Failure
                  </a>
                  <a 
                    href="#volunteer-form"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setTimeout(() => {
                        const el = document.getElementById("volunteer-form");
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="w-full inline-flex items-center justify-center py-3 bg-black text-white font-black uppercase tracking-wider text-xs border-2 border-black"
                    id="mobile-join-btn"
                  >
                    Join The Alliance
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-16 lg:py-24 border-b-4 border-black" id="hero-section">
        {/* Subtle red tint background accent */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(224,60,49,0.04),transparent_55%)] pointer-events-none"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left" id="hero-content-left">
              
              {/* AI Generated Gqeberha coastline Hero Image banner */}
              <div className="relative w-full h-44 sm:h-52 bg-neutral-100 border-4 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" id="hero-coastline-banner">
                <img 
                  src="/src/assets/images/gqeberha_coastline.jpg" 
                  alt="Coastline, Nelson Mandela Bay" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  id="hero-coastline-img"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                  <div>
                    <span className="text-[9px] font-black text-red-500 uppercase tracking-widest block">My Gqeberha</span>
                    <h4 className="text-xs sm:text-sm font-black uppercase tracking-tight text-white">Nelson Mandela Bay Coastline, Gqeberha</h4>
                  </div>
                  <div className="flex items-center gap-1.5 bg-red-600 text-white px-2.5 py-1 text-[9px] font-black uppercase tracking-wider border border-black shadow-xs">
                    i<SouthAfricanFlagHeart className="w-3.5 h-3.5" />NA
                  </div>
                </div>
              </div>

              {/* Headline */}
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-none text-black" id="hero-headline">
                Putting the People of <span className="text-red-600 block sm:inline">Nelson Mandela Bay</span> First
              </h2>

              {/* Mission Statement */}
              <p className="text-neutral-800 text-sm sm:text-base max-w-2xl leading-relaxed font-semibold" id="hero-statement">
                The National Alliance is the decisive community-focused voice for the northern areas, bringing structural stability, unyielding accountability, and fair representation to the Gqeberha metro council. We keep municipal governance honest, keeping the absolute balance of power to fund what your suburb deserves.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2" id="hero-cta-buttons">
                <a 
                  href="#volunteer-form" 
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById("volunteer-form");
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 bg-red-600 hover:bg-black text-white font-black uppercase tracking-wider text-xs border-2 border-red-600 hover:border-black transition-all shadow-md inline-flex items-center gap-2 group"
                  id="hero-join-cta"
                >
                  <UserPlus className="w-4 h-4" />
                  Join the Alliance
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a 
                  href="#report-form" 
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById("report-form");
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 bg-white hover:bg-neutral-50 text-black font-black uppercase tracking-wider text-xs border-2 border-black inline-flex items-center gap-2 transition-all shadow-sm"
                  id="hero-contact-cta"
                >
                  <FileText className="w-4 h-4 text-red-600" />
                  Contact Us / Report Failures
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t-2 border-neutral-200 max-w-md" id="hero-stats">
                <div>
                  <div className="text-3xl font-black text-red-600">100%</div>
                  <div className="text-black text-[10px] font-black uppercase tracking-wider mt-0.5">Locally Grown</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-black">36+</div>
                  <div className="text-black text-[10px] font-black uppercase tracking-wider mt-0.5">Wards Active</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-red-600">R45M+</div>
                  <div className="text-black text-[10px] font-black uppercase tracking-wider mt-0.5">Budget Secured</div>
                </div>
              </div>
            </div>

            {/* Hero Right Graphic Column */}
            <div className="lg:col-span-5 relative" id="hero-content-right">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Thick retro box shadow border wrapper */}
                <div className="relative bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden" id="hero-mockup-card">
                  
                  <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-neutral-100" id="hero-mockup-header">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
                      <div className="text-[10px] font-black text-red-600 tracking-wider uppercase">Live Metro Monitor</div>
                    </div>
                    <div className="text-[10px] font-black text-black uppercase tracking-wider">NMB Metro Gqeberha</div>
                  </div>

                  {/* Wide-angle Gqeberha panoramic view container */}
                  <div className="relative h-48 bg-neutral-100 border-2 border-black overflow-hidden mb-6 group" id="hero-image-container">
                    {/* High-quality Gqeberha bay & stadium panoramic photo */}
                    <img 
                      src={metroMonitorApp} 
                      alt="Nelson Mandela Bay Metro Monitor App tracker interface overview" 
                      className="w-full h-full object-cover grayscale-10 group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                      id="hero-img"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      
                      <p className="text-[11px] font-black leading-tight text-white shadow-xs"></p>
                    </div>
                  </div>

                  {/* Real-time details */}
                  <div className="space-y-3 text-sm" id="hero-mockup-details">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600 font-bold flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-red-600" />
                        Northern Wards Focus:
                      </span>
                      <span className="font-black text-black">100% Committed</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600 font-bold flex items-center gap-1.5">
                        <Scale className="w-4 h-4 text-red-600" />
                        Coalition Lever:
                      </span>
                      <span className="font-black text-red-600 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" /> Strong Balance
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600 font-bold flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-red-600" />
                        Gqeberha Community:
                      </span>
                      <span className="font-black text-black text-xs uppercase tracking-wider">
                        Active & Loyal
                      </span>
                    </div>
                  </div>

                  {/* Detail link */}
                  <div className="mt-5 pt-4 border-t-2 border-neutral-100 flex justify-between items-center" id="hero-mockup-footer">
                    <span className="text-[10px] font-bold text-neutral-500">Service delivery is local.</span>
                    <a href="#council-balance" className="text-[10px] font-black text-red-600 hover:text-black hover:underline inline-flex items-center gap-0.5">
                      How we balance power
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Pillars / Initiatives Section */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-12 bg-neutral-50 border-b-4 border-black">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3" id="pillars-header">
            <span className="text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 border border-red-200 px-3 py-1">
              Our Blueprint for Nelson Mandela Bay
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-black tracking-tight uppercase">
              Three Pillars of Democratic Leverage
            </h2>
            <div className="w-20 h-1.5 bg-red-600 mx-auto"></div>
            <p className="text-neutral-700 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed font-medium pt-2">
              The National Alliance leverages local municipal power to secure resources. We refuse to participate in national political grandstanding. We represent you.
            </p>
          </div>

          {/* Pillars Grid */}
          <div className="grid md:grid-cols-3 gap-8" id="pillars-grid">
            
            {/* Pillar 1 */}
            <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex gap-4" id="pillar-card-1">
              <div className="flex-none w-12 h-12 bg-red-50 border border-red-200 text-red-600 rounded-xs flex items-center justify-center shadow-xs">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-lg text-black mb-2 uppercase tracking-tight">
                  Community Advocacy
                </h3>
                <p className="text-xs text-neutral-800 leading-relaxed font-medium">
                  Decades of metro neglect have left northern Gqeberha suburbs with failing roads and broken pipelines. We force the Metro Council to allocate your tax money directly back into your neighborhood.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex gap-4" id="pillar-card-2">
              <div className="flex-none w-12 h-12 bg-red-50 border border-red-200 text-red-600 rounded-xs flex items-center justify-center shadow-xs">
                <Droplets className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-lg text-black mb-2 uppercase tracking-tight">
                  Service Delivery
                </h3>
                <p className="text-xs text-neutral-800 leading-relaxed font-medium">
                  High-mast security light failures and sewage line leaks are immediate human dignity concerns. Our ward representatives work closely with technical engineers to expedite street-level repairs.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex gap-4" id="pillar-card-3">
              <div className="flex-none w-12 h-12 bg-red-50 border border-red-200 text-red-600 rounded-xs flex items-center justify-center shadow-xs">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-lg text-black mb-2 uppercase tracking-tight">
                  Balanced Power
                </h3>
                <p className="text-xs text-neutral-800 leading-relaxed font-medium">
                  In NMB Metro, deadlocks paralyze the municipal machinery. The National Alliance steps in as an objective mediator—trading budget votes solely for binding ward funding commitments.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Council Balance of Power Visualizer */}
      <section id="council-balance" className="py-16 lg:py-20 bg-black text-white relative overflow-hidden border-b-4 border-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(224,60,49,0.1),transparent_60%)] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left explanation column */}
            <div className="lg:col-span-5 space-y-6" id="balance-explainer">
              <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 border border-red-500/30 px-3 py-1 inline-block">
                Democratic Leverage Explained
              </span>
              <h2 className="font-display text-3xl font-black tracking-tight text-white leading-tight uppercase">
                How We Defeat Metro Gridlock
              </h2>
              <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed font-semibold">
                The Nelson Mandela Bay Metro Council consists of 120 seats. Passing local budgets and deploying engineering contracts requires a strict majority of <span className="text-red-500 font-extrabold">61 votes</span>.
              </p>
              
              <p className="text-neutral-400 text-xs leading-relaxed">
                When massive national political blocs refuse to negotiate, the metro council freezes. Trash collection halts, street lights remain dark, and water systems fail. <strong>This is where the National Alliance holds the scale of justice.</strong>
              </p>

              {/* Interactive Controller */}
              <div className="bg-neutral-900 border-2 border-neutral-700 p-5 rounded-none space-y-4 shadow-lg" id="simulation-controller">
                <p className="text-[10px] font-black uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-red-500" />
                  Toggle Council Simulation State:
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => {
                      setSimulationState('deadlock');
                      triggerToast("Simulation: Blocs deadlocked at 48 seats. Council frozen, service delivery stalled.", "error");
                    }}
                    className={`px-3 py-2.5 rounded-none text-[10px] font-black uppercase tracking-wider text-center border-2 transition-all ${
                      simulationState === 'deadlock' 
                        ? 'bg-red-600 text-white border-red-600 shadow-inner' 
                        : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                    }`}
                    id="btn-deadlock-state"
                  >
                    Council Deadlock
                  </button>
                  <button 
                    onClick={() => {
                      setSimulationState('na_broker');
                      triggerToast("Simulation: National Alliance secures the 61st vote for local funding!", "success");
                    }}
                    className={`px-3 py-2.5 rounded-none text-[10px] font-black uppercase tracking-wider text-center border-2 transition-all flex items-center justify-center gap-1.5 ${
                      simulationState === 'na_broker' 
                        ? 'bg-red-600 text-white border-red-600 shadow-inner' 
                        : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                    }`}
                    id="btn-na-state"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    NA Mediation
                  </button>
                </div>

                <div className="text-xs bg-black p-3.5 border border-neutral-800 text-neutral-300" id="simulation-status-text">
                  {simulationState === 'deadlock' ? (
                    <p className="flex items-start gap-2 text-red-400 text-[11px] font-bold">
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span><strong>GRIDLOCK:</strong> Major national factions lock horns. Metro grants are frozen. No road repairs or light restoration takes place in northern wards.</span>
                    </p>
                  ) : (
                    <p className="flex items-start gap-2 text-emerald-400 text-[11px] font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>NA INTERVENTION:</strong> We commit our votes conditionally. Sewage infrastructure, lights, and local water security are funded! Local communities win!</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Interactive Visual Graphic Column */}
            <div className="lg:col-span-7 bg-neutral-900 border-4 border-neutral-800 p-6 sm:p-8 relative shadow-2xl" id="balance-schematic">
              <div className="absolute top-4 right-4 bg-black px-3 py-1 text-[9px] font-mono text-neutral-400 uppercase tracking-widest border border-neutral-800">
                120-Seat Chamber Map
              </div>
              
              <div className="mb-6">
                <h3 className="font-display font-black text-lg text-neutral-200 mb-1 uppercase tracking-tight">
                  Metro Council voting model
                </h3>
                <p className="text-xs text-neutral-400 font-medium">
                  Visual mapping of the seat allocation required to pass local municipal projects.
                </p>
              </div>

              {/* Council Seat dots visualizer */}
              <div className="relative py-2 flex flex-col items-center">
                
                <div className="w-full max-w-sm aspect-video relative flex flex-wrap justify-center gap-1.5 py-4" id="dots-chamber">
                  {Array.from({ length: 120 }).map((_, idx) => {
                    let dotColor = "bg-neutral-850";
                    
                    if (idx < 48) {
                      dotColor = simulationState === 'deadlock' ? "bg-neutral-500" : "bg-neutral-700/40";
                    } else if (idx < 96) {
                      dotColor = simulationState === 'deadlock' ? "bg-neutral-600" : "bg-neutral-800/40";
                    } else if (idx < 112) {
                      dotColor = "bg-neutral-800";
                    } else {
                      // National Alliance (Holds the crucial key seats)
                      dotColor = simulationState === 'deadlock' 
                        ? "bg-red-500 shadow-md shadow-red-500/20 animate-pulse scale-110" 
                        : "bg-red-600 scale-125 ring-2 ring-white shadow-lg shadow-red-600/60";
                    }

                    return (
                      <div 
                        key={idx} 
                        className={`w-3 h-3 rounded-none transition-all duration-300 ${dotColor}`}
                        title={idx >= 112 ? "National Alliance Balance Maker Seat" : `Metro Council Seat ${idx + 1}`}
                      ></div>
                    );
                  })}
                </div>

                {/* Legend display */}
                <div className="w-full border-t border-neutral-800 pt-6 mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center" id="dots-legend">
                  <div className="bg-black p-2 border border-neutral-800">
                    <span className="block text-[9px] text-neutral-500 uppercase tracking-wider font-black">Bloc A</span>
                    <span className="text-xs font-black text-neutral-300">48 Seats</span>
                  </div>
                  <div className="bg-black p-2 border border-neutral-800">
                    <span className="block text-[9px] text-neutral-500 uppercase tracking-wider font-black">Bloc B</span>
                    <span className="text-xs font-black text-neutral-400">48 Seats</span>
                  </div>
                  <div className="bg-black p-2 border border-neutral-800">
                    <span className="block text-[9px] text-neutral-500 uppercase tracking-wider font-black">Other Parties</span>
                    <span className="text-xs font-black text-neutral-500">16 Seats</span>
                  </div>
                  <div className="bg-neutral-905 p-2 border-2 border-red-600">
                    <span className="block text-[9px] text-red-500 uppercase tracking-wider font-black">Nat Alliance</span>
                    <span className="text-xs font-black text-red-500 flex items-center justify-center gap-1">
                      8 Seats <Sparkles className="w-3.5 h-3.5 text-red-600" />
                    </span>
                  </div>
                </div>

                {/* Resolution outcome message */}
                <div className="w-full mt-6 bg-black p-4 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4" id="simulation-resolution">
                  <div>
                    <span className="text-[9px] text-neutral-500 font-mono block uppercase">VOTING POWER COMBINATION STATUS:</span>
                    <div className="flex items-center gap-2 mt-1">
                      {simulationState === 'deadlock' ? (
                        <>
                          <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></div>
                          <span className="text-xs font-black text-red-500 uppercase tracking-wider">Blocked (48 Blocs Locked)</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">Budget Unlocked (61+ Majority)</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {simulationState === 'deadlock' ? (
                    <div className="text-[10px] font-black bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1.5" id="sim-outcome-locked">
                      Requires 13 seats to pass.
                    </div>
                  ) : (
                    <div className="text-[10px] font-black bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1.5" id="sim-outcome-secured">
                      Local Budget Secured!
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Community Action Hub Section */}
      <section id="action-hub" className="py-16 px-4 sm:px-6 lg:px-12 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3" id="hub-header">
            <span className="text-xs font-black uppercase tracking-widest text-white bg-red-600 border border-red-600 px-3 py-1">
              Community Action Hub
            </span>
            <h2 className="font-display text-3xl font-black text-black tracking-tight uppercase">
              Direct Action Over Rhetoric
            </h2>
            <div className="w-16 h-1 bg-black mx-auto"></div>
            <p className="text-neutral-700 text-xs sm:text-sm font-semibold leading-relaxed pt-2">
              We bypass red tape. Use our direct action forms to alert municipal team leaders of localized service delivery failures, or join us as a card-carrying National Alliance member to start organizing your neighborhood.
            </p>
          </div>

          {/* Form Side-By-Side Blocks */}
          <div className="grid lg:grid-cols-2 gap-8 items-start" id="hub-forms-grid">
            
            {/* Form Left Block: Report an Issue */}
            <div id="report-form" className="bg-white border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-2 bg-red-600"></div>
              
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-10 h-10 bg-red-50 text-red-600 flex items-center justify-center font-black border border-red-200">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-display font-black text-sm text-black uppercase tracking-wide">
                    Report a Community Issue
                  </h3>
                  <p className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">Alert our ward technical champions.</p>
                </div>
              </div>

              {/* Strategically styled with crisp black borders and red outlines */}
              <AnimatePresence mode="wait">
                {lastSubmittedIssue ? (
                  <motion.div
                    key="issue-success"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="space-y-5"
                    id="whatsapp-redirect-container"
                  >
                    <div className="p-5 border-4 border-dashed border-red-600 bg-red-50 relative space-y-4">
                      <button
                        onClick={() => setLastSubmittedIssue(null)}
                        className="absolute top-2 right-2 text-neutral-500 hover:text-black p-1"
                        id="close-whatsapp-card-btn"
                        title="Dismiss"
                      >
                        <X className="w-4.5 h-4.5" />
                      </button>

                      <div className="flex items-center gap-3 border-b-2 border-neutral-200 pb-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                          ✓
                        </div>
                        <div>
                          <span className="block text-[9px] font-black text-red-600 uppercase tracking-widest">RECORD SECURED</span>
                          <h4 className="text-xs font-black text-black uppercase tracking-tight">Logged to Google Sheets Database</h4>
                        </div>
                      </div>

                      <div className="text-[11px] space-y-1.5 text-neutral-800 font-semibold">
                        <p>👤 <strong>Reporter:</strong> {lastSubmittedIssue.submittedBy}</p>
                        <p>📍 <strong>Ward/Area:</strong> {lastSubmittedIssue.ward}</p>
                        <p>🛠️ <strong>Issue Category:</strong> {lastSubmittedIssue.issueType}</p>
                        <p className="line-clamp-2 bg-white p-2 border border-neutral-300 rounded-xs italic text-neutral-600">
                          "{lastSubmittedIssue.description}"
                        </p>
                      </div>

                      <div className="bg-white p-3.5 border-2 border-black rounded-xs space-y-3">
                        <p className="text-[10px] text-neutral-700 font-extrabold leading-relaxed uppercase tracking-wide">
                          🚀 Escalated to Council Tracker!
                        </p>
                        <p className="text-[10px] text-neutral-500 font-medium leading-normal">
                          For immediate response, you can choose to directly send this failure report formatted as a clean notification to our designated ward coordinator <strong>Sindi</strong> over WhatsApp.
                        </p>
                        
                        <a
                          href={generateWhatsAppLink(lastSubmittedIssue)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 bg-emerald-600 hover:bg-black text-white font-black uppercase tracking-wider text-[11px] border-2 border-emerald-600 hover:border-black transition-all flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                          id="whatsapp-redirect-btn"
                        >
                          <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.665.988 3.3 1.47 4.909 1.47 5.432 0 9.851-4.417 9.854-9.854.001-2.632-1.02-5.107-2.875-6.964-1.854-1.855-4.329-2.876-6.967-2.877-5.433 0-9.854 4.418-9.858 9.856-.001 1.693.456 3.344 1.321 4.81l-.995 3.636 3.738-.981.178.11zM17.2 14.542c-.286-.143-1.693-.836-1.954-.931-.261-.096-.452-.143-.643.143-.19.287-.738.931-.905 1.121-.166.19-.333.214-.619.071-.286-.143-1.209-.445-2.3-1.42-.851-.76-1.424-1.7-1.591-1.986-.167-.286-.018-.44.125-.582.128-.129.286-.334.429-.5.143-.167.19-.286.286-.476.096-.19.048-.357-.024-.5-.071-.143-.643-1.548-.881-2.12-.231-.557-.467-.481-.643-.49-.166-.008-.357-.01-.548-.01-.19 0-.5.071-.762.357-.262.286-1 .977-1 2.382s1.024 2.763 1.167 2.953c.143.19 2.015 3.078 4.881 4.318.682.295 1.214.471 1.629.603.685.218 1.309.187 1.802.114.549-.081 1.693-.692 1.93-.1.357 2.381-1.024 3.525-1.167 3.715-.143.19-.333.286-.619.143z" />
                          </svg>
                          Send Directly via WhatsApp
                        </a>
                      </div>

                      <button
                        onClick={() => setLastSubmittedIssue(null)}
                        className="w-full py-2 bg-white hover:bg-neutral-100 text-neutral-800 font-black uppercase tracking-wider text-[10px] border-2 border-black transition-all flex items-center justify-center gap-1.5"
                        id="log-another-issue-btn"
                      >
                        <Plus className="w-4 h-4" />
                        Log Another Failure Report
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="issue-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleIssueSubmit}
                    className="space-y-4"
                  >
                    {/* Submitter Name */}
                    <div>
                      <label className="block text-[10px] font-black uppercase text-black tracking-wider mb-1" htmlFor="issue-name">
                        Your Name or Anonymous Alias *
                      </label>
                      <input 
                        type="text" 
                        id="issue-name"
                        required
                        disabled={submittingIssue}
                        placeholder="e.g. Sindi M. / Missionvale Resident"
                        className="w-full bg-white border-2 border-black text-xs p-3 rounded-none focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 text-black font-semibold disabled:bg-neutral-50 disabled:text-neutral-500"
                        value={issueForm.submittedBy}
                        onChange={(e) => setIssueForm({ ...issueForm, submittedBy: e.target.value })}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Ward / Suburb area selection */}
                      <div>
                        <label className="block text-[10px] font-black uppercase text-black tracking-wider mb-1" htmlFor="issue-ward">
                          Select Ward/Area *
                        </label>
                        <select 
                          id="issue-ward"
                          disabled={submittingIssue}
                          className="w-full bg-white border-2 border-black text-xs p-3 rounded-none text-black font-semibold focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 disabled:bg-neutral-50"
                          value={issueForm.ward}
                          onChange={(e) => setIssueForm({ ...issueForm, ward: e.target.value })}
                        >
                          <option value="Ward 31">Ward 31 (Missionvale / Salsoneville)</option>
                          <option value="Ward 32">Ward 32 (Chatty / Gqeberha North)</option>
                          <option value="Ward 33">Ward 33 (Kariega / Despatch South)</option>
                          <option value="Ward 34">Ward 34 (Bloemendal East)</option>
                          <option value="Ward 35">Ward 35 (Salsoneville Core)</option>
                          <option value="Ward 38">Ward 38 (Helenvale)</option>
                          <option value="Ward 40">Ward 40 (Bloemendal West / Salt Lake)</option>
                          <option value="Other NMB Ward">Other Nelson Mandela Bay Ward</option>
                        </select>
                      </div>

                      {/* Issue Category */}
                      <div>
                        <label className="block text-[10px] font-black uppercase text-black tracking-wider mb-1" htmlFor="issue-category">
                          Issue Type *
                        </label>
                        <select 
                          id="issue-category"
                          disabled={submittingIssue}
                          className="w-full bg-white border-2 border-black text-xs p-3 rounded-none text-black font-semibold focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 disabled:bg-neutral-50"
                          value={issueForm.issueType}
                          onChange={(e) => setIssueForm({ ...issueForm, issueType: e.target.value })}
                        >
                          <option value="Water Outage">Water Outage / Burst Pipes</option>
                          <option value="Electricity Failure">Electricity / Vandalized Lights</option>
                          <option value="Sanitation & Sewers">Sanitation / Overflowing Sewage</option>
                          <option value="Potholes & Roads">Potholes / Damaged Access Roads</option>
                          <option value="Refuse Dumping">Illegal Refuse Dumping Sites</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Urgency Rating */}
                      <div>
                        <label className="block text-[10px] font-black uppercase text-black tracking-wider mb-1" id="label-urgency">
                          Urgency Level *
                        </label>
                        <div className="flex gap-2" aria-labelledby="label-urgency">
                          {(['low', 'medium', 'high'] as const).map((level) => (
                            <button
                              key={level}
                              type="button"
                              disabled={submittingIssue}
                              onClick={() => setIssueForm({ ...issueForm, urgency: level })}
                              className={`flex-1 py-2 text-[10px] font-black uppercase border-2 transition-all ${
                                issueForm.urgency === level 
                                  ? 'bg-red-600 text-white border-red-600 shadow-inner' 
                                  : 'bg-white text-black border-black hover:bg-neutral-50 disabled:opacity-50'
                              }`}
                            >
                               {level}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Help Info text */}
                      <div className="flex items-center text-[10px] text-neutral-500 bg-neutral-50 p-2.5 border border-neutral-300">
                        <p className="leading-tight">
                          <strong>Note:</strong> High-urgency tickets trigger instant local coordinator priority escalations.
                        </p>
                      </div>
                    </div>

                    {/* Issue Description */}
                    <div>
                      <label className="block text-[10px] font-black uppercase text-black tracking-wider mb-1" htmlFor="issue-desc">
                        Detailed Description & Location Details *
                      </label>
                      <textarea 
                        id="issue-desc"
                        required
                        disabled={submittingIssue}
                        rows={3}
                        placeholder="e.g. Major sewage pipe burst directly behind Aubrey Street primary school fence. Flowing into playground since Thursday."
                        className="w-full bg-white border-2 border-black text-xs p-3 rounded-none focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 text-black font-semibold resize-none disabled:bg-neutral-50 disabled:text-neutral-500"
                        value={issueForm.description}
                        onChange={(e) => setIssueForm({ ...issueForm, description: e.target.value })}
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={submittingIssue}
                      className="w-full py-3 bg-red-600 hover:bg-black text-white font-black uppercase tracking-wider text-xs border-2 border-red-600 hover:border-black transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                      id="submit-issue-btn"
                    >
                      {submittingIssue ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Logging To Google Sheets...
                        </>
                      ) : (
                        <>
                          <Megaphone className="w-4 h-4" />
                          Log Issue For Council Escalation
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Form Right Block: Become a Member/Volunteer */}
            <div id="volunteer-form" className="bg-white border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-2 bg-black"></div>
              
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-10 h-10 bg-neutral-900 text-white flex items-center justify-center font-black">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-black text-sm text-black uppercase tracking-wide">
                    Become a Member / Volunteer
                  </h3>
                  <p className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">Secure your card & claim community voice.</p>
                </div>
              </div>

              <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                
                {/* Full Names */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-black tracking-wider mb-1" htmlFor="volunteer-name">
                    Full Name & Surname *
                  </label>
                  <input 
                    type="text" 
                    id="volunteer-name"
                    required
                    disabled={submittingVolunteer}
                    placeholder="e.g. Amanda Gxolo"
                    className="w-full bg-white border-2 border-black text-xs p-3 rounded-none focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 text-black font-semibold disabled:bg-neutral-50 disabled:text-neutral-500"
                    value={volunteerForm.name}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, name: e.target.value })}
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-black tracking-wider mb-1" htmlFor="volunteer-email">
                    Email Address *
                  </label>
                  <input 
                    type="type" 
                    id="volunteer-email"
                    required
                    disabled={submittingVolunteer}
                    placeholder="e.g. amanda.g@nmbmail.co.za"
                    className="w-full bg-white border-2 border-black text-xs p-3 rounded-none focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 text-black font-semibold disabled:bg-neutral-50 disabled:text-neutral-500"
                    value={volunteerForm.email}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, email: e.target.value })}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Phone number */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-black tracking-wider mb-1" htmlFor="volunteer-phone">
                      Cell Number *
                    </label>
                    <input 
                      type="tel" 
                      id="volunteer-phone"
                      required
                      disabled={submittingVolunteer}
                      placeholder="e.g. 073 123 4567"
                      className="w-full bg-white border-2 border-black text-xs p-3 rounded-none focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 text-black font-semibold disabled:bg-neutral-50 disabled:text-neutral-500"
                      value={volunteerForm.phone}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, phone: e.target.value })}
                    />
                  </div>

                  {/* Ward Number/Area as explicitly required */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-black tracking-wider mb-1" htmlFor="volunteer-ward">
                      Ward Number / Area *
                    </label>
                    <select 
                      id="volunteer-ward"
                      disabled={submittingVolunteer}
                      className="w-full bg-white border-2 border-black text-xs p-3 rounded-none text-black font-semibold focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 disabled:bg-neutral-50"
                      value={volunteerForm.ward}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, ward: e.target.value })}
                    >
                      <option value="Ward 31">Ward 31 (Missionvale)</option>
                      <option value="Ward 32">Ward 32 (Chatty)</option>
                      <option value="Ward 33">Ward 33 (Kariega)</option>
                      <option value="Ward 34">Ward 34 (Bloemendal East)</option>
                      <option value="Ward 35">Ward 35 (Salsoneville)</option>
                      <option value="Ward 38">Ward 38 (Helenvale)</option>
                      <option value="Ward 40">Ward 40 (Bloemendal West)</option>
                      <option value="Other Ward">Other NMB Ward</option>
                    </select>
                  </div>
                </div>

                {/* Primary Contribution Area */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-black tracking-wider mb-1" htmlFor="volunteer-skill">
                    Primary Contribution Skill *
                  </label>
                  <select 
                    id="volunteer-skill"
                    disabled={submittingVolunteer}
                    className="w-full bg-white border-2 border-black text-xs p-3 rounded-none text-black font-semibold focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 disabled:bg-neutral-50"
                    value={volunteerForm.skill}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, skill: e.target.value })}
                  >
                    <option value="Door-to-door Campaigning">Door-to-door Activism & Neighborhood Leaflets</option>
                    <option value="Community Infrastructure Watch">Infrastructure Watch & Delivery Auditing</option>
                    <option value="Legal & Advisory Council">Legal Services & Council Policy Advisory</option>
                    <option value="Public Safety & Patrols">Street Safety Patrol Coordination</option>
                    <option value="Media & Mobilization">Social Media & Public Event Mobilization</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  disabled={submittingVolunteer}
                  className="w-full py-3 bg-black hover:bg-red-600 text-white font-black uppercase tracking-wider text-xs border-2 border-black hover:border-red-600 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  id="submit-volunteer-btn"
                >
                  {submittingVolunteer ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Registering To Google Sheets...
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4" />
                      Generate My NA Membership Card
                    </>
                  )}
                </button>

              </form>

              {/* Simulated generated membership ID badge */}
              <AnimatePresence>
                {currentMember && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="mt-6 p-5 border-4 border-dashed border-red-600 bg-red-50 relative"
                    id="simulated-badge-card"
                  >
                    <button 
                      onClick={() => setCurrentMember(null)}
                      className="absolute top-2 right-2 text-neutral-500 hover:text-black p-1"
                      id="close-badge-btn"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-center justify-between border-b-2 border-neutral-300 pb-3 mb-3">
                      <div>
                        <span className="block text-[9px] font-black text-red-600 uppercase tracking-widest">OFFICIAL CARD</span>
                        <h4 className="text-sm font-black text-black uppercase tracking-tight">National Alliance</h4>
                      </div>
                      <div className="flex items-center gap-0.5 bg-black text-white text-[9px] px-1.5 py-0.5 font-black uppercase">
                        <span>i</span>
                        <SouthAfricanFlagHeart className="w-3 h-3" />
                        <span>NA</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div>
                        <span className="text-[9px] font-black text-neutral-500 block uppercase">MEMBER NAME:</span>
                        <span className="font-extrabold text-black uppercase">{currentMember.name}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[9px] font-black text-neutral-500 block uppercase">WARD NUMBER:</span>
                          <span className="font-extrabold text-black">{currentMember.ward}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-neutral-500 block uppercase">MEMBERSHIP ID:</span>
                          <span className="font-mono font-black text-red-600">{currentMember.membershipId}</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-[9px] text-neutral-600 font-bold">
                        <span>ISSUED: {currentMember.date}</span>
                        <span className="text-red-600 font-black">STABILITY & DIGNITY</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>
        </div>
      </section>

      {/* Community Issues Tracker Section */}
      <section id="issue-tracker" className="py-16 px-4 sm:px-6 lg:px-12 bg-neutral-50 border-b-4 border-black">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12" id="tracker-header">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 border border-red-200 px-3 py-1">
                Real-Time Transparency
              </span>
              <h2 className="font-display text-3xl font-black text-black tracking-tight uppercase">
                Community Issues Monitor
              </h2>
              <p className="text-neutral-700 text-xs sm:text-sm font-semibold max-w-xl">
                Track live service failures reported by Gqeberha residents. Support issues to boost their priority index for metro council budget negotiations.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full max-w-xs shrink-0" id="tracker-search">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder="Search wards, issue types..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-black pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 text-black font-semibold rounded-none"
              />
            </div>
          </div>

          {/* Status Tab Filters */}
          <div className="flex flex-wrap gap-2 mb-6 border-b-2 border-neutral-200 pb-3" id="tracker-tabs">
            {(['all', 'submitted', 'escalated', 'resolved'] as const).map((tab) => {
              const count = tab === 'all' 
                ? issues.length 
                : issues.filter(i => i.status === tab).length;
              
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-xs font-black uppercase border-2 transition-all ${
                    activeTab === tab 
                      ? 'bg-black text-white border-black shadow-sm' 
                      : 'bg-white text-black border-neutral-300 hover:border-black'
                  }`}
                >
                  {tab} ({count})
                </button>
              );
            })}
          </div>

          {/* Issues List Grid */}
          <div className="grid md:grid-cols-2 gap-6" id="tracker-list-grid">
            <AnimatePresence mode="popLayout">
              {filteredIssues.map((issue) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  key={issue.id}
                  className="bg-white border-2 border-black p-5 relative flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                  id={`issue-card-${issue.id}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-neutral-500">
                        <MapPin className="w-3.5 h-3.5 text-red-600" />
                        <span>{issue.ward}</span>
                      </div>

                      {/* Status indicator pill */}
                      <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                        issue.status === 'resolved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        issue.status === 'escalated' ? 'bg-red-50 text-red-700 border border-red-200' :
                        'bg-neutral-100 text-neutral-700 border border-neutral-300'
                      }`}>
                        {issue.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-sm text-black uppercase tracking-tight">{issue.issueType}</h4>
                      <p className="text-xs text-neutral-700 font-medium leading-relaxed mt-1">{issue.description}</p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-500 font-semibold">
                    <div>
                      <span className="block uppercase text-[9px] text-neutral-400">Reported By</span>
                      <span className="text-black font-extrabold">{issue.submittedBy}</span>
                    </div>

                    {/* Upvote button */}
                    <button
                      onClick={() => handleUpvote(issue.id)}
                      className="inline-flex items-center gap-1.5 bg-neutral-50 hover:bg-red-50 hover:text-red-600 border border-neutral-300 hover:border-red-300 px-3 py-1.5 transition-colors text-xs font-black uppercase tracking-wider text-black"
                      title="Support this report to highlight it for council advocacy"
                    >
                      <span>👍</span>
                      <span>Support ({issue.votes})</span>
                    </button>
                  </div>
                </motion.div>
              ))}

              {filteredIssues.length === 0 && (
                <div className="col-span-full bg-white border-2 border-dashed border-neutral-300 py-12 text-center" id="no-issues-fallback">
                  <AlertTriangle className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <p className="text-xs font-black uppercase text-neutral-500">No active community issues found matching filters.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Prompt to log new issues */}
          <div className="mt-8 text-center bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" id="tracker-prompt">
            <h4 className="text-sm font-black uppercase text-black mb-1">Experiencing local utility or road failures in your ward?</h4>
            <p className="text-xs text-neutral-650 font-semibold mb-4">Log it immediately in our community action hub to demand rapid intervention.</p>
            <a 
              href="#action-hub"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("report-form");
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-black text-white px-5 py-2.5 text-xs font-black uppercase tracking-wider border-2 border-red-600 hover:border-black transition-all"
            >
              Report Your Issue Now
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      </section>

      {/* Latest Ward Updates / Victories Section */}
      <section id="ward-updates" className="py-16 px-4 sm:px-6 lg:px-12 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3" id="updates-header">
            <span className="text-xs font-black uppercase tracking-widest text-white bg-black border border-black px-3 py-1">
              Latest Ward Victories
            </span>
            <h2 className="font-display text-3xl font-black text-black tracking-tight uppercase">
              Proven Delivery Wins on the Ground
            </h2>
            <div className="w-20 h-1.5 bg-red-600 mx-auto"></div>
            <p className="text-neutral-700 text-xs sm:text-sm font-semibold max-w-xl mx-auto pt-2 leading-relaxed">
              We do not just advocate in council chambers; we deliver physical, verifiable improvements across Gqeberha suburbs.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8" id="updates-cards-grid">
            {pressReleases.map((release) => (
              <div 
                key={release.id}
                className="bg-white border-2 border-black p-6 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                id={`press-card-${release.id}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider border-b border-neutral-100 pb-2">
                    <span className="text-red-600 bg-red-50 border border-red-200 px-2 py-0.5">{release.category}</span>
                    <span className="text-neutral-400">{release.date}</span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-black uppercase tracking-tight leading-tight">{release.title}</h3>
                    <p className="text-xs text-neutral-700 font-medium leading-relaxed mt-2.5">{release.summary}</p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[10px] font-black text-neutral-400">Nelson Mandela Bay</span>
                  <button
                    onClick={() => {
                      setSelectedPress(release);
                      triggerToast(`Opening release: ${release.title}`, "info");
                    }}
                    className="inline-flex items-center gap-0.5 text-xs font-black uppercase text-red-600 hover:text-black hover:underline"
                  >
                    Read Victory details
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Dynamic Press Release Modal Dialog */}
      <AnimatePresence>
        {selectedPress && (
          <div className="fixed inset-0 z-50 overflow-y-auto" id="press-modal">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              
              {/* Overlay backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedPress(null)}
                className="fixed inset-0 transition-opacity bg-neutral-900/60 backdrop-blur-xs"
              ></motion.div>

              {/* Center dialog spacing element */}
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              {/* Modal panel body */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                className="inline-block overflow-hidden text-left align-bottom bg-white border-4 border-black rounded-none shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
                id="modal-panel"
              >
                {/* Header title */}
                <div className="bg-neutral-950 text-white p-5 flex items-center justify-between border-b-2 border-black">
                  <div>
                    <span className="text-[10px] font-black uppercase text-red-500 tracking-wider block">{selectedPress.category}</span>
                    <h4 className="font-display font-black text-sm uppercase tracking-wider">{selectedPress.date}</h4>
                  </div>
                  <button 
                    onClick={() => setSelectedPress(null)}
                    className="text-neutral-400 hover:text-white p-1 border-2 border-transparent hover:border-white transition-all"
                    id="close-modal-btn"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content body */}
                <div className="p-6 sm:p-8 space-y-4 text-black">
                  <h3 className="font-display font-black text-xl sm:text-2xl text-black uppercase tracking-tight leading-tight">
                    {selectedPress.title}
                  </h3>

                  <div className="w-16 h-1.5 bg-red-600"></div>

                  {/* Community reference */}
                  <div className="p-3 bg-neutral-50 border-2 border-neutral-200 text-xs font-semibold leading-relaxed flex items-center justify-between gap-3" id="modal-slogan-alert">
                    <span className="text-neutral-700">All local infrastructure updates are verified by our ward councilors on the ground.</span>
                  </div>

                  <div className="text-xs text-neutral-800 leading-relaxed font-semibold whitespace-pre-wrap space-y-4 max-h-[300px] overflow-y-auto pr-2" id="modal-content-text">
                    {selectedPress.content}
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="bg-neutral-50 p-5 border-t-2 border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-[10px] font-black text-neutral-500">NATIONAL ALLIANCE MEDIA BRIEFING</span>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => {
                        setSelectedPress(null);
                        triggerToast("Thank you for sharing this victory!", "success");
                      }}
                      className="flex-1 sm:flex-none px-4 py-2 bg-red-600 text-white font-black uppercase tracking-wider text-xs border-2 border-red-600 hover:bg-black hover:border-black transition-all"
                      id="modal-share-btn"
                    >
                      Share Release
                    </button>
                    <button 
                      onClick={() => setSelectedPress(null)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-white text-black font-black uppercase tracking-wider text-xs border-2 border-black hover:bg-neutral-100 transition-all"
                      id="modal-close-action-btn"
                    >
                      Close
                    </button>
                  </div>
                </div>

              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Section with Required Disclosures */}
      <footer className="bg-black text-white pt-16 pb-8 border-t-8 border-red-600" id="main-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-12 pb-12 border-b-2 border-neutral-800" id="footer-grid">
            
            {/* Brand Block */}
            <div className="md:col-span-5 space-y-5" id="footer-brand-block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 text-white font-black flex items-center justify-center rounded-xs text-xl">
                  <span>NA</span>
                </div>
                <div>
                  <h3 className="font-display font-black text-base uppercase tracking-wider">National Alliance</h3>
                  <span className="text-[9px] text-red-500 font-black uppercase tracking-widest block">Voice of Nelson Mandela Bay</span>
                </div>
              </div>

              <p className="text-xs text-neutral-400 font-semibold leading-relaxed">
                The National Alliance is Gqeberha's home-grown democratic catalyst. We operate exclusively within Nelson Mandela Bay, utilizing the absolute balance of council power to hold big national coalitions accountable.
              </p>


            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 space-y-4" id="footer-links-block">
              <h4 className="text-xs font-black uppercase tracking-wider text-red-500">Quick Navigation</h4>
              <div className="flex flex-col gap-2.5 text-xs font-bold text-neutral-300">
                <a href="#about" className="hover:text-white hover:underline transition-all">Core Pillars</a>
                <a href="#council-balance" className="hover:text-white hover:underline transition-all">Metro Council Simulation</a>
                <a href="#action-hub" className="hover:text-white hover:underline transition-all">Community Action Hub</a>
                <a href="#issue-tracker" className="hover:text-white hover:underline transition-all">Issues Tracker</a>
                <a href="#ward-updates" className="hover:text-white hover:underline transition-all">Local Ward Victories</a>
              </div>
            </div>

            {/* Local Gqeberha Contact Details as explicitly requested */}
            <div className="md:col-span-4 space-y-4" id="footer-contact-block">
              <h4 className="text-xs font-black uppercase tracking-wider text-red-500">Gqeberha Headquarters</h4>
              
              <div className="space-y-3 text-xs font-bold text-neutral-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>
                    Regional Council Chambers Office,<br />
                    Gqeberha, Nelson Mandela Bay, 6001,<br />
                    Eastern Cape, South Africa
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-red-500 shrink-0" />
                  <span>+27 (0) 41 506 1911</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-red-500 shrink-0" />
                  <span>contact@nationalalliance-nmb.org.za</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-red-500 shrink-0" />
                  <span>www.nationalalliance-nmb.org.za</span>
                </div>
              </div>
            </div>

          </div>

          {/* Political Disclosures, Disclaimers & Copyright */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6" id="footer-disclaimer-copyright">
            <div className="space-y-2 text-center md:text-left">
              <p className="text-[10px] text-neutral-500 font-bold leading-normal">
                © {new Date().getFullYear()} National Alliance South Africa. All Rights Reserved.
              </p>
              
              {/* Required political disclosure statement */}
              <p className="text-[9px] text-neutral-600 font-medium max-w-2xl leading-relaxed">
                <strong>Political Party Disclosure:</strong> Registered with the Independent Electoral Commission (IEC) of South Africa. Funded via statutory allocations and community-backed members. No foreign contributions are accepted in accordance with the Political Party Funding Act.
              </p>
            </div>

            {/* Social media placeholder layout / slogan representation */}
            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-4 py-2 text-[10px] font-black uppercase" id="footer-legal-tag">
              <span className="text-neutral-500">IEC Reg No:</span>
              <span className="text-red-500 font-mono">NA-NMB-ZA-2026</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
