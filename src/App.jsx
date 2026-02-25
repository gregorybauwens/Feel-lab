import { Component } from "react";
import ButtonPlayground from "./components/ButtonPlayground";
import ExamplesSection from "./components/ExamplesSection";

class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, fontFamily: "monospace", color: "#f87171", background: "#0e0e12", minHeight: "100vh" }}>
          <h2 style={{ color: "#fca5a5", marginBottom: 16 }}>Runtime Error</h2>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 13 }}>{this.state.error.toString()}</pre>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 11, color: "#6b7280", marginTop: 12 }}>{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-[#0e0e12] flex flex-col items-center gap-24 px-8 py-16">

        {/* ── Feel Lab ── */}
        <div className="w-full max-w-xl flex flex-col gap-8">
          <div>
            <h1 className="text-white/80 text-2xl font-bold tracking-tight">Feel Lab</h1>
            <p className="text-white/25 text-sm mt-1">Design the perfect button interaction</p>
          </div>
          <ButtonPlayground />
        </div>

        {/* ── 30 Examples ── */}
        <ExamplesSection />

      </main>
    </ErrorBoundary>
  );
}
