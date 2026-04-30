import React, { useState } from "react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const showcaseTabs = [
    {
      id: "extraction",
      label: "Data Extraction",
      icon: "database",
      color: "emerald",
      description:
        "Scrape public opinions from YouTube, Play Store, and Twitter — directly from the browser. Set your keyword, hit extract, and watch the data flow in.",
      screenshot: "/screenshots/extraction.png",
    },
    {
      id: "preprocessing",
      label: "Preprocessing",
      icon: "cleaning_services",
      color: "emerald",
      description:
        "Clean and prepare your data through 4 automated steps: HTML cleansing, normalization, sentiment labeling, and data balancing.",
      screenshot: "/screenshots/preprocessing.png",
    },
    {
      id: "analysis",
      label: "Analysis",
      icon: "analytics",
      color: "blue",
      description:
        "Analyze sentiment instantly — type a single text or upload an entire dataset. Get clear results: Positive, Negative, or Neutral.",
      screenshot: "/screenshots/analysis.png",
    },
    {
      id: "model-builder",
      label: "Model Builder",
      icon: "architecture",
      color: "purple",
      description:
        "Explore how a RoBERTa model is fine-tuned for sentiment analysis — an interactive simulation of the full training pipeline.",
      screenshot: "/screenshots/model-builder.png",
    },
  ];

  return (
    <div className="w-full bg-background text-on-background font-body-md text-body-md antialiased overflow-x-hidden selection:bg-secondary-container selection:text-on-secondary-container">
      {/* TopAppBar */}
      <nav className="bg-white/90 backdrop-blur-md dark:bg-slate-900/90 fixed top-0 w-full z-50 border-b border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center h-16 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
            SentimenAI
          </div>

          <Link to="/dashboard">
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-manrope text-sm font-medium tracking-tight hover:bg-emerald-700 active:scale-95 duration-200 transition-all">
              Start Analysis
            </button>
          </Link>
        </div>
      </nav>

      <main className="pt-20">
        {" "}
        {/* Offset for fixed header */}
        {/* Hero Section */}
        <section className="bg-surface-container-lowest pt-xl pb-xl relative overflow-hidden">
          <div className="max-w-3xl mx-auto px-gutter text-center flex flex-col items-center relative z-10">
            <div className="inline-flex items-center gap-xs px-sm py-xs bg-secondary-container rounded-full text-on-secondary-container font-label-bold text-label-bold mb-md">
              <span className="material-symbols-outlined text-[16px]">
                smart_toy
              </span>
              AI-Powered Sentiment Analysis
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-md">
              Analyze Public Sentiment from Social Media — Powered by AI
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-lg">
              An end-to-end platform that collects public opinions from YouTube,
              Play Store, and Twitter — then automatically analyzes whether the
              sentiment is positive, negative, or neutral. No coding required.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-sm">
              <Link to="/dashboard">
                <button className="bg-primary text-on-primary font-label-bold text-label-bold px-md py-sm rounded-lg flex items-center gap-xs hover:shadow-[0_8px_16px_rgba(0,108,73,0.15)] transition-all">
                  Start Analysis
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </button>
              </Link>
              <button
                onClick={() =>
                  document
                    .getElementById("demo-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-transparent border border-outline-variant text-primary font-label-bold text-label-bold px-md py-sm rounded-lg flex items-center gap-xs hover:bg-surface-container-low transition-colors"
              >
                Explore Features
              </button>
            </div>
          </div>

          {/* Subtle background accents */}
          <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-surface-container to-transparent opacity-30 z-0 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-surface-container to-transparent opacity-30 z-0 pointer-events-none"></div>
        </section>
        <section
          id="demo-section"
          className="bg-surface border-t border-surface-variant flex flex-col justify-center"
          style={{ minHeight: "calc(100vh - 4rem)" }}
        >
          <div className="max-w-container-max mx-auto px-gutter py-8 flex flex-col h-full">
            {/* Header — compact */}
            <div className="text-center mb-4">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">
                See SentimenAI in Action
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto">
                Explore each step of the platform — from collecting data to
                getting AI-powered sentiment insights.
              </p>
            </div>

            {/* Tab Buttons — compact */}
            <div className="flex flex-wrap justify-center gap-1.5 mb-4">
              {showcaseTabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(index)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeTab === index
                      ? tab.color === "blue"
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : tab.color === "purple"
                          ? "bg-[#630ed4] text-white shadow-lg shadow-purple-600/20"
                          : "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Showcase Content with Arrows */}
            <div className="max-w-5xl mx-auto w-full flex items-center gap-3 flex-1 min-h-0">
              {/* Left Arrow */}
              <button
                onClick={() =>
                  setActiveTab((prev) =>
                    prev === 0 ? showcaseTabs.length - 1 : prev - 1,
                  )
                }
                className="hidden md:flex w-10 h-10 rounded-full border border-slate-200 bg-white shadow-sm items-center justify-center text-slate-500 hover:text-emerald-600 hover:border-emerald-300 hover:shadow-md transition-all flex-shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">
                  chevron_left
                </span>
              </button>

              {/* Browser Mockup */}
              <div className="flex-1 min-w-0">
                <div className="bg-white rounded-xl border border-slate-200 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.08)] overflow-hidden">
                  {/* Browser Header */}
                  <div className="bg-slate-50 px-4 py-2 flex items-center gap-3 border-b border-slate-200">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                    </div>
                    <div className="bg-white rounded-md px-3 py-1 text-xs text-slate-400 flex-1 mx-2 border border-slate-200 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[12px] text-emerald-600">
                        lock
                      </span>
                      sentimen-ai.vercel.app/{showcaseTabs[activeTab].id}
                    </div>
                  </div>

                  {/* Screenshot Area — FIXED height so arrows never shift */}
                  <div className="relative bg-slate-50">
                    <img
                      src={showcaseTabs[activeTab].screenshot}
                      alt={showcaseTabs[activeTab].label}
                      className="w-full h-auto block"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (
                          parent &&
                          !parent.querySelector(".placeholder-msg")
                        ) {
                          const placeholder = document.createElement("div");
                          placeholder.className =
                            "placeholder-msg flex flex-col items-center justify-center py-24 text-slate-400 gap-2";
                          placeholder.innerHTML = `
                            <span class="material-symbols-outlined text-[40px]">add_photo_alternate</span>
                            <p class="font-medium text-sm">Screenshot: ${showcaseTabs[activeTab].label}</p>
                            <p class="text-xs">Tambahkan ke /public/screenshots/</p>
                          `;
                          parent.appendChild(placeholder);
                        }
                      }}
                    />
                  </div>

                  {/* Description Bar — compact */}
                  <div
                    className={`px-5 py-3 border-t border-slate-100 flex items-center gap-3 ${
                      showcaseTabs[activeTab].color === "blue"
                        ? "bg-blue-50/50"
                        : showcaseTabs[activeTab].color === "purple"
                          ? "bg-purple-50/50"
                          : "bg-emerald-50/50"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        showcaseTabs[activeTab].color === "blue"
                          ? "bg-blue-100 text-blue-600"
                          : showcaseTabs[activeTab].color === "purple"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-emerald-100 text-emerald-600"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showcaseTabs[activeTab].icon}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-on-surface text-sm">
                        {showcaseTabs[activeTab].label}
                      </h3>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {showcaseTabs[activeTab].description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Arrow */}
              <button
                onClick={() =>
                  setActiveTab((prev) =>
                    prev === showcaseTabs.length - 1 ? 0 : prev + 1,
                  )
                }
                className="hidden md:flex w-10 h-10 rounded-full border border-slate-200 bg-white shadow-sm items-center justify-center text-slate-500 hover:text-emerald-600 hover:border-emerald-300 hover:shadow-md transition-all flex-shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">
                  chevron_right
                </span>
              </button>
            </div>

            {/* Step Indicator Dots + Mobile Arrows */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() =>
                  setActiveTab((prev) =>
                    prev === 0 ? showcaseTabs.length - 1 : prev - 1,
                  )
                }
                className="md:hidden w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400"
              >
                <span className="material-symbols-outlined text-[18px]">
                  chevron_left
                </span>
              </button>
              {showcaseTabs.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`rounded-full transition-all duration-300 ${
                    activeTab === index
                      ? "w-7 h-2 bg-emerald-600"
                      : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
              <button
                onClick={() =>
                  setActiveTab((prev) =>
                    prev === showcaseTabs.length - 1 ? 0 : prev + 1,
                  )
                }
                className="md:hidden w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400"
              >
                <span className="material-symbols-outlined text-[18px]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section className="bg-surface-container-lowest py-xl border-y border-surface-variant">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="text-center mb-lg">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
                What This Platform Does
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Everything you need to go from raw social media data to
                actionable sentiment insights.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-md">
              {/* Feature 1 */}
              <div className="bg-surface-container-lowest p-md rounded-lg border border-surface-variant hover:shadow-[0_8px_24px_rgba(0,108,73,0.08)] transition-all flex flex-col gap-sm">
                <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center text-primary mb-xs">
                  <span className="material-symbols-outlined text-[24px]">
                    database
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  Data Extraction
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Collect reviews, tweets, and comments directly from Twitter,
                  YouTube, and Google Play Store with just a few clicks. Export
                  as CSV or Excel.
                </p>
              </div>
              {/* Feature 2 */}
              <div className="bg-surface-container-lowest p-md rounded-lg border border-surface-variant hover:shadow-[0_8px_24px_rgba(0,108,73,0.08)] transition-all flex flex-col gap-sm">
                <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center text-primary mb-xs">
                  <span className="material-symbols-outlined text-[24px]">
                    analytics
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  Sentiment Analysis
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Automatically clean, normalize, and classify text sentiment
                  using AI — analyze single texts or batch-process entire
                  datasets in seconds.
                </p>
              </div>
              {/* Feature 3 */}
              <div className="bg-surface-container-lowest p-md rounded-lg border border-surface-variant hover:shadow-[0_8px_24px_rgba(0,108,73,0.08)] transition-all flex flex-col gap-sm">
                <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center text-primary mb-xs">
                  <span className="material-symbols-outlined text-[24px]">
                    tune
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  Model Builder
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Explore how a RoBERTa model is fine-tuned for sentiment
                  analysis — an interactive simulation of the full training
                  pipeline, from parameters to evaluation.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Workflow Section */}
        <section className="bg-surface-bright py-xl">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="text-center mb-xl">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
                How It Works
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                From raw social media posts to clear sentiment reports in three
                steps.
              </p>
            </div>
            <div className="relative">
              {/* Connecting Line (Desktop Only) */}
              <div className="hidden md:block absolute top-6 left-[16.6%] right-[16.6%] border-t-2 border-dashed border-primary/30 z-0"></div>
              <div className="grid md:grid-cols-3 gap-lg relative z-10">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center gap-sm">
                  <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-md text-headline-md border-4 border-surface-bright shadow-sm">
                    1
                  </div>
                  <h4 className="font-headline-md text-headline-md text-on-surface mt-sm">
                    Extract
                  </h4>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-xs">
                    Scrape public data from Twitter, YouTube, or Play Store — or
                    upload your own CSV/Excel file.
                  </p>
                </div>
                {/* Step 2 */}
                <div className="flex flex-col items-center text-center gap-sm">
                  <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-md text-headline-md border-4 border-surface-bright shadow-sm">
                    2
                  </div>
                  <h4 className="font-headline-md text-headline-md text-on-surface mt-sm">
                    Process
                  </h4>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-xs">
                    The platform automatically removes HTML, normalizes text,
                    labels sentiment, and balances your dataset for fair
                    analysis.
                  </p>
                </div>
                {/* Step 3 */}
                <div className="flex flex-col items-center text-center gap-sm">
                  <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-md text-headline-md border-4 border-surface-bright shadow-sm">
                    3
                  </div>
                  <h4 className="font-headline-md text-headline-md text-on-surface mt-sm">
                    Analyze
                  </h4>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-xs">
                    Get clear sentiment results: positive, negative, or neutral
                    — for single texts or entire datasets at once.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Final CTA Section */}
        <section className="bg-white py-xl border-t border-surface-variant">
          <div className="max-w-3xl mx-auto px-gutter text-center flex flex-col items-center gap-md">
            <h2 className="font-headline-xl text-headline-xl text-on-surface">
              Ready to get started?
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-sm">
              Extract social media data, preprocess it, and get AI-powered
              sentiment insights — all in under a minute.
            </p>
            <Link to="/dashboard">
              <button className="bg-primary text-on-primary font-label-bold text-label-bold px-md py-sm rounded-lg flex items-center gap-xs hover:shadow-[0_8px_16px_rgba(0,108,73,0.15)] transition-all">
                Start Analysis Now
              </button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#EDF2F0] dark:bg-slate-950 w-full py-12 border-t border-slate-200 dark:border-slate-800 flat">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
            SentimenAI
          </div>
          <div className="font-manrope text-xs md:text-sm text-slate-500 dark:text-slate-400">
            © 2025 SentimenAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
