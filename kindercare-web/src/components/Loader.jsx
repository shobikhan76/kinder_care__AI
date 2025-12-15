export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[200px]">
      {/* Animated KinderCare "K" */}
      <div className="relative mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <span className="text-white font-bold text-xl">K</span>
        </div>
        {/* Subtle rotating ring for extra polish (optional) */}
        <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-blue-300 animate-spin opacity-40"></div>
      </div>

      {/* Loading text */}
      <p className="text-gray-600 text-sm font-medium">{text}</p>
    </div>
  );
}