import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const [isAnalyzeOpen, setIsAnalyzeOpen] = useState(
    location.pathname.includes("-analysis"),
  );
  const [isPreprocessOpen, setIsPreprocessOpen] = useState(
    [
      "/html-element-cleansing",
      "/normalize-text",
      "/vader-labeling",
      "/data-balancing",
    ].includes(location.pathname),
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("dashboard")) return "Dashboard";
    if (path.includes("data-extraction")) return "Data Extraction";
    if (path.includes("html-element-cleansing"))
      return "HTML Element Cleansing";
    if (path.includes("normalize-text")) return "Normalize Text";
    if (path.includes("vader-labeling")) return "Vader Labeling";
    if (path.includes("data-balancing")) return "Data Balancing";
    if (path.includes("single-text-analysis")) return "Single Text Analysis";
    if (path.includes("file-based-analysis")) return "File Based Analysis";
    if (path.includes("roberta-builder")) return "Model Builder";
    return "SentimenAI";
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="bg-background text-on-background font-body-md text-body-md antialiased flex min-h-screen w-full">
      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* SideNavBar */}
      <nav
        className={`bg-white dark:bg-slate-900 h-screen w-64 border-r fixed left-0 top-0 border-slate-200 dark:border-slate-800 flex flex-col py-6 px-4 z-50 overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-8 px-4 flex items-center justify-between">
          <div>
            <Link to="/">
              <h1 className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                SentimenAI
              </h1>
            </Link>
            <p className="font-label-bold text-label-bold text-on-surface-variant mt-xs uppercase tracking-widest text-[10px]">
              INSIGHT SYNTHESIS
            </p>
          </div>
          {/* Hamburger close button — only visible on mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 text-slate-500 hover:text-emerald-500 transition-colors rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <ul className="space-y-2 flex-1 font-manrope text-sm antialiased pb-10">
          <li>
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive("/dashboard")
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 font-semibold border-r-4 border-emerald-600"
                  : "text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{
                  fontVariationSettings: isActive("/dashboard")
                    ? "'FILL' 1"
                    : "'FILL' 0",
                }}
              >
                dashboard
              </span>
              Dashboard
            </Link>
          </li>

          <li>
            <Link
              to="/data-extraction"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive("/data-extraction")
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 font-semibold border-r-4 border-emerald-600"
                  : "text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{
                  fontVariationSettings: isActive("/data-extraction")
                    ? "'FILL' 1"
                    : "'FILL' 0",
                }}
              >
                database
              </span>
              Extraction
            </Link>
          </li>

          {/* Text Preprocessing Dropdown */}
          <li>
            <div
              onClick={() => setIsPreprocessOpen(!isPreprocessOpen)}
              className="flex items-center justify-between px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">
                  cleaning_services
                </span>
                Text Preprocessing
              </div>
              <span
                className={`material-symbols-outlined text-[16px] transition-transform ${isPreprocessOpen ? "rotate-180" : ""}`}
              >
                expand_more
              </span>
            </div>
            {isPreprocessOpen && (
              <ul className="pl-12 pr-4 mt-1 space-y-1">
                <li>
                  <Link
                    to="/html-element-cleansing"
                    className={`block py-2 text-sm ${isActive("/html-element-cleansing") ? "text-emerald-600 font-semibold" : "text-slate-500 hover:text-emerald-600"}`}
                  >
                    HTML Cleansing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/normalize-text"
                    className={`block py-2 text-sm ${isActive("/normalize-text") ? "text-emerald-600 font-semibold" : "text-slate-500 hover:text-emerald-600"}`}
                  >
                    Normalize Text
                  </Link>
                </li>
                <li>
                  <Link
                    to="/vader-labeling"
                    className={`block py-2 text-sm ${isActive("/vader-labeling") ? "text-emerald-600 font-semibold" : "text-slate-500 hover:text-emerald-600"}`}
                  >
                    Vader Labeling
                  </Link>
                </li>
                <li>
                  <Link
                    to="/data-balancing"
                    className={`block py-2 text-sm ${isActive("/data-balancing") ? "text-emerald-600 font-semibold" : "text-slate-500 hover:text-emerald-600"}`}
                  >
                    Data Balancing
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Analyze Dropdown */}
          <li>
            <div
              onClick={() => setIsAnalyzeOpen(!isAnalyzeOpen)}
              className="flex items-center justify-between px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">
                  analytics
                </span>
                Analyze
              </div>
              <span
                className={`material-symbols-outlined text-[16px] transition-transform ${isAnalyzeOpen ? "rotate-180" : ""}`}
              >
                expand_more
              </span>
            </div>
            {isAnalyzeOpen && (
              <ul className="pl-12 pr-4 mt-1 space-y-1">
                <li>
                  <Link
                    to="/single-text-analysis"
                    className={`block py-2 text-sm ${isActive("/single-text-analysis") ? "text-emerald-600 font-semibold" : "text-slate-500 hover:text-emerald-600"}`}
                  >
                    Single Text
                  </Link>
                </li>
                <li>
                  <Link
                    to="/file-based-analysis"
                    className={`block py-2 text-sm ${isActive("/file-based-analysis") ? "text-emerald-600 font-semibold" : "text-slate-500 hover:text-emerald-600"}`}
                  >
                    File Based
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link
              to="/roberta-builder-simulator"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive("/roberta-builder-simulator")
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 font-semibold border-r-4 border-emerald-600"
                  : "text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{
                  fontVariationSettings: isActive("/roberta-builder-simulator")
                    ? "'FILL' 1"
                    : "'FILL' 0",
                }}
              >
                architecture
              </span>
              Model builder
            </Link>
          </li>

          <li>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200">
              <span className="material-symbols-outlined text-[20px]">
                account_circle
              </span>
              Profil
            </button>
          </li>
        </ul>
      </nav>

      {/* Mobile: Floating hamburger button to open sidebar */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md text-slate-500 hover:text-emerald-500 transition-colors"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Main Content Area — no top navbar, full height */}
      <div className="flex-1 lg:ml-64 flex flex-col h-screen overflow-y-auto w-full relative transition-all duration-300">
        {/* Dynamic Canvas via Outlet */}
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
