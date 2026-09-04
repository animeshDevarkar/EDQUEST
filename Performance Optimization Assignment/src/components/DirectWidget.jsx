import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';

const DirectWidget = () => {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', marginTop: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={18} /> Eagerly Loaded Monolithic Widget
        </h3>
        <span className="tech-badge" style={{ background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.3)' }}>
          Bundled in Primary Entry Chunk
        </span>
      </div>

      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
        This analytical widget was statically imported into the primary entry bundle, adding unnecessary weight to the initial page load.
      </p>

      <div className="grid-2col">
        <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)', marginBottom: '8px' }}>
            <TrendingUp size={16} /> <strong>Initial Parsing Cost</strong>
          </div>
          <p style={{ fontSize: '1.4rem', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>+120 ms</p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Higher initial parse & compile time</span>
        </div>

        <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-rose)', marginBottom: '8px' }}>
            <AlertTriangle size={16} /> <strong>Bundle Weight Impact</strong>
          </div>
          <p style={{ fontSize: '1.4rem', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>Monolithic</p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Loaded regardless of user interaction</span>
        </div>
      </div>
    </div>
  );
};

export default DirectWidget;
