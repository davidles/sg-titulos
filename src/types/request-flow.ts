export interface AvailableTitle {
  idTitle: number;
  titleName: string | null;
  planName: string | null;
  academicProgramName: string | null;
  facultyName: string | null;
  statusName: string | null;
  requestTypeId: number | null;
  requestTypeName: string | null;
}

export interface RequestCreationResponse {
  idRequest: number;
  generatedAt: string | null;
  currentStatus: string | null;
  requestType: {
    idRequestType: number | null;
    requestTypeName: string | null;
  };
  title: {
    idTitle: number;
    titleName: string | null;
  };
  requirements: Array<{
    requirementId: number;
    isRequired: boolean;
  }>;
}

export interface RequestFormDataPerson {
  idPerson: number;
  lastName: string;
  firstName: string;
  documentNumber: string;
  birthDate: string | null;
  nationalityId: number | null;
  birthCityId: number | null;
}

export interface RequestFormDataContact {
  idContact: number;
  mobilePhone: string | null;
  emailAddress: string | null;
}

export interface RequestFormDataGraduate {
  idGraduate: number;
  graduateType: "Civil" | "Militar" | null;
  militaryRankId: number | null;
  forceId: number | null;
}

export interface RequestFormDataAddress {
  idAddress: number;
  street: string | null;
  streetNumber: number | null;
  cityId: number | null;
  city: CityAttributes | null;
  province: ProvinceAttributes | null;
  country: CountryAttributes | null;
}

export interface ForceAttributes {
  idForce: number;
  forceName: string | null;
}

export interface MilitaryRankAttributes {
  idMilitaryRank: number;
  militaryRankName: string | null;
  forceId: number | null;
}

export interface CityAttributes {
  idCity: number;
  cityName: string | null;
  provinceId: number | null;
}

export interface ProvinceAttributes {
  idProvince: number;
  provinceName: string | null;
  countryId: number | null;
}

export interface CountryAttributes {
  idCountry: number;
  countryName: string | null;
}

export interface RequestFormDataCatalogs {
  forces: ForceAttributes[];
  militaryRanks: MilitaryRankAttributes[];
}

export interface RequestFormData {
  person: RequestFormDataPerson;
  contact: RequestFormDataContact | null;
  graduate: RequestFormDataGraduate | null;
  address: RequestFormDataAddress | null;
  catalogs: RequestFormDataCatalogs;
}

export interface UpdateRequestFormPayload {
  person: {
    lastName: string;
    firstName: string;
    documentNumber: string;
    birthDate: string | null;
    nationalityId: number | null;
    birthCityId: number | null;
  };
  contact: {
    mobilePhone: string | null;
    emailAddress: string | null;
  } | null;
  graduate: {
    graduateType: "Civil" | "Militar" | null;
    militaryRankId: number | null;
    forceId: number | null;
  } | null;
  address: {
    street: string | null;
    streetNumber: number | null;
    cityId: number | null;
  } | null;
}

export interface RequirementInstanceAttributes {
  idRequestRequirementInstance: number;
  requestId: number | null;
  requirementId: number | null;
  completedByUserId: number | null;
  completedAt: string | null;
  verifiedByUserId: number | null;
  verifiedAt: string | null;
  currentRequirementStatusId: number | null;
  complianceVersion: number | null;
  reviewReason: string | null;
  requirementFilePath: string | null;
}

export interface RequirementAttributes {
  idRequirement: number;
  requirementName: string | null;
  requirementDescription: string | null;
}

export interface RequirementStatusAttributes {
  idRequirementInstanceStatus: number;
  requirementInstanceStatusName: string | null;
}

export interface RequestRequirementItem {
  requirementInstance: RequirementInstanceAttributes;
  requirement: RequirementAttributes | null;
  status: RequirementStatusAttributes | null;
}
