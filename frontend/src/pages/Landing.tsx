import React from 'react';
import { NavBar } from '../components/landing/NavBar';
import { Hero } from '../components/landing/Hero';
import { TrustedBy } from '../components/landing/TrustedBy';
import { FeatureRows } from '../components/landing/FeatureRows';
import { Stats } from '../components/landing/Stats';
import { Workflow } from '../components/landing/Workflow';
import { Footer } from '../components/landing/Footer';
export function Landing() {
  return (
    <div className="relative min-h-screen bg-[#1e2345] text-white overflow-hidden">
      {/* Grid pattern background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px'
        }} />
      

      <div className="relative z-10">
        <NavBar />
        <Hero />
        <TrustedBy />
        <FeatureRows />
        <Stats />
        <Workflow />
        <Footer />
      </div>
    </div>);

}