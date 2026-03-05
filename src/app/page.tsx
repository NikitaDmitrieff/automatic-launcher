import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)]">
      {/* Nav */}
      <nav className="px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-sm font-bold tracking-widest text-[var(--text-primary)] uppercase">
            Automatic Launcher
          </span>
          <Link
            href="/launch"
            className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)]"
          >
            Launch
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-24 sm:py-32">
        <div className="max-w-2xl w-full text-center">
          <div className="inline-block px-3 py-1 mb-8 text-xs font-medium tracking-widest uppercase rounded-full bg-[var(--surface-4)] text-[var(--text-muted)] border border-[var(--border)]">
            Launch Copilot for Indie Hackers
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[var(--text-primary)] mb-6">
            Launch Your Project
            <br />
            <span className="text-[var(--text-muted)]">
              in 24 Hours
            </span>
          </h1>

          <p className="text-lg text-[var(--text-secondary)] mb-12 max-w-lg mx-auto leading-relaxed">
            Get an actionable launch plan tailored to your project. Personalized
            channel recommendations, outreach playbooks, and a step-by-step
            timeline.
          </p>

          <Link
            href="/launch"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-[var(--accent-bg)] text-[var(--accent-text)] text-sm font-semibold transition-all duration-150 hover:bg-[var(--accent-hover)] active:scale-[0.97]"
          >
            Create Your Launch Plan
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="px-4 pb-24 sm:pb-32">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-center text-[var(--text-primary)] mb-16">
            Everything you need to launch
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass glass-hover rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-[var(--surface-4)] border border-[var(--border)] flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 text-[var(--text-tertiary)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">
                Channel Recommendations
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Get matched with the best launch channels for your project type
                &mdash; from Reddit communities to Product Hunt and niche forums.
                Complete with direct links.
              </p>
            </div>

            <div className="glass glass-hover rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-[var(--surface-4)] border border-[var(--border)] flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 text-[var(--text-tertiary)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">
                Outreach Playbooks
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Ready-to-use templates for each channel. Know exactly what to
                post, how to frame your project, and what tone resonates with
                each community.
              </p>
            </div>

            <div className="glass glass-hover rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-[var(--surface-4)] border border-[var(--border)] flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 text-[var(--text-tertiary)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">
                Launch Timeline
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                A structured 24-hour plan broken into clear steps. Know exactly
                what to do and when, so you spend time launching instead of
                planning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] px-4 py-10">
        <div className="max-w-5xl mx-auto flex items-center justify-center">
          <p className="text-xs text-[var(--text-faint)]">
            Automatic Launcher &mdash; ship faster, launch smarter.
          </p>
        </div>
      </footer>
    </div>
  );
}
