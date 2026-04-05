'use client';

import Header from './Header';

interface DropdownItem {
  label: string;
  href?: string;
  onClick?: () => void;
  danger?: boolean;
}

interface NavLink {
  label: string;
  href?: string;
  onClick?: () => void;
  highlight?: boolean;
  dropdown?: DropdownItem[];
}

interface MobileNavProps {
  brand?: string;
  links: NavLink[];
  showNotification?: boolean;
  notificationTokenKey?: string;
}

export default function MobileNav({
  brand = 'EventPro',
  links,
  showNotification = false,
  notificationTokenKey = 'clientToken',
}: MobileNavProps) {
  // MobileNav now delegates to Header component for responsive design
  return (
    <Header
      brand={brand}
      links={links}
      showNotification={showNotification}
      notificationTokenKey={notificationTokenKey}
    />
  );
}


