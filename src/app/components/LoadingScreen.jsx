import { Bars } from "react-loader-spinner";

const LoadingScreen = ({ responseStream }) => {
  return (
    <>
      <div className=" text-white/10 text-xs text-justify">
        <div className="fixed">{responseStream}</div>
        <div className="fixed bottom-0 rotate-180 left-0">{responseStream}</div>
        <div className="fixed bottom-0 right-0 reverse-text">
          {responseStream}
        </div>
        <div className="fixed bottom-0 left-0 reverse-text rotate-180">
          {responseStream}
        </div>
      </div>
      <div className="min-h-screen grid place-items-center">
        <div className="w-[80%] flex flex-col items-center">
          <div className="flex items-center gap-4">
            <Bars width="60" height="60" color="#6ee7b7" />
            <div className="text-emerald-300 uppercase text-4xl font-bold text-center translate-y-2">
              <p className=" animate-pulse">Generating Content...</p>
              <p className="text-xs text text-emerald-300/40">
                (can take around 20-30 seconds)
              </p>
            </div>
            <Bars width="60" height="60" color="#6ee7b7" />
          </div>
        </div>
      </div>
    </>
  );
};
export default LoadingScreen;
