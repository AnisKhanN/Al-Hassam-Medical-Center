import { useEffect } from "react";

const DEFAULT_TITLE = "SmartClinic — Integrated Clinic & Pharmacy Management SaaS";
const DEFAULT_DESC =
  "Enterprise-grade healthcare SaaS engineered for outpatient clinics and pharmacies. Features Electronic Health Records (EHR), FEFO inventory POS, WebRTC telemedicine, and Google Gemini AI trilingual discharge slips.";
const DEFAULT_KEYWORDS =
  "SmartClinic, clinic management software, pharmacy management SaaS, electronic health records, EHR Pakistan, FEFO inventory, telemedicine WebRTC, clinic billing POS, Sanghar healthcare, Anis Khan Niazi";

/**
 * Enhanced SEO, AEO (Answer Engine Optimization) & GEO (Generative Engine Optimization) Hook
 * Dynamically updates document metadata, OpenGraph, Twitter Cards, Geolocation, and JSON-LD schema.
 */
export const useSEO = ({
  title,
  description = DEFAULT_DESC,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  ogType = "website",
  ogImage = "/favicon.svg",
  schema,
  geoRegion = "PK-SD",
  geoPlacename = "Sanghar, Sindh, Pakistan",
  geoPosition = "26.0464;68.9482",
  icbm = "26.0464, 68.9482",
} = {}) => {
  useEffect(() => {
    // 1. Update Document Title
    const formattedTitle = title ? `${title} | SmartClinic` : DEFAULT_TITLE;
    document.title = formattedTitle;

    // Helper to update or create meta tags
    const setMetaTag = (attrName, attrValue, content) => {
      if (!content) return;
      let element = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // 2. Primary Meta Tags (Search Engine Optimization)
    setMetaTag("name", "description", description);
    setMetaTag("name", "keywords", keywords);
    setMetaTag("name", "robots", "index, follow");
    setMetaTag("name", "author", "Anis Khan Niazi");

    // 3. Open Graph & Social Media Tags
    setMetaTag("property", "og:title", formattedTitle);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:type", ogType);
    setMetaTag("property", "og:site_name", "SmartClinic SaaS");
    setMetaTag("property", "og:locale", "en_US");
    setMetaTag("property", "og:locale:alternate", "ur_PK");
    if (ogImage) {
      setMetaTag("property", "og:image", ogImage);
      setMetaTag("name", "twitter:image", ogImage);
    }

    // 4. Twitter Cards
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", formattedTitle);
    setMetaTag("name", "twitter:description", description);

    // 5. GEO (Generative Engine Optimization) & Regional Metadata
    if (geoRegion) setMetaTag("name", "geo.region", geoRegion);
    if (geoPlacename) setMetaTag("name", "geo.placename", geoPlacename);
    if (geoPosition) setMetaTag("name", "geo.position", geoPosition);
    if (icbm) setMetaTag("name", "ICBM", icbm);

    // 6. Dynamic Canonical URL
    const resolvedCanonical =
      canonical || (typeof window !== "undefined" ? window.location.href.split("#")[0] : "");
    if (resolvedCanonical) {
      let link = document.head.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", resolvedCanonical);
      setMetaTag("property", "og:url", resolvedCanonical);
      setMetaTag("name", "twitter:url", resolvedCanonical);
    }

    // 7. AEO / GEO Structured Data (Schema.org JSON-LD dynamic injection)
    let schemaScript = document.head.querySelector("script#dynamic-route-schema");
    if (schema) {
      if (!schemaScript) {
        schemaScript = document.createElement("script");
        schemaScript.setAttribute("type", "application/ld+json");
        schemaScript.setAttribute("id", "dynamic-route-schema");
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schema);
    }

    return () => {
      // Cleanup dynamic schema on unmount if route changes
      if (schemaScript && schemaScript.parentNode) {
        schemaScript.parentNode.removeChild(schemaScript);
      }
    };
  }, [
    title,
    description,
    keywords,
    canonical,
    ogType,
    ogImage,
    schema,
    geoRegion,
    geoPlacename,
    geoPosition,
    icbm,
  ]);
};

export default useSEO;
