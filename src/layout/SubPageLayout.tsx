import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export function SubPageLayout() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background bg-gradient-to-b from-white/[0.07] via-transparent to-black/[0.06]">
      <div
        className="pointer-events-none fixed inset-0 opacity-40 mix-blend-soft-light"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255,255,255,0.25), transparent)",
        }}
      />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main className="mx-auto w-full max-w-7xl flex-1 px-6 pb-16 pt-28 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
