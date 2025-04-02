
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu, X } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { markAllAsRead } from '@/redux/slices/notificationsSlice';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, unreadCount } = useAppSelector((state) => state.notifications);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  return (
    <header className="sticky top-0 z-50 bg-nexus-blue border-b border-gray-800 py-3 px-4 sm:px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="font-bold text-white text-xl">
            CryptoWeather<span className="text-nexus-purple">Nexus</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-300 hover:text-white">
            Dashboard
          </Link>
          <Link to="/weather" className="text-gray-300 hover:text-white">
            Weather
          </Link>
          <Link to="/crypto" className="text-gray-300 hover:text-white">
            Crypto
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-300" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-nexus-purple text-[10px] flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-white dark:bg-gray-800">
              <DropdownMenuLabel className="flex justify-between">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="text-xs h-auto p-0"
                  >
                    Mark all as read
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {items.length > 0 ? (
                <div className="max-h-80 overflow-y-auto">
                  {items.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`flex flex-col items-start py-2 ${
                        !notification.read ? 'bg-gray-50 dark:bg-gray-700' : ''
                      }`}
                    >
                      <div className="w-full flex justify-between">
                        <span className="font-semibold text-sm">
                          {notification.title}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(notification.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <span className="text-xs mt-1">{notification.message}</span>
                    </DropdownMenuItem>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-gray-500 text-sm">
                  No notifications
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden py-2 px-4 bg-gray-900">
          <div className="flex flex-col space-y-3">
            <Link
              to="/"
              className="text-gray-300 hover:text-white py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/weather"
              className="text-gray-300 hover:text-white py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Weather
            </Link>
            <Link
              to="/crypto"
              className="text-gray-300 hover:text-white py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Crypto
            </Link>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-300">Notifications</span>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
              >
                <Bell className="h-5 w-5 text-gray-300" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-nexus-purple text-[10px] flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
