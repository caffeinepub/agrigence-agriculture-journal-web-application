import { useGetBannerConfig } from '../hooks/useQueries';
import { AlertCircle } from 'lucide-react';

export default function NoticeMarqueeBanner() {
  const { data: bannerConfig, isLoading, isError } = useGetBannerConfig();

  // Don't render if disabled, loading, error, or no notices
  if (isLoading || isError || !bannerConfig || !bannerConfig.isBannerEnabled || bannerConfig.notices.length === 0) {
    return null;
  }

  return (
    <div className="notice-banner-container w-full bg-primary text-primary-foreground overflow-hidden relative">
      <div className="notice-marquee-track">
        {/* Duplicate notices for seamless loop */}
        {[...bannerConfig.notices, ...bannerConfig.notices].map((notice, index) => (
          <div key={index} className="notice-item">
            {notice.link ? (
              <a
                href={notice.link}
                target="_blank"
                rel="noopener noreferrer"
                className="notice-link hover:underline"
              >
                <AlertCircle className="inline h-4 w-4 mr-2" />
                {notice.text}
              </a>
            ) : (
              <span className="notice-text">
                <AlertCircle className="inline h-4 w-4 mr-2" />
                {notice.text}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
