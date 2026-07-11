import type { Metadata } from "next";
import Link from "next/link";
import { Building2, ExternalLink, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { mockCompanies } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "AI Companies",
  description: "Profiles of leading AI companies and research labs.",
};

export default function CompaniesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="h-6 w-6 text-cyan-500" />
          <h1 className="text-3xl font-bold">AI Companies</h1>
        </div>
        <p className="text-muted-foreground">
          Leading AI companies, their products, funding, and latest developments.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockCompanies.map((company) => (
          <Link key={company.id} href={`/companies/${company.slug}`}>
            <Card className="h-full transition-all hover:border-border hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-xl font-bold">
                    {company.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{company.name}</h3>
                    <p className="text-xs text-muted-foreground">{company.headquarters}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{company.description}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-muted-foreground">Founded:</span> {company.founded}</div>
                  <div><span className="text-muted-foreground">Employees:</span> {company.employees}</div>
                  <div><span className="text-muted-foreground">Funding:</span> {company.funding}</div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {company.products.slice(0, 3).map((p) => (
                    <Badge key={p} variant="secondary" className="text-[10px]">{p}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
