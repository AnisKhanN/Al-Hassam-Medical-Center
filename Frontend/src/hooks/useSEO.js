import { useEffect } from "react";

const DEFAULT_TITLE = "SmartClinic — Integrated Clinic & Pharmacy Management SaaS";
const DEFAULT_DESC =
  "SmartClinic is an enterprise-grade healthcare SaaS engineered for outpatient clinics and pharmacies, featuring EHR, FEFO pharmacy POS, and Gemini AI trilingual slips.";

/**
 * Custom hook to dynamically update document title, meta tags, and Open Graph information
 * for improved client-side SEO and browser navigation history.
 */
export const useSEO = ({
  title,
  description = DEFAULT_DESC,
  keywords,
  canonical,
} = {}) => {
  useEffect(() => {
    // 1. Update Document Title
    const formattedTitle = title ? `${title} | SmartClinic` : DEFAULT_TITLE;
    document.title = formattedTitle;

    // Helper to update or create meta tags
    const setMetaTag = (attrName, attrValue, content) => {
      if (!content) return;
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // 2. Update Primary Meta Tags
    setMetaTag("name", "description", description);
    if (keywords) {
      setMetaTag("name", "keywords", keywords);
    }

    // 3. Update Open Graph & Twitter Cards
    setMetaTag("property", "og:title", formattedTitle);
    setMetaTag("property", "og:description", description);
    setMetaTag("name", "twitter:title", formattedTitle);
    setMetaTag("name", "twitter:description", description);

    // 4. Update Canonical URL if specified
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    }
  }, [title, description, keywords, canonical]);
};

export default useSEO;
