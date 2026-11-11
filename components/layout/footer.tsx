import React from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/site";
import { PRODUCTS } from "@/lib/products";
import {
  InstagramIcon,
  FacebookIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/icons/brand-icons";

export function Footer() {
  const socials = SITE_CONFIG.socials;

  return (
    <footer className="w-full bg-charcoal text-cream/90 pt-16 pb-12 border-t border-gold/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-cream">
                AKATSUKI
              </span>
              <span className="w-2 h-2 rounded-full bg-gold inline-block" />
            </Link>
            <p className="text-xs text-cream/70 leading-relaxed">
              100% Ayurvedic Herbal Hair Oils handcrafted with cold-pressed natural ingredients. Nourishing roots, honoring ancient botanical wisdom.
            </p>
            <p className="text-[11px] text-gold/80 font-medium">
              Paraben Free · Natural Ingredients · For All
            </p>
          </div>

          {/* Shop Variants Column */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-gold">
              Botanical Collection
            </h4>
            <ul className="space-y-2 text-xs text-cream/70">
              {PRODUCTS.map((product) => (
                <li key={product.id}>
                  <a
                    href="#rail"
                    className="hover:text-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
                  >
                    {product.name} ({product.tagline})
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn & Support Column */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-gold">
              Ayurvedic Care
            </h4>
            <ul className="space-y-2 text-xs text-cream/70">
              <li>
                <a
                  href="#ingredients"
                  className="hover:text-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
                >
                  Our Botanical Herbs
                </a>
              </li>
              <li>
                <a
                  href="#how-to-use"
                  className="hover:text-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
                >
                  Application Ritual
                </a>
              </li>
              <li>
                <a
                  href="#quiz"
                  className="hover:text-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
                >
                  Find Your Oil Quiz
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="hover:text-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
                >
                  Shipping & FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Connect & Socials Column */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-gold">
              Connect With Us
            </h4>
            <p className="text-xs text-cream/70">
              Follow our journey of traditional herb harvest and botanical crafting.
            </p>

            {/* Social Icons (missing URL -> non-link element with aria-label, never href="#") */}
            <div className="flex items-center gap-3 pt-2">
              {/* Instagram */}
              {socials.instagram ? (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow AKATSUKI on Instagram"
                  className="p-2 rounded-full bg-white/5 hover:bg-gold hover:text-charcoal text-cream transition-colors"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  aria-label="Instagram (link not configured)"
                  className="p-2 rounded-full bg-white/5 text-cream/30 cursor-not-allowed"
                >
                  <InstagramIcon className="w-4 h-4" />
                </button>
              )}

              {/* Facebook */}
              {socials.facebook ? (
                <a
                  href={socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow AKATSUKI on Facebook"
                  className="p-2 rounded-full bg-white/5 hover:bg-gold hover:text-charcoal text-cream transition-colors"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  aria-label="Facebook (link not configured)"
                  className="p-2 rounded-full bg-white/5 text-cream/30 cursor-not-allowed"
                >
                  <FacebookIcon className="w-4 h-4" />
                </button>
              )}

              {/* X */}
              {socials.x ? (
                <a
                  href={socials.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow AKATSUKI on X"
                  className="p-2 rounded-full bg-white/5 hover:bg-gold hover:text-charcoal text-cream transition-colors"
                >
                  <XIcon className="w-4 h-4" />
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  aria-label="X (link not configured)"
                  className="p-2 rounded-full bg-white/5 text-cream/30 cursor-not-allowed"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              )}

              {/* YouTube */}
              {socials.youtube ? (
                <a
                  href={socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow AKATSUKI on YouTube"
                  className="p-2 rounded-full bg-white/5 hover:bg-gold hover:text-charcoal text-cream transition-colors"
                >
                  <YouTubeIcon className="w-4 h-4" />
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  aria-label="YouTube (link not configured)"
                  className="p-2 rounded-full bg-white/5 text-cream/30 cursor-not-allowed"
                >
                  <YouTubeIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-cream/50 gap-4">
          <p>© {new Date().getFullYear()} AKATSUKI Beauty & Wellness. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Handcrafted with 100% natural herbs. No medical claims are made or implied.
          </p>
        </div>
      </div>
    </footer>
  );
}
