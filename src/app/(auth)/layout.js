import React from 'react';

export default function LoginLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {children}
    </div>
  );
}