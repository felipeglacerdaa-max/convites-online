'use client';

import { LayoutDashboard, Users, Plus, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardNav() {
  const pathname = usePathname();

  const links = [
    {
      href: '/dashboard',
      label: 'Meus Convites',
      icon: LayoutDashboard,
      active: pathname === '/dashboard'
    },
    {
      href: '/dashboard/admin',
      label: 'Administração',
      icon: Users,
      active: pathname === '/dashboard/admin'
    },
    {
      href: '/dashboard/novo',
      label: 'Criar Novo',
      icon: Plus,
      active: pathname === '/dashboard/novo'
    },
    {
      href: '/dashboard/config',
      label: 'Configurações',
      icon: Settings,
      active: pathname === '/dashboard/config'
    }
  ];

  return (
    <nav className="flex-1 space-y-2">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link 
            key={link.href}
            href={link.href} 
            className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all relative ${
              link.active 
                ? 'bg-purple-50 text-purple-600' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            {link.active && (
              <span className="bg-purple-600 w-1.5 h-6 rounded-full absolute left-0"></span>
            )}
            <Icon size={20} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
