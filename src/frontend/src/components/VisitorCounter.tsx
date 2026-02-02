import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

export default function VisitorCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const storedCount = localStorage.getItem('visitorCount');
    const currentCount = storedCount ? parseInt(storedCount, 10) : 0;
    const newCount = currentCount + 1;
    localStorage.setItem('visitorCount', newCount.toString());
    setCount(newCount);
  }, []);

  return (
    <div className="bg-background/95 backdrop-blur border border-border rounded-lg px-4 py-2 shadow-lg flex items-center gap-2 animate-slide-up">
      <Eye className="h-4 w-4 text-primary" />
      <span className="text-sm font-medium">Visitors: {count.toLocaleString()}</span>
    </div>
  );
}
