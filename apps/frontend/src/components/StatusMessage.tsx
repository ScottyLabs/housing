export default function StatusMessage({
  message,
  error = false,
  className = "",
}: {
  message?: string;
  error?: boolean;
  className?: string;
}) {
  return (
    <output
      className={`block min-h-5 text-[14px] font-medium ${error ? "text-red-700" : "text-gray-600"} ${className}`}
    >
      {message}
    </output>
  );
}
