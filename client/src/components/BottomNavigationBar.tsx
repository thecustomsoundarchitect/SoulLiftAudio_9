
import { useLocation, useNavigate } from 'react-router-dom'
import { FloatingDock } from './ui/floating-dock'
import { IconHome } from '@tabler/icons-react'
import { Heart, Archive, User } from 'lucide-react'
import { useSoulHug } from '../context/SoulHugContext'

export default function BottomNavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearForNewHug } = useSoulHug();

  const dockLinks = [
    {
      title: 'Home',
      href: '/',
      icon: <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      onClick: () => navigate('/')
    },
    {
      title: 'Create',
      href: '/define',
      icon: <Heart className="h-full w-full text-purple-500 dark:text-purple-300" />,
      onClick: () => {
        clearForNewHug();
        navigate('/define');
      }
    },
    {
      title: 'My Hugs',
      href: '/my-hugs',
      icon: <Archive className="h-full w-full text-blue-500 dark:text-blue-300" />,
      onClick: () => navigate('/my-hugs')
    },
    {
      title: 'Profile',
      href: '/user-profile',
      icon: <User className="h-full w-full text-indigo-500 dark:text-indigo-300" />,
      onClick: () => navigate('/user-profile')
    }
  ];

  const itemsWithActiveState = dockLinks.map(item => ({
    ...item,
    active: item.href === location.pathname
  }));

  // Custom FloatingDock with onClick support for Create
  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <FloatingDock
        items={itemsWithActiveState}
        onItemClick={item => item.onClick && item.onClick()}
      />
    </div>
  );
}
