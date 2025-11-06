import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      md: "820px",
      lg: "1300px",
    },
    fontFamily: {
      sans: ['var(--font-kaisei-decol)', 'serif'],
      kaisei: ['var(--font-kaisei-decol)', 'serif'],
    },
    extend: {
      colors: {
        background: "var(--color-background)",

        card: {
          background: "var(--color-card-background)",
          typeBackground: "var(--color-card-type-background)",
          typeText: "var(--color-card-type-text)",
          textTitle: "var(--color-card-text-title)",
          textDescription: "var(--color-card-text-description)",
          durationText: "var(--color-card-duration-text)",
          priceText: "var(--color-card-price-text)",
          buttonBackground: "var(--color-card-button-background)",
          buttonText: "var(--color-card-button-text)"
        },

        navbar: {
          background: "var(--color-navbar-background)",
          text: "var(--color-navbar-text)",
          buttonBackground: "var(--color-navbar-button-background)",
          buttonText: "var(--color-navbar-button-text)",
          hamburger: "var(--color-navbar-hamburger)"
        },

        landing: {
          hero: {
            textTitle: "var(--color-landing-hero-text-title)",
            textDescription: "var(--color-landing-hero-text-description)",
            buttonBackground: "var(--color-landing-hero-button-background)",
            buttonText: "var(--color-landing-hero-button-text)",
            bannerGradient: "var(--color-landing-hero-banner-gradient)"
          },

          features: {
            textTitle: "var(--color-landing-features-text-title)",
            textDescription: "var(--color-landing-features-text-description)",
            icon: "var(--color-landing-features-icon)"
          },

          section_intro: {
            textTitle: "var(--color-landing-section-intro-text-title)",
            textDescription: "var(--color-landing-section-intro-text-description)"
          },

          services: {
            textTitle: "var(--color-landing-services-text-title)",
            textDescription: "var(--color-landing-services-text-description)",
            buttonBackground: "var(--color-landing-services-button-background)",
            buttonText: "var(--color-landing-services-button-text)",
            divider: "var(--color-landing-services-divider)",
          },

          contact: {
            text: "var(--color-landing-contact-text)",
            divider: "var(--color-landing-contact-divider)"
          }
        },

        info: {
          textTitle: "var(--color-info-text-title)",
          searchBackground: "var(--color-info-search-background)",
          searchText: "var(--color-info-search-text)",
          divider: "var(--color-info-divider)"
        },

        serviceDetail: {
          textTitle: "var(--color-service-detail-text-title)",
          textDescription: "var(--color-service-detail-text-description)",
          benefits: {
            icon: "var(--color-service-detail-benefits-icon)",
            text: "var(--color-service-detail-benefits-text)"
          },
          button: {
            background: "var(--color-service-detail-button-background)",
            text: "var(--color-service-detail-button-text)"
          }
        },

        footer: {
          background: "var(--color-footer-background)",
          icon: "var(--color-footer-icon)",
          divider: "var(--color-footer-divider)",
          text: "var(--color-footer-text)",
          chargerPlusText: "var(--color-footer-charger-plus-text)"
        }
      }
    },
  },
  plugins: [],
};

export default config;

