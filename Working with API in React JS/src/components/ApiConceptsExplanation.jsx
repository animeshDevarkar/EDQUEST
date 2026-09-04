import React, { useState } from 'react';
import { Code2, Cpu, RefreshCw, AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export default function ApiConceptsExplanation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('fetch');

  const conceptTabs = [
    {
      id: 'fetch',
      title: '1. API Fetching',
      icon: <Cpu size={16} />,
      content: `// Asynchronous API call to Open-Meteo REST API endpoint
export async function fetchWeatherData(latitude, longitude) {
  const url = \`https://api.open-meteo.com/v1/forecast?latitude=\${latitude}&longitude=\${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto\`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(\`HTTP Error! Status: \${response.status}\`);
  }
  return await response.json();
}`
    },
    {
      id: 'lifecycle',
      title: '2. useEffect Hook',
      icon: <RefreshCw size={16} />,
      content: `// Trigger API fetch whenever selected city changes
useEffect(() => {
  if (!selectedCity) return;

  async function loadWeather() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(selectedCity.latitude, selectedCity.longitude);
      setWeatherData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  }

  loadWeather();
}, [selectedCity]);`
    },
    {
      id: 'error',
      title: '3. Error & Loading State',
      icon: <AlertCircle size={16} />,
      content: `// Conditional rendering based on API state
if (loading) return <LoadingSkeleton />;
if (error) return <ErrorMessage message={error} onRetry={loadWeather} />;

return (
  <CurrentWeather weatherData={weatherData} city={selectedCity} />
);`
    },
    {
      id: 'debounce',
      title: '4. Live Search Debouncing',
      icon: <CheckCircle2 size={16} />,
      content: `// Debouncing search input to reduce unnecessary API requests
useEffect(() => {
  if (query.trim().length < 2) return;

  const timer = setTimeout(async () => {
    const results = await searchCities(query);
    setSuggestions(results);
  }, 350);

  return () => clearTimeout(timer); // Cleanup timer on input change
}, [query]);`
    }
  ];

  return (
    <section className="api-concepts-section">
      <button className="concepts-header-btn" onClick={() => setIsOpen(!isOpen)}>
        <div className="concepts-title">
          <Code2 size={20} className="text-cyan" />
          <span>React API Integration Architecture & Concepts</span>
        </div>
        <div className="concepts-toggle">
          <span className="toggle-label">{isOpen ? 'Hide Developer Notes' : 'View Code Concepts'}</span>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {isOpen && (
        <div className="concepts-body">
          <p className="concepts-intro">
            This project demonstrates standard React API integration workflows: fetching REST endpoints asynchronously, managing loading/error states, lifecycle hooks with dependencies, and debouncing user query inputs.
          </p>

          <div className="concept-tabs-nav">
            {conceptTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`concept-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              >
                {tab.icon}
                <span>{tab.title}</span>
              </button>
            ))}
          </div>

          <div className="concept-code-viewer">
            <pre className="code-block">
              <code>{conceptTabs.find(t => t.id === activeTab)?.content}</code>
            </pre>
          </div>
        </div>
      )}
    </section>
  );
}
