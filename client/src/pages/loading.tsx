export const Loading = () => {
  return (
    <div className="h-screen flex gap-2 justify-center items-center">
      <div className="dot bg-[#fab2ff] animation-delay-0"></div>
      <div className="dot bg-purple-500 animation-delay-200"></div>
      <div className="dot bg-[#1904e5] animation-delay-400"></div>
    </div>
  );
};
