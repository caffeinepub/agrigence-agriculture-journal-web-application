import { Outlet } from '@tanstack/react-router';
import Header from './Header';
import Footer from './Footer';
import NoticeMarqueeBanner from './NoticeMarqueeBanner';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <NoticeMarqueeBanner />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
