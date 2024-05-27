import AppFooter from '@/app/components/app-footer';
import AppHeader from '@/app/components/app-header';
import BackgroundPattern from '@/app/components/background-pattern';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BackgroundPattern />
      <div className="max-w-[1050px] mx-auto px-4">
        <AppHeader />
        {children}
        <AppFooter />
      </div>
    </>
  );
}
