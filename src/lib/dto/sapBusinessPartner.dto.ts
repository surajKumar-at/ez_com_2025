import { z } from 'zod';

export const SapBusinessPartnerRequestSchema = z.object({
  soldTo: z.string().min(1, 'Sold To is required'),
  salesOrg: z.string().optional(),
  division: z.string().optional(),
  distributionChannel: z.string().optional(),
});

export const SapBusinessPartnerAddressSchema = z.object({
  BusinessPartner: z.string().optional(),
  AddressID: z.string().optional(),
  ValidityStartDate: z.string().optional(),
  ValidityEndDate: z.string().optional(),
  AuthorizationGroup: z.string().optional(),
  AddressUUID: z.string().optional(),
  AdditionalStreetPrefixName: z.string().optional(),
  AdditionalStreetSuffixName: z.string().optional(),
  AddressTimeZone: z.string().optional(),
  CareOfName: z.string().optional(),
  CityCode: z.string().optional(),
  CityName: z.string().optional(),
  CompanyPostalCode: z.string().optional(),
  Country: z.string().optional(),
  County: z.string().optional(),
  DeliveryServiceNumber: z.string().optional(),
  DeliveryServiceTypeCode: z.string().optional(),
  District: z.string().optional(),
  FormOfAddress: z.string().optional(),
  FullName: z.string().optional(),
  HomeCityName: z.string().optional(),
  HouseNumber: z.string().optional(),
  HouseNumberSupplementText: z.string().optional(),
  Language: z.string().optional(),
  POBox: z.string().optional(),
  POBoxDeviatingCityName: z.string().optional(),
  POBoxDeviatingCountry: z.string().optional(),
  POBoxDeviatingRegion: z.string().optional(),
  POBoxIsWithoutNumber: z.boolean().optional(),
  POBoxLobbyName: z.string().optional(),
  POBoxPostalCode: z.string().optional(),
  Person: z.string().optional(),
  PostalCode: z.string().optional(),
  PrfrdCommMediumType: z.string().optional(),
  Region: z.string().optional(),
  StreetName: z.string().optional(),
  StreetPrefixName: z.string().optional(),
  StreetSuffixName: z.string().optional(),
  TaxJurisdiction: z.string().optional(),
  TransportZone: z.string().optional(),
  AddressIDByExternalSystem: z.string().optional(),
  CountyCode: z.string().optional(),
  TownshipCode: z.string().optional(),
  TownshipName: z.string().optional(),
});

export const SapBusinessPartnerResultSchema = z.object({
  BusinessPartnerFullName: z.string().optional(),
  to_BusinessPartnerAddress: z.object({
    results: z.array(SapBusinessPartnerAddressSchema)
  }).optional(),
});

export const SapBusinessPartnerResponseSchema = z.object({
  d: z.object({
    results: z.array(SapBusinessPartnerResultSchema)
  })
});

export type SapBusinessPartnerRequest = z.infer<typeof SapBusinessPartnerRequestSchema>;
export type SapBusinessPartnerAddress = z.infer<typeof SapBusinessPartnerAddressSchema>;
export type SapBusinessPartnerResult = z.infer<typeof SapBusinessPartnerResultSchema>;
export type SapBusinessPartnerResponse = z.infer<typeof SapBusinessPartnerResponseSchema>;