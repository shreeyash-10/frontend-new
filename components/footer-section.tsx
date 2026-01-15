"use client"

import { Twitter, Github, Linkedin } from "lucide-react"
import Image from "next/image"

export function FooterSection() {
  return (
    <footer className="w-full max-w-[1320px] mx-auto px-5 flex flex-col gap-10 py-10 md:py-[70px]">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-0">
        {/* Left Section: Logo, Description, Social Links */}
        <div className="flex flex-col justify-start items-start gap-8 p-4 md:p-8">
          <div className="flex gap-3 items-stretch justify-center">
            <Image
              src="/logos/brand/indus-labs-white.png"
              alt="IndusLabs"
              width={140}
              height={32}
              className="h-7 w-auto"
            />
          </div>
          <p className="text-foreground/90 text-sm font-medium leading-[18px] text-left">Voice AI, done right</p>
          <div className="flex justify-start items-start gap-3">
            <a href="#" aria-label="Twitter" className="w-4 h-4 flex items-center justify-center">
              <Twitter className="w-full h-full text-muted-foreground" />
            </a>
            <a href="#" aria-label="GitHub" className="w-4 h-4 flex items-center justify-center">
              <Github className="w-full h-full text-muted-foreground" />
            </a>
            <a href="#" aria-label="LinkedIn" className="w-4 h-4 flex items-center justify-center">
              <Linkedin className="w-full h-full text-muted-foreground" />
            </a>
          </div>
        </div>
        {/* Right Section: Quick Links, Contact, Locations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 p-4 md:p-8 w-full md:w-auto">
          <div className="flex flex-col justify-start items-start gap-3">
            <h3 className="text-muted-foreground text-sm font-medium leading-5">Quick Links</h3>
            <div className="flex flex-col justify-end items-start gap-2">
              <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Platforms
              </a>
              <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Industries
              </a>
              <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Integrations
              </a>
              <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Insights
              </a>
              <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
                Careers
              </a>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start gap-3">
            <h3 className="text-muted-foreground text-sm font-medium leading-5">Contact us</h3>
            <div className="flex flex-col justify-center items-start gap-2">
              <a href="tel:+918105870564" className="text-foreground text-sm font-normal leading-5 hover:underline">
                +91-810-587-0564
              </a>
              <a href="mailto:hello@induslabs.io" className="text-foreground text-sm font-normal leading-5 hover:underline">
                hello@induslabs.io
              </a>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start gap-3 md:col-span-1">
            <h3 className="text-muted-foreground text-sm font-medium leading-5">Locations</h3>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
              <div className="text-sm text-foreground/90">
                <div className="font-medium text-foreground">Noida 1</div>
                <div className="text-muted-foreground">
                  7th Floor, Logix Cyber Park, Office No. B-715-716, (B-tower)
                  <br />
                  Sector 62, Noida, Uttar Pradesh 201301
                </div>
              </div>
              <div className="text-sm text-foreground/90">
                <div className="font-medium text-foreground">Noida 2</div>
                <div className="text-muted-foreground">
                  B-720, Noida One, Sector-62,
                  <br />
                  G.B. Nagar 201301
                </div>
              </div>
              <div className="text-sm text-foreground/90">
                <div className="font-medium text-foreground">Bengaluru</div>
                <div className="text-muted-foreground">
                  51/4, Najappa Layout,
                  <br />
                  Adugodi, Bengaluru, Karnataka
                </div>
              </div>
              <div className="text-sm text-foreground/90">
                <div className="font-medium text-foreground">Mumbai</div>
                <div className="text-muted-foreground">
                  B-402, Rock Garden,
                  <br />
                  Dahisar (West), Mumbai, Maharashtra
                </div>
              </div>
              <div className="text-sm text-foreground/90">
                <div className="font-medium text-foreground">New York</div>
                <div className="text-muted-foreground">
                  742 West, 28th Street,
                  <br />
                  New York, NY 10001
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 border-t border-border pt-6 text-sm text-muted-foreground">
        <div>Copyright © 2025, All rights reserved. Design and developed by Indus AI Pvt. Ltd.</div>
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <a href="#" className="hover:text-foreground">
            Terms & Conditions
          </a>
          <span>/</span>
          <a href="#" className="hover:text-foreground">
            Privacy Policy
          </a>
          <span>/</span>
          <a href="#" className="hover:text-foreground">
            Shipping Policy
          </a>
          <span>/</span>
          <a href="#" className="hover:text-foreground">
            Cancellation & Refunds
          </a>
          <span>/</span>
          <a href="#" className="hover:text-foreground">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  )
}
