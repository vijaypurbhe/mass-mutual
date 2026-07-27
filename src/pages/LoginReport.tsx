import { useMemo } from "react";
import { ArrowLeft, Shield, Users } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import techMahindraLogo from "@/assets/tech-mahindra-logo.png";
import { getAuthenticatedEmail, getLoginAuditLog, isLoginReportAdmin } from "@/lib/demoAccess";

const LoginReport = () => {
  const authenticatedEmail = getAuthenticatedEmail();
  const authorized = isLoginReportAdmin(authenticatedEmail);
  const entries = useMemo(() => getLoginAuditLog(), []);
  const uniqueEmails = new Set(entries.map((entry) => entry.email));

  if (!authenticatedEmail) {
    return <Navigate to="/" replace />;
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-6 space-y-4">
            <Shield className="w-12 h-12 text-destructive mx-auto" />
            <h1 className="text-xl font-bold text-foreground">Access Denied</h1>
            <p className="text-muted-foreground text-sm">
              Only vijay.purbhe@techmahindra.com can view this login report.
            </p>
            <Button variant="outline" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Demo
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img src={techMahindraLogo} alt="Tech Mahindra" className="h-12 w-auto object-contain" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Login Audit Report</h1>
              <p className="text-sm text-muted-foreground">Frontend access log for the demo gate</p>
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Logins</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{entries.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Unique Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <p className="text-3xl font-bold text-foreground">{uniqueEmails.size}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-0">
            {entries.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No login records yet.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Date &amp; Time</TableHead>
                    <TableHead className="hidden md:table-cell">Browser</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.email}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(entry.loggedInAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground text-xs max-w-[360px] truncate">
                        {entry.userAgent}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginReport;
