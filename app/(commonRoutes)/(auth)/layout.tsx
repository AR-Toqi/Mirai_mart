export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-neutral-bg px-4 py-12">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
