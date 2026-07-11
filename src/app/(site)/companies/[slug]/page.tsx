import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Globe, Users, Calendar, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { mockCompanies, mockTools } from "@/lib/mock-data";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const company = mockCompanies.find((c) => c.slug === slug);
  if (!company) return { title: "Not Found" };
  return { title: `${company.name} — AI Company`, description: company.description };
}

export default async function CompanyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = mockCompanies.find((c) => c.slug === slug);
  if (!company) notFound();

  const companyTools = mockTools.filter((t) => t.company.toLowerCase().includes(company.name.toLowerCase().split(" ")[0]));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/companies" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3 w-3" /> Back to Companies
      </Link>

      <div className="flex items-start gap-4 mb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-2xl font-bold">
          {company.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{company.name}</h1>
          <p className="mt-1 text-muted-foreground">{company.description}</p>
          <a href={company.websiteUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block">
            <Button variant="outline" size="sm">
              <Globe className="mr-1 h-3 w-3" /> Website <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </a>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4 mb-8">
        {[
          { label: "Founded", value: company.founded, icon: Calendar },
          { label: "HQ", value: company.headquarters, icon: Globe },
          { label: "Employees", value: company.employees, icon: Users },
          { label: "Funding", value: company.funding, icon: DollarSign },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-4 text-center">
              <item.icon className="mx-auto h-4 w-4 text-muted-foreground mb-1" />
              <div className="text-sm font-medium">{item.value}</div>
              <div className="text-xs text-muted-foreground">{item.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-3"><CardTitle className="text-base">Products</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {company.products.map((p) => <Badge key={p} variant="secondary">{p}</Badge>)}
          </div>
        </CardContent>
      </Card>

      {companyTools.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Tools by {company.name}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {companyTools.map((tool) => (
              <Link key={tool.id} href={`/tools/${tool.slug}`}>
                <Card className="transition-all hover:shadow-sm">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted font-bold">{tool.name.charAt(0)}</div>
                    <div>
                      <div className="font-medium">{tool.name}</div>
                      <div className="text-sm text-muted-foreground">{tool.tagline}</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
