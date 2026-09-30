import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { organizationJsonLd, webSiteJsonLd } from "@/lib/jsonld";

// Marketing site shell. The admin area (app/admin) deliberately does not use this.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const orgLd = organizationJsonLd();
  const webSiteLd = webSiteJsonLd();

  return (
    <>
      {/* Organisation + WebSite structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteLd) }}
      />

      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
