export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-1 bg-blue-500 text-white rounded">
      {children}
    </span>
  );
}