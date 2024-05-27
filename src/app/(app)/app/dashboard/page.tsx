import Branding from '@/app/components/branding';
import Stats from '@/app/components/stats';

export default function DashBoardPage() {
  return (
    <main>
      <div className="flex items-center justify-between text-white py-8">
        <Branding />
        <Stats />
      </div>
    </main>
  );
}
