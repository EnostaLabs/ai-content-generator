"use client";

import { useState } from "react";
import { angles } from "./constants/angles";
import { toneofvoices } from "./constants/toneofvoices";

import Link from "next/link";

const HomePage = () => {
  const [numberOfDrafts, setNumberOfDrafts] = useState(1);
  const [numberOfWords, setNumberOfWords] = useState(100);
  const [contentPillar, setContentPillar] = useState("community");
  const [contentAngle, setContentAngle] = useState("events and activities");
  const [toneOfVoice, setToneOfVoice] = useState("friendly");
  const [mainMessage, setMainMessage] = useState("");
  const [keywords, setKeyWords] = useState("");

  const handleNoDraftsChange = (e) => {
    setNumberOfDrafts(e.target.value);
  };

  const handleNoWordsChange = (e) => {
    setNumberOfWords(e.target.value);
  };

  const handlePillarSelect = (e) => {
    setContentPillar(e.target.value);
    setContentAngle(angles[e.target.value][0]);
  };

  const handleAngleSelect = (e) => {
    setContentAngle(e.target.value);
    console.log(e.target.value);
  };

  const handleToneOfVoiceSelect = (e) => {
    setToneOfVoice(e.target.value);
  };

  const handleTextChange = (e) => {
    setMainMessage(e.target.value);
  };

  const handleKeyWordsChange = (e) => {
    setKeyWords(e.target.value);
    console.log(mainMessage);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(
      numberOfDrafts,
      numberOfWords,
      contentPillar,
      contentAngle,
      toneOfVoice,
      mainMessage
    );
  };

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="border rounded border-white/0 ">
        <h1 className="text-center text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-500 via-pink-400 to-blue-500 bg-clip-text text-transparent title-animate-gradient">
          AI Content Generator
        </h1>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="mt-14 flex flex-col gap-4 w-[80%] mx-auto"
        >
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            {/* CONTENT PILLAR */}
            <div className="flex flex-col">
              <label htmlFor="contentPillar" className="label">
                Content Pillar
              </label>
              <select
                value={contentPillar}
                onChange={handlePillarSelect}
                name="contentPillar"
                className="option-select"
              >
                <option value="community">Community</option>
                <option value="education">Education</option>
                <option value="engagement">Engagement</option>
                <option value="promotion">Promotion</option>
              </select>
            </div>

            {/* CONTENT ANGLE */}
            <div className="flex flex-col">
              <label htmlFor="contentAngle" className="label">
                Content Angle
              </label>
              <select
                id="contentAngle"
                value={contentAngle}
                onChange={handleAngleSelect}
                name="contentAngle"
                className="option-select"
              >
                {angles[contentPillar].map((option, index) => (
                  <option value={option} key={index} className="capitalize">
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* TONE OF VOICE */}
            <div className="flex flex-col">
              <label htmlFor="toneOfVoice" className="label">
                Tone Of Voice
              </label>
              <select
                value={toneOfVoice}
                onChange={handleToneOfVoiceSelect}
                name="toneOfVoice"
                className="option-select"
              >
                {toneofvoices.map((option, index) => (
                  <option value={option} key={index} className="capitalize">
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* NUMBER OF DRAFTS AND WORDS*/}
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div className="flex flex-col">
                <label htmlFor="noDrafts" className="label">
                  Number Of Drafts
                </label>
                <input
                  type="number"
                  id="noDrafts"
                  name="noDrafts"
                  value={numberOfDrafts}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder=""
                  onChange={handleNoDraftsChange}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="noWords" className="label">
                  Number Of Words
                </label>
                <input
                  type="number"
                  id="noWords"
                  name="noWords"
                  value={numberOfWords}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder=""
                  onChange={handleNoWordsChange}
                  required
                />
              </div>
            </div>

            {/* TEXT FIELD FOR MAIN MESSAGE */}
            <div className="flex flex-col col-span-2">
              <textarea
                id="message"
                value={mainMessage}
                rows="4"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Describe your main message here..."
                onChange={handleTextChange}
              ></textarea>
            </div>

            {/* TEXT FIELD FOR KEYWORDS */}
            <div className="flex flex-col col-span-2">
              <textarea
                id="keywords"
                value={keywords}
                rows="1"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="(Optional) If you have any keywords, list them here..."
                onChange={handleKeyWordsChange}
              ></textarea>
            </div>
          </div>

          <div className="mx-auto mt-8">
            <Link
              className="create-button"
              href={{
                pathname: "/write",
                query: {
                  numberOfDrafts: numberOfDrafts,
                  numberOfWords: numberOfWords,
                  contentPillar: contentPillar.toLowerCase(),
                  contentAngle: contentAngle.toLowerCase(),
                  toneOfVoice: toneOfVoice.toLowerCase(),
                  mainMessage: mainMessage,
                  keywords: keywords
                },
              }}
            >
              Generate Content
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HomePage;
