import React from "react";
import { Link } from "react-router-dom";
import { FaMediumM, FaYoutube } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";
import { GooglePlayIcon } from "../../components/atomComponents/googlePlayIcon";

const Dashboard: React.FC = () => {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-container-max mx-auto w-full flex flex-col gap-4 md:gap-6 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">
            Research Overview
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mb-1">
            37,028 public opinions about ChatGPT were collected from Twitter,
            Medium, YouTube, and Play Store — then classified into 3 sentiment
            categories using VADER lexicon-based analysis.
          </p>
          <p className="font-body-md text-body-md text-primary font-medium max-w-2xl">
            ✦ This is a fully interactive platform — you can scrape your own
            data, run preprocessing, and perform sentiment analysis on any
            topic, not just this research.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/data-extraction"
            className="px-4 py-2 bg-surface border border-outline-variant text-on-surface rounded-lg font-body-sm text-body-sm hover:bg-surface-variant transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">
              database_upload
            </span>
            Extract Data
          </Link>
          <Link
            to="/file-based-analysis"
            className="px-4 py-2 bg-primary text-on-primary rounded-lg font-body-sm text-body-sm hover:bg-primary-container transition-colors flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">analytics</span>
            Analysis
          </Link>
        </div>
      </section>

      {/* Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Data */}
        <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-sm flex flex-col gap-2 relative overflow-hidden sm:col-span-2 lg:col-span-2">
          <div className="flex justify-between items-start">
            <span className="text-sm text-slate-500 font-medium">
              Total training samples
            </span>
            <div className="p-2 bg-surface-container-highest rounded-lg text-primary">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                dataset
              </span>
            </div>
          </div>
          <div className="mt-2">
            <span className="font-headline-xl text-headline-xl text-on-surface">
              37,028
            </span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-fixed"></div>
        </div>

        {/* Positive */}
        <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-sm flex flex-col gap-2 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-sm text-slate-500 font-medium">Positive</span>
            <div className="p-2 bg-secondary-container rounded-lg text-on-secondary-container">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                sentiment_satisfied
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-xl text-headline-xl text-on-surface">
              54.3%
            </span>
          </div>
          <div className="w-full bg-surface-variant rounded-full h-1.5 mt-2">
            <div
              className="bg-secondary h-1.5 rounded-full"
              style={{ width: "54.3%" }}
            ></div>
          </div>
        </div>

        {/* Negative */}
        <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-sm flex flex-col gap-2 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-sm text-slate-500 font-medium">Negative</span>
            <div className="p-2 bg-error-container rounded-lg text-on-error-container">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                sentiment_dissatisfied
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-xl text-headline-xl text-on-surface">
              17.9%
            </span>
          </div>
          <div className="w-full bg-surface-variant rounded-full h-1.5 mt-2">
            <div
              className="bg-error h-1.5 rounded-full"
              style={{ width: "17.9%" }}
            ></div>
          </div>
        </div>

        {/* Neutral */}
        <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-sm flex flex-col gap-2 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-sm text-slate-500 font-medium">Neutral</span>
            <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                sentiment_neutral
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-headline-xl text-headline-xl text-on-surface">
              27.8%
            </span>
          </div>
          <div className="w-full bg-surface-variant rounded-full h-1.5 mt-2">
            <div
              className="bg-slate-400 h-1.5 rounded-full"
              style={{ width: "27.8%" }}
            ></div>
          </div>
        </div>
      </section>

      {/* Charts & Data Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sentiment Distribution */}
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant shadow-sm flex flex-col h-[280px] lg:h-[320px]">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-4">
            Sentiment Breakdown (VADER)
          </h3>
          <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6">
            <div
              className="relative w-36 h-36 lg:w-40 lg:h-40 rounded-full border-8 border-surface"
              style={{
                background:
                  "conic-gradient(#2b6954 0% 54.3%, #ba1a1a 54.3% 72.2%, #94a3b8 72.2% 100%)",
                boxShadow: "inset 0 0 0 16px #ffffff",
              }}
            >
              <div className="absolute inset-0 m-auto w-20 h-20 lg:w-24 lg:h-24 bg-white rounded-full flex flex-col items-center justify-center">
                <span className="font-headline-md text-headline-md text-on-surface">
                  37k+
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Analyzed
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4 w-full md:w-auto">
              <div className="flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary"></div>
                  <span className="font-body-sm text-body-sm text-on-surface">
                    Positive
                  </span>
                </div>
                <span className="font-body-md text-body-md font-bold text-on-surface">
                  54.3%
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-error"></div>
                  <span className="font-body-sm text-body-sm text-on-surface">
                    Negative
                  </span>
                </div>
                <span className="font-body-md text-body-md font-bold text-on-surface">
                  17.9%
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                  <span className="font-body-sm text-body-sm text-on-surface">
                    Neutral
                  </span>
                </div>
                <span className="font-body-md text-body-md font-bold text-on-surface">
                  27.8%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant shadow-sm flex flex-col h-[280px] lg:h-[320px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-headline-md text-headline-md text-on-surface">
              Data Sources
            </h3>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-3">
            <div className="flex flex-col gap-2 group">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center text-on-surface">
                    <RiTwitterXLine className="text-[18px]" />
                  </div>
                  <span className="font-body-md text-body-md text-on-surface font-medium">
                    X (Twitter)
                  </span>
                </div>
                <span className="font-body-sm text-body-sm font-bold text-on-surface-variant">
                  12,451
                </span>
              </div>
              <div className="w-full bg-surface-variant rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full group-hover:bg-primary-container transition-colors"
                  style={{ width: "34%" }}
                ></div>
              </div>
            </div>

            <div className="flex flex-col gap-2 group">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-error-container text-error flex items-center justify-center">
                    <FaYoutube className="text-[20px]" />
                  </div>
                  <span className="font-body-md text-body-md text-on-surface font-medium">
                    YouTube
                  </span>
                </div>
                <span className="font-body-sm text-body-sm font-bold text-on-surface-variant">
                  9,177
                </span>
              </div>
              <div className="w-full bg-surface-variant rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full group-hover:bg-primary-container transition-colors"
                  style={{ width: "25%" }}
                ></div>
              </div>
            </div>

            <div className="flex flex-col gap-2 group">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-surface-container-low flex items-center justify-center">
                    <GooglePlayIcon width={20} height={20} />
                  </div>
                  <span className="font-body-md text-body-md text-on-surface font-medium">
                    Play Store
                  </span>
                </div>
                <span className="font-body-sm text-body-sm font-bold text-on-surface-variant">
                  15,000
                </span>
              </div>
              <div className="w-full bg-surface-variant rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full group-hover:bg-primary-container transition-colors"
                  style={{ width: "40%" }}
                ></div>
              </div>
            </div>

            <div className="flex flex-col gap-2 group">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-slate-800 text-white flex items-center justify-center">
                    <FaMediumM className="text-[18px]" />
                  </div>
                  <span className="font-body-md text-body-md text-on-surface font-medium">
                    Medium
                  </span>
                </div>
                <span className="font-body-sm text-body-sm font-bold text-on-surface-variant">
                  400
                </span>
              </div>
              <div className="w-full bg-surface-variant rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full group-hover:bg-primary-container transition-colors"
                  style={{ width: "1%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
