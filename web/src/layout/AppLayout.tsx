import type { ReactNode } from 'react';
import LogoSVG from '../assets/logo.svg';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <section className="max-sm:w-full w-3/4 flex flex-col gap-8">
      <header>
        <img src={LogoSVG} width={120} />
      </header>
      {children}
    </section>
  );
}
