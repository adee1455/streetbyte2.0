import React from 'react';
import { Bell, Globe, Lock, Moon } from 'lucide-react';

export const SettingsTab = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow divide-y">
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="ml-3">Push Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="ml-3">Email Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Appearance</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Moon className="w-5 h-5 text-gray-400" />
              <span className="ml-3">Dark Mode</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Language & Region</h3>
          <div className="flex items-center">
            <Globe className="w-5 h-5 text-gray-400" />
            <select className="ml-3 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500">
              <option>English</option>
              <option>Hindi</option>
              <option>Bengali</option>
              <option>Tamil</option>
            </select>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
          <button className="flex items-center text-red-600 hover:text-red-700">
            <Lock className="w-5 h-5 mr-2" />
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};