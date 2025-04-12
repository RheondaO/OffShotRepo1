
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/hooks/use-theme";
import { StreakUpdater } from "@/components/user/StreakUpdater";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import BrowseIssues from "@/pages/BrowseIssues";
import IssueDetails from "@/pages/IssueDetails";
import SubmitIssue from "@/pages/SubmitIssue";
import AuthPage from "@/pages/auth-page";
import ProfilePage from "@/pages/profile-page";
import PrivacyPage from "@/pages/privacy-page";
import TermsPage from "@/pages/terms-page";
import NewsletterPage from "@/pages/newsletter-page";
import ChatPage from "@/pages/chat-page";
import MissionPage from "@/pages/mission-page";
import GamesPage from "@/pages/games-page";
import AnalyticsPage from "@/pages/analytics-page";
import DemoUserPage from "@/pages/demo-user-page";
import Header from "@/components/layout/Header";
import ConditionalFooter from "@/components/layout/ConditionalFooter";

function Router() {
  // Global error handler
  useEffect(() => {
    const handler = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      console.error('Unhandled rejection:', event.reason);
    };
    window.addEventListener('unhandledrejection', handler);
    return () => window.removeEventListener('unhandledrejection', handler);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/browse" component={BrowseIssues} />
          <Route path="/issues/:id" component={IssueDetails} />
          <Route path="/submit" component={SubmitIssue} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/privacy" component={PrivacyPage} />
          <Route path="/terms" component={TermsPage} />
          <Route path="/newsletter" component={NewsletterPage} />
          <Route path="/chat" component={ChatPage} />
          <Route path="/mission" component={MissionPage} />
          <Route path="/games" component={GamesPage} />
          <Route path="/analytics" component={AnalyticsPage} />
          <Route path="/demo" component={DemoUserPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <ConditionalFooter />
      <StreakUpdater />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
