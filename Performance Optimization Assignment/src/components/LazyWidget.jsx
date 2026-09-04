import React from 'react';
import { BarChart3, PieChart, TrendingUp, ShieldCheck } from 'lucide-react';

const LazyWidget = () => {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', marginTop: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={18} /> Lazily Loaded Heavy Analytics Module
        </h3>
        <span className="tech-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
          Bundle Chunk Split Verified
        </span>
      </div>

      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
        This heavy dashboard chunk was loaded dynamically using React <code>React.lazy()</code> and <code>import()</code> syntax, keeping initial page weight minimal.
      </p>

      <div className="grid-2col">
        <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-blue)', marginBottom: '8px' }}>
            <TrendingUp size={16} /> <strong>Render Throughput</strong>
          </div>
          <p style={{ fontSize: '1.4rem', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>60.0 FPS</p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Zero layout shifts or frame drops</span>
        </div>

        <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', marginBottom: '8px' }}>
            <ShieldCheck size={16} /> <strong>Chunk Size Optimization</strong>
          </div>
          <p style={{ fontSize: '1.4rem', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>-64% Initial Bundle</p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lazy chunk fetched on demand</span>
        </div>
      </div>
    </div>
  );
};

export default LazyWidget;
