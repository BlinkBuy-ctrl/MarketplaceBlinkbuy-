import { Switch, Route } from "wouter";
import Layout from "@/components/Layout";
import HomePage from "@/pages/home";
import MarketplacePage from "@/pages/marketplace";
import MarketplaceDetailPage from "@/pages/marketplace-detail";
import PostItemPage from "@/pages/post-item";
import NotFound from "@/pages/not-found";

export default function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/marketplace" component={MarketplacePage} />
        <Route path="/marketplace/:id" component={MarketplaceDetailPage} />
        <Route path="/post-item" component={PostItemPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}
