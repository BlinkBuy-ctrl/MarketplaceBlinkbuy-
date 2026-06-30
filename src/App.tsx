import { lazy, Suspense, useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import Layout from "@/components/Layout";
import SplashScreen from "@/components/SplashScreen";

// ── PWA install-prompt capture ──
// The browser fires "beforeinstallprompt" once, early, and only if we call
// preventDefault() do we get to keep the event around to trigger later from
// our own "Install" button (Layout banner / Settings page).
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferredInstallPrompt: BeforeInstallPromptEvent | null = null;

export function getInstallPrompt(): BeforeInstallPromptEvent | null {
  return deferredInstallPrompt;
}

export function clearInstallPrompt(): void {
  deferredInstallPrompt = null;
}

const HomePage          = lazy(() => import("@/pages/home"));
const MarketplacePage   = lazy(() => import("@/pages/marketplace"));
const MarketplaceDetail = lazy(() => import("@/pages/marketplace-detail"));
const PostItemPage      = lazy(() => import("@/pages/post-item"));
const SettingsPage      = lazy(() => import("@/pages/settings"));
const NotFound          = lazy(() => import("@/pages/not-found"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        {/* App icon replaces the old "M" letter */}
        <div className="w-12 h-12 rounded-xl animate-pulse shadow-lg shadow-pink-500/30 overflow-hidden">
          <img
            src="/icon.svg"
            alt="Marketplace Malawi"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex gap-1.5">
          <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      deferredInstallPrompt = e as BeforeInstallPromptEvent;
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  return (
    <>
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      <div style={{ opacity: splashDone ? 1 : 0, transition: "opacity 0.4s ease" }}>
        <WouterRouter base="">
          <Layout>
            <Suspense fallback={<PageLoader />}>
              <Switch>
                <Route path="/"                   component={HomePage} />
                <Route path="/marketplace"        component={MarketplacePage} />
                <Route path="/marketplace/:id"    component={MarketplaceDetail} />
                <Route path="/post-item"          component={PostItemPage} />
                <Route path="/settings"           component={SettingsPage} />
                <Route                            component={NotFound} />
              </Switch>
            </Suspense>
          </Layout>
        </WouterRouter>
      </div>
    </>
  );
}
