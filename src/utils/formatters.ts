import React from 'react';

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;
  
  const years = Math.floor(months / 12);
  return `${years}y`;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export function parseContent(content: string): React.ReactNode[] {
  const parts = content.split(/([@#]\w+)/g);
  return parts.map((part, index) => {
    if (part.startsWith('@')) {
      return React.createElement(
        'a',
        {
          key: index,
          href: `/profile/${part.slice(1)}`,
          className: 'text-blue-500'
        },
        part
      );
    }
    if (part.startsWith('#')) {
      return React.createElement(
        'a',
        {
          key: index,
          href: `/hashtag/${part.slice(1)}`,
          className: 'text-blue-500'
        },
        part
      );
    }
    return part;
  });
} 