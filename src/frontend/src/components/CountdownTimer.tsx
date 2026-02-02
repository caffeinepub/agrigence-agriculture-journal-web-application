import { useEffect, useState } from 'react';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      const targetDate = new Date(currentYear, currentMonth, 25, 23, 59, 59);
      
      if (now > targetDate) {
        targetDate.setMonth(currentMonth + 1);
      }

      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 border border-border">
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-background rounded-md p-2 hover:scale-105 transition-transform">
          <div className="text-xl md:text-2xl font-bold text-primary">{timeLeft.days}</div>
          <div className="text-xs text-muted-foreground">Days</div>
        </div>
        <div className="bg-background rounded-md p-2 hover:scale-105 transition-transform">
          <div className="text-xl md:text-2xl font-bold text-primary">{timeLeft.hours}</div>
          <div className="text-xs text-muted-foreground">Hours</div>
        </div>
        <div className="bg-background rounded-md p-2 hover:scale-105 transition-transform">
          <div className="text-xl md:text-2xl font-bold text-primary">{timeLeft.minutes}</div>
          <div className="text-xs text-muted-foreground">Minutes</div>
        </div>
        <div className="bg-background rounded-md p-2 hover:scale-105 transition-transform">
          <div className="text-xl md:text-2xl font-bold text-primary">{timeLeft.seconds}</div>
          <div className="text-xs text-muted-foreground">Seconds</div>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground mt-3">
        Deadline: 25th of each month at 11:59 PM
      </p>
    </div>
  );
}
