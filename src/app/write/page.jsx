"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, useSpring } from "framer-motion";
import LoadingScreen from "../components/LoadingScreen";
import Link from "next/link";

const ResultPage = () => {
  const params = useSearchParams();

  const numberOfDrafts = params.get("numberOfDrafts");
  const numberOfWords = params.get("numberOfWords");
  const contentPillar = params.get("contentPillar");
  const contentAngle = params.get("contentAngle");
  const toneOfVoice = params.get("toneOfVoice");
  const mainMessage = params.get("mainMessage");
  const keywords = params.get("keywords");

  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]); // array of posts
  const [progress, setProgress] = useState(0);

  const [responseStream, setResponseStream] = useState("");

  const scaleX = useSpring(progress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.002,
  });

  useEffect(() => {
    const generatePosts = async () => {
      console.log("Generating...");
      setIsLoading(true);

      let responseText = "";

      try {
        const response = await fetch("/api/openai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            numberOfDrafts: numberOfDrafts,
            numberOfWords: numberOfWords,
            contentPillar: contentPillar,
            contentAngle: contentAngle,
            toneOfVoice: toneOfVoice,
            mainMessage: mainMessage,
            keywords: keywords,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data", response.statusText);
        }

        const data = response.body;
        if (!data) {
          return;
        }

        const reader = data.getReader();
        const decoder = new TextDecoder();

        let done = false;

        while (!done) {
          const { value, done: doneReading } = await reader.read();

          done = doneReading;
          const chunkValue = decoder.decode(value);

          responseText += chunkValue;

          setResponseStream((prev) => prev + chunkValue);
        }
        console.log(responseText);

        let cleanedResponse = responseText.replace(/\n/g, "");
        cleanedResponse = cleanedResponse.replace(/\\n/g, "");
        cleanedResponse = cleanedResponse.replace(/\\"/g, "");

        console.log(cleanedResponse);
        
        let jsonResponse = JSON.parse(cleanedResponse);

        setPosts(jsonResponse);
      } catch (err) {
        console.log("Content Page:", err);
      } finally {
        setIsLoading(false);
        console.log("DONE");
      }
    };
    generatePosts();
  }, []);

  useEffect(() => {
    scaleX.set(progress);
  }, [progress]);

  return (
    <div>
      <motion.div className="progress-bar" style={{ scaleX }} />
      {isLoading ? (
        <>
          <LoadingScreen responseStream={responseStream} />
        </>
      ) : (
        <>
          <div className="pt-12">
            {posts?.map((content, index) => (
              <div className="mb-12" key={index}>
                <div className="post-title">Post {index + 1}</div>
                <div className="post-content">
                  <div className="text-amber-400"><b>{content.heading}</b></div>
                  <br></br>
                  <div>{content.content}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-8">
            <Link
              className="create-button"
              href={{
                pathname: "/",
              }}
            >
              Go Back
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ResultPage;
