import React, { useState, useMemo } from 'react';
import { usePerformance } from '../context/PerformanceContext';
import { MOCK_DATASET } from '../data/mockData';
import { useDebounce } from '../hooks/useDebounce';
import { useVirtualList } from '../hooks/useVirtualList';
import { Search, Database, Cpu } from 'lucide-react';

export const LargeListDemo = () => {
  const { isOptimized } = usePerformance();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Debounce search query in optimized mode
  const debouncedSearchTerm = useDebounce(searchTerm, 250);
  const activeSearchQuery = isOptimized ? debouncedSearchTerm : searchTerm;

  const memoizedFilteredItems = useMemo(() => {
    return MOCK_DATASET.filter((item) => {
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const matchesSearch = item.title.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(activeSearchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, activeSearchQuery]);

  const rawFilteredItems = MOCK_DATASET.filter((item) => {
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesSearch = item.title.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(activeSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredItems = isOptimized ? memoizedFilteredItems : rawFilteredItems;

  // Virtualization for 10,000 items (64px row height, 420px container viewport)
  const { virtualItems, totalHeight, offsetY, handleScroll } = useVirtualList(
    filteredItems,
    64,
    420
  );

  // In unoptimized mode, slice first 300 to avoid locking up browser DOM completely, but highlight full DOM rendering overhead
  const displayItemsUnoptimized = filteredItems.slice(0, 300);

  return (
    <div className="module-card">
      <div className="module-header">
        <div className="module-title">
          <h2>Module 2: Virtualization & Debounced Search (10,000 Records)</h2>
          <p>
            Compares full DOM rendering with raw inputs against windowed list virtualization (rendering only visible rows) and debounced state updates.
          </p>
        </div>
        <div className="tech-badge">
          <Database size={14} /> Virtualization + Debounce (10,000 Items)
        </div>
      </div>

      {!isOptimized ? (
        <div className="banner-notice warning">
          ⚠️ <strong>Unoptimized Mode Active:</strong> Filtering 10,000 items synchronously on every single keystroke. Rendering hundreds of full DOM nodes causes typing latency!
        </div>
      ) : (
        <div className="banner-notice success">
          ⚡ <strong>Optimized Mode Active:</strong> Search input is debounced by 250ms and list is windowed using Virtualization. Only {virtualItems.length} DOM elements rendered out of {filteredItems.length} total items!
        </div>
      )}

      <div className="control-row">
        <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="input-field"
            style={{ paddingLeft: '40px' }}
            placeholder="Search 10,000 dataset records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="input-field"
          style={{ maxWidth: '200px' }}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Engineering">Engineering</option>
          <option value="Marketing">Marketing</option>
          <option value="Product">Product</option>
          <option value="Sales">Sales</option>
          <option value="Design">Design</option>
        </select>

        <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
          Total Matched: <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>{filteredItems.length}</span> | Rendered DOM Nodes: <span style={{ color: 'var(--accent-emerald)', fontWeight: 'bold' }}>{isOptimized ? virtualItems.length : displayItemsUnoptimized.length}</span>
        </div>
      </div>

      {isOptimized ? (
        /* VIRTUALIZED LIST CONTAINER */
        <div className="list-viewport" onScroll={handleScroll} style={{ height: '420px' }}>
          <div style={{ height: `${totalHeight}px`, position: 'relative', width: '100%' }}>
            <div style={{ transform: `translateY(${offsetY}px)`, position: 'absolute', top: 0, left: 0, right: 0 }}>
              {virtualItems.map((item) => (
                <div key={item.id} className="item-card" style={{ height: '56px', marginBottom: '8px' }}>
                  <div className="item-info">
                    <h4>{item.title}</h4>
                    <p style={{ fontSize: '0.78rem' }}>{item.category} • {item.status} • Score: {item.score}</p>
                  </div>
                  <span className="render-badge">ID: #{item.id}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* UNOPTIMIZED LIST CONTAINER */
        <div className="list-viewport" style={{ height: '420px' }}>
          {displayItemsUnoptimized.map((item) => (
            <div key={item.id} className="item-card" style={{ height: '56px', marginBottom: '8px' }}>
              <div className="item-info">
                <h4>{item.title}</h4>
                <p style={{ fontSize: '0.78rem' }}>{item.category} • {item.status} • Score: {item.score}</p>
              </div>
              <span className="render-badge highlight">Full DOM Node #{item.id}</span>
            </div>
          ))}
          {filteredItems.length > 300 && (
            <div style={{ textAlign: 'center', padding: '12px', color: 'var(--accent-amber)', fontSize: '0.85rem' }}>
              ⚠️ Truncated to 300 items in unoptimized view to prevent browser crash. Switch to Optimized Mode for seamless 10,000 item windowing!
            </div>
          )}
        </div>
      )}
    </div>
  );
};
