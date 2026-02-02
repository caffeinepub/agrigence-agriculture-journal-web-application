import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetCurrentJournal, useGetAllJournalsByYear } from '../hooks/useQueries';
import { BookOpen, Download, Calendar } from 'lucide-react';

export default function JournalsPage() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const { data: currentJournal } = useGetCurrentJournal();
  const { data: yearJournals, isLoading } = useGetAllJournalsByYear(selectedYear);

  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handleDownload = (journal: any) => {
    const url = journal.blob.getDirectURL();
    window.open(url, '_blank');
  };

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Journals & Archive</h1>
        <p className="text-lg text-muted-foreground">
          Access our collection of agricultural research journals
        </p>
      </div>

      {currentJournal && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Current Issue</h2>
          <Card className="border-primary/50 shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{currentJournal.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(Number(currentJournal.year), Number(currentJournal.month) - 1).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </CardDescription>
                </div>
                <Badge variant="default">Current</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>{currentJournal.filename}</span>
                  <span>•</span>
                  <span>{(Number(currentJournal.fileSize) / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <Button onClick={() => handleDownload(currentJournal)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Archive</h2>
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading journals...</p>
          </div>
        ) : yearJournals && yearJournals.length > 0 ? (
          <div className="grid gap-4">
            {yearJournals.map((journal) => (
              <Card key={Number(journal.id)} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{journal.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(Number(journal.year), Number(journal.month) - 1).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span>{journal.filename}</span>
                      <span>•</span>
                      <span>{(Number(journal.fileSize) / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleDownload(journal)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No journals available for {selectedYear}</p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
