import AddressDto from './address.dto';
import PersonDto from './person.dto';

export default class FinancialAssistApplicationDto {
  incomeLine236: number;
  ageOver65: boolean;
  hasSpouseOrCommonLaw:boolean;
  spouseAgeOver65:boolean;
  spouseIncomeLine236:number;
  childrenCount:number;
  claimedChildCareExpense_line214:number;
  reportedUCCBenefit_line117:number;
  selfDisabilityCredit:boolean;
  spouseEligibleForDisabilityCredit:boolean;
  spouseDSPAmount_line125:number;

  phoneNumber:string;
  mailingAddress = new AddressDto();
  residentialAddress = new AddressDto();

  applicant:PersonDto = new PersonDto();
  spouse:PersonDto = new PersonDto();

}