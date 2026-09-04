// Data generator for 10,000 items to test list virtualization and memoization

const CATEGORIES = ['Engineering', 'Marketing', 'Product', 'Sales', 'Design', 'Customer Support', 'Operations', 'Finance'];
const STATUSES = ['Active', 'Pending', 'Archived', 'Completed', 'In Progress'];

export const generateMockDataset = (count = 10000) => {
  const items = [];
  for (let i = 1; i <= count; i++) {
    const category = CATEGORIES[i % CATEGORIES.length];
    const status = STATUSES[i % STATUSES.length];
    items.push({
      id: i,
      title: `Task #${i}: Performance Benchmark Module ${i}`,
      category,
      status,
      score: Math.floor((i * 37) % 100),
      timestamp: new Date(Date.now() - i * 3600000).toISOString().split('T')[0],
      description: `Comprehensive telemetry log item ${i} associated with ${category} department with current execution status ${status}.`
    });
  }
  return items;
};

export const MOCK_DATASET = generateMockDataset(10000);
