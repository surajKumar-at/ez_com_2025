export interface SapQuotationDto {
  SalesQuotation: string;
  CreationDate: string;
  SoldToParty: string;
  TotalNetAmount: number;
  TransactionCurrency: string;
  SalesOrganization: string;
  OverallSDProcessStatus: string;
}

export interface SapQuotationRequestDto {
  sapSoldToId: string;
  skip: number;
  top: number;
  countOnly: boolean;
  statusFilter?: string;
  dateFilter?: {
    startDate: string;
    endDate: string;
  };
}

export interface SapQuotationResponseDto {
  d: {
    results: SapQuotationDto[];
  };
  totalCount: number;
  pagination: {
    skip: number;
    top: number;
    totalCount: number;
  };
}