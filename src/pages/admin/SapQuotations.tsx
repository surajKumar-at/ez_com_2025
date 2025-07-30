import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search, Filter, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { sapQuotationService } from '@/services/sapQuotationService';
import { SapQuotationDto, SapQuotationRequestDto } from '@/lib/dto/sapQuotation.dto';

const SapQuotations: React.FC = () => {
  const { t } = useTranslation();
  const [quotations, setQuotations] = useState<SapQuotationDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);
  
  // Edge Function URL - user will need to provide this
  const [edgeFunctionUrl, setEdgeFunctionUrl] = useState('');
  
  // Filters
  const [soldToParty, setSoldToParty] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSearch = async () => {
    if (!edgeFunctionUrl) {
      toast({
        title: "Error",
        description: "Please provide the Edge Function URL",
        variant: "destructive"
      });
      return;
    }

    if (!soldToParty) {
      toast({
        title: "Error", 
        description: "Please provide a Sold To Party ID",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const request: SapQuotationRequestDto = {
        sapSoldToId: soldToParty,
        skip: (currentPage - 1) * pageSize,
        top: pageSize,
        countOnly: false,
        ...(statusFilter && { statusFilter }),
        ...(startDate && endDate && {
          dateFilter: {
            startDate,
            endDate
          }
        })
      };

      const response = await sapQuotationService.getQuotations(request, edgeFunctionUrl);
      setQuotations(response.d.results);
      setTotalCount(response.totalCount);
      
      toast({
        title: "Success",
        description: `Found ${response.totalCount} quotations`
      });
    } catch (error: any) {
      console.error('Error fetching quotations:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch quotations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (edgeFunctionUrl && soldToParty) {
      handleSearch();
    }
  }, [currentPage]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Open':
        return 'default';
      case 'In Process':
        return 'secondary';
      case 'Completed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('sapQuotations.title')}</h1>
      </div>

      {/* Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            {t('sapQuotations.configuration')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edgeFunction">{t('sapQuotations.edgeFunctionUrl')}</Label>
              <Input
                id="edgeFunction"
                placeholder="https://your-project.supabase.co/functions/v1/your-function"
                value={edgeFunctionUrl}
                onChange={(e) => setEdgeFunctionUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="soldToParty">{t('sapQuotations.soldToParty')}</Label>
              <Input
                id="soldToParty"
                placeholder="Enter Sold To Party ID"
                value={soldToParty}
                onChange={(e) => setSoldToParty(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {t('sapQuotations.filters')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">{t('sapQuotations.status')}</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Process">In Process</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">{t('sapQuotations.startDate')}</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">{t('sapQuotations.endDate')}</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleSearch} disabled={loading} className="w-full md:w-auto">
            {loading ? 'Loading...' : t('sapQuotations.search')}
          </Button>
        </CardContent>
      </Card>

      {/* Results Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t('sapQuotations.results')} {totalCount > 0 && `(${totalCount} total)`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {quotations.length > 0 ? (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('sapQuotations.salesQuotation')}</TableHead>
                      <TableHead>{t('sapQuotations.creationDate')}</TableHead>
                      <TableHead>{t('sapQuotations.soldToParty')}</TableHead>
                      <TableHead className="text-right">{t('sapQuotations.totalNetAmount')}</TableHead>
                      <TableHead>{t('sapQuotations.currency')}</TableHead>
                      <TableHead>{t('sapQuotations.salesOrganization')}</TableHead>
                      <TableHead>{t('sapQuotations.status')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotations.map((quotation, index) => (
                      <TableRow key={`${quotation.SalesQuotation}-${index}`}>
                        <TableCell className="font-medium">{quotation.SalesQuotation}</TableCell>
                        <TableCell>{new Date(quotation.CreationDate).toLocaleDateString()}</TableCell>
                        <TableCell>{quotation.SoldToParty}</TableCell>
                        <TableCell className="text-right">
                          {new Intl.NumberFormat('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }).format(quotation.TotalNetAmount)}
                        </TableCell>
                        <TableCell>{quotation.TransactionCurrency}</TableCell>
                        <TableCell>{quotation.SalesOrganization}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(quotation.OverallSDProcessStatus)}>
                            {quotation.OverallSDProcessStatus}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => handlePageChange(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                          className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {loading ? 'Loading quotations...' : 'No quotations found. Configure your settings and search.'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SapQuotations;