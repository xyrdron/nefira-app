export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col h-screen">
      <main className=" px-0 lg:px-0 mx-auto flex flex-col items-start h-full overflow-visible">
        {children}
      </main>
    </div>
  );
}
