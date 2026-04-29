import React from "react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
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
        <section className="bg-surface-container-lowest pt-lg pb-xl relative overflow-hidden">
          <div className="max-w-container-max mx-auto px-gutter grid md:grid-cols-2 gap-lg items-center relative z-10">
            {/* Text Content */}
            <div className="flex flex-col items-start gap-md">
              <div className="inline-flex items-center gap-xs px-sm py-xs bg-secondary-container rounded-full text-on-secondary-container font-label-bold text-label-bold">
                <span className="material-symbols-outlined text-[16px]">
                  smart_toy
                </span>
                AI-Powered
              </div>
              <h1 className="font-headline-xl text-headline-xl text-on-surface">
                Analyze Public Sentiment from Social Media — Powered by AI
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
                An end-to-end platform that collects public opinions from
                YouTube, Play Store, and Twitter — then automatically analyzes
                whether the sentiment is positive, negative, or neutral. No
                coding required.
              </p>
              <div className="flex flex-wrap items-center gap-sm mt-sm">
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
                  View Demo
                </button>
              </div>
            </div>

            {/* Visual Anchor: 3D Browser Dashboard Mockup */}
            <div
              className="relative w-full flex justify-center items-center"
              style={{ perspective: "2000px" }}
            >
              {/* Tilted Mac Browser Container */}
              <div
                className="w-full rounded-xl shadow-[-20px_20px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden font-sans bg-white transition-transform duration-700 hover:scale-105"
                style={{
                  transform:
                    "rotateY(-15deg) rotateX(5deg) rotateZ(2deg) scale(0.95)",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Browser Header */}
                <div className="bg-slate-100 px-4 py-3 flex items-center gap-4 border-b border-slate-200">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400 shadow-sm"></div>
                  </div>
                  <div className="bg-white rounded-md px-4 py-1.5 text-xs text-slate-500 flex-1 mx-4 flex items-center gap-2 border border-slate-200 shadow-sm">
                    <span className="material-symbols-outlined text-[14px] text-emerald-600">
                      smart_toy
                    </span>
                    <span>ChatGPT Analysis - SentimenAI</span>
                  </div>
                </div>

                {/* Dashboard Screenshot Placeholder */}
                <div className="w-full bg-[#f8fafc] relative flex">
                  <img
                    src="/dashboard-screenshoot.png"
                    alt="Dashboard"
                    className="w-full h-auto object-contain block"
                  />
                </div>
              </div>
            </div>

            {/* Subtle background accent */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-surface-container to-transparent opacity-50 z-0 pointer-events-none"></div>
          </div>
        </section>
        {/* Video Demo Section */}
        <section
          id="demo-section"
          className="bg-surface py-xl border-t border-surface-variant"
        >
          <div className="max-w-container-max mx-auto px-gutter text-center flex flex-col items-center">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
              See SentimenAI in Action
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg max-w-2xl">
              Watch how the platform scrapes real data, processes it through
              multiple stages, and delivers clear sentiment results — all in a
              few clicks.
            </p>
            <div className="relative w-full max-w-4xl aspect-video bg-surface-container-low rounded-xl border border-surface-variant overflow-hidden shadow-[0_20px_40px_rgba(18,28,42,0.05)] group cursor-pointer">
              <img
                alt="Platform Demo Video"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-Rx9aeSjcHEyvZJ48T6O51igM-Pomz5BJrjwZK_i7y2kmLXNlTgWja3NwNTvMa5ot21rQj8tWS6cIM6eHkYU645476ojaHgv3wR_94lHM5HWR4IW8E4D3U0x9DQvsSlGa0WG0rPmL-AlSlb7CaaJrSp501J8IgK3qqf2375585bR0-l2N6ZpGKZxRGeaecW2emGdeEPWGoTe_LVNpKq2l-BtK7MsrbsZsuzUyYCDA6DXhLM7bPosTH0dO8mwnvZDA46lIIoKOcjb8"
              />
              <div className="absolute inset-0 bg-on-surface/10 group-hover:bg-transparent transition-colors duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-primary/90 text-on-primary rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 group-hover:bg-primary transition-all duration-300 shadow-[0_8px_16px_rgba(0,108,73,0.25)]">
                  <span className="material-symbols-outlined text-[36px] ml-1">
                    play_arrow
                  </span>
                </div>
              </div>
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
