import React from 'react'

export const Navbar = () => {
  return (
    <nav className="top-0 left-0 w-full px-6 md:px-12 py-4 flex items-center justify-between">
      {/* Logo */}
      <svg width="100" height="100" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 150 L100 50 L150 150" stroke="url(#grad)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="100" cy="150" r="5" fill="url(#grad)" />
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" />
          <stop offset="50%" stopColor="white" />
          <stop offset="100%" stopColor="gray" />
        </linearGradient>
      </defs>
    </svg>
      {/* <div className="text-2xl md:text-3xl text-white tracking-widest">
        AARQ
      </div> */}
    </nav>
  )
}
