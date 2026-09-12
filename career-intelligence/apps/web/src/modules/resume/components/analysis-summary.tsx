import type { ResumeAnalysis } from "@careerlens/shared-types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface AnalysisSummaryProps {
  analysis: ResumeAnalysis;
}

export function AnalysisSummary({ analysis }: AnalysisSummaryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">ATS estimate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold tabular-nums text-foreground">{analysis.atsScore}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Readability</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold tabular-nums text-foreground">{analysis.readabilityScore}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Keyword density</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold tabular-nums text-foreground">{analysis.keywordDensity}%</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default AnalysisSummary;
