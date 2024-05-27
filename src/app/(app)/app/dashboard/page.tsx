import Branding from '@/app/components/branding';
import ContentBlock from '@/app/components/content-bock';
import PetDetails from '@/app/components/pet-details';
import PetList from '@/app/components/pet-list';
import SearchForm from '@/app/components/search-form';
import Stats from '@/app/components/stats';

export default function DashBoardPage() {
  return (
    <main>
      <div className="flex items-center justify-between text-white py-8">
        <Branding />
        <Stats />
      </div>
      <div className="grid md:grid-cols-3 md:grid-rows-[45px_1fr] grid-rows-[45px_300px_500px] gap-4 md:h-[600px]">
        <div className="md:row-start-1 md:row-span-1 md:ol-start-1 col-span-1">
          <SearchForm />
        </div>

        <div className="md:row-start-2 md:row-span-full md:col-start-1 col-span-1">
          <ContentBlock>
            <PetList />
          </ContentBlock>
        </div>

        <div className="md:row-start-1 md:row-span-full md:col-start-2 md:col-span-full">
          <ContentBlock>
            <PetDetails />
          </ContentBlock>
        </div>
      </div>
    </main>
  );
}
