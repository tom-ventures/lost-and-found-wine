"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function AgeGate() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const verified = sessionStorage.getItem("age-verified");
    if (!verified) {
      setShow(true);
    }
  }, []);

  function handleYes() {
    sessionStorage.setItem("age-verified", "true");
    setShow(false);
  }

  function handleNo() {
    window.location.href = "https://www.drinkaware.co.nz";
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-brand-bg flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        <Image
          src="/images/logo-white.png"
          alt="Lost and Found Wines"
          width={280}
          height={80}
          className="mx-auto mb-12 object-contain"
          priority
        />
        <p className="text-xs tracking-[0.25em] uppercase text-brand-muted mb-8">
          New Zealand
        </p>
        <h1 className="text-2xl font-light tracking-[0.15em] uppercase text-white mb-4">
          Are you 18 or older?
        </h1>
        <p className="text-brand-muted text-sm mb-10 leading-relaxed">
          Lost and Found Wines sells alcohol. You must be 18 or over to enter this site.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleYes}
            className="border border-white text-white px-10 py-3 text-sm tracking-[0.15em] uppercase hover:bg-white hover:text-brand-bg transition-colors duration-200"
          >
            Yes, I am 18+
          </button>
          <button
            onClick={handleNo}
            className="border border-brand-muted text-brand-muted px-10 py-3 text-sm tracking-[0.15em] uppercase hover:border-white hover:text-white transition-colors duration-200"
          >
            No, exit
          </button>
        </div>
        <p className="mt-12 text-xs text-brand-muted">
          Alcohol is supplied under Best Wine Company Ltd&apos;s license 007/OFF/42/2024
        </p>
      </div>
    </div>
  );
}
