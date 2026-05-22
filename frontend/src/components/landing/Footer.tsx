import React from 'react';
import { useNavigate } from 'react-router-dom';
import { VirtusaLogo } from '../ui/VirtusaLogo';
const footerLinks = {
  Product: ['Features', 'Pricing', 'Integrations', 'Changelog', 'Roadmap'],
  Company: ['About', 'Blog', 'Careers', 'Press Kit', 'Contact'],
  Resources: [
  'Documentation',
  'API Reference',
  'Help Center',
  'Community',
  'Status'],

  Legal: [
  'Privacy Policy',
  'Terms of Service',
  'Cookie Policy',
  'GDPR',
  'Security']

};
export function Footer() {
  const navigate = useNavigate();
  return (
    <footer
      id="footer"
      className="relative border-t border-white/5 py-16 px-5 sm:px-8">
      
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 mb-4">
              
              <VirtusaLogo className="w-7 h-7" />
              <span className="text-xl font-bold text-[#02f576] tracking-tight lowercase">
                virtusa
              </span>
            </button>
            <p className="text-sm text-white/60 leading-relaxed">
              Modern recruitment platform making hiring simple and efficient.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) =>
          <div key={category}>
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) =>
              <li key={link}>
                    <a
                  href="#"
                  className="text-sm text-white/60 hover:text-white transition-colors">
                  
                      {link}
                    </a>
                  </li>
              )}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">
            © 2024 Virtusa. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Twitter', 'LinkedIn', 'GitHub'].map((social) =>
            <a
              key={social}
              href="#"
              className="text-sm text-white/50 hover:text-white transition-colors">
              
                {social}
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>);

}