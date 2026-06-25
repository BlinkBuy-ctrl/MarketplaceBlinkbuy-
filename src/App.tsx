import { lazy, Suspense, useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import Layout from "@/components/Layout";
import SplashScreen from "@/components/SplashScreen";

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
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-700 flex items-center justify-center animate-pulse shadow-lg shadow-pink-500/30">
          <span className="text-white font-black text-lg">M</span>
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
