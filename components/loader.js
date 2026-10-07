export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">

      {/* Animated Gradient Ring */}
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 border-r-purple-600 animate-spin"></div>

        <div className="absolute inset-2 rounded-full bg-white dark:bg-gray-900"></div>
      </div>

      {/* Animated Text */}
      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 animate-pulse tracking-wide">
        {text}
      </p>

    </div>
  );
}