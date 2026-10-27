import React from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

function Footer() {
  return (
    <footer className="w-full border-t border-neutral-900 bg-[#0a0a0a] py-12 text-sm text-neutral-400">
            <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-col items-center md:items-start gap-4">
                    <Logo width="80px" />
                    <p>
                        &copy; 2026 DP.
                    </p>
                </div>
                
                <div className="flex gap-8">
                     <Link to="/" className="hover:text-white transition-colors">Terms</Link>
                     <Link to="/" className="hover:text-white transition-colors">Privacy</Link>
                     <Link to="/" className="hover:text-white transition-colors">Help</Link>
                </div>
            </div>
    </footer>
  )
}

export default Footer