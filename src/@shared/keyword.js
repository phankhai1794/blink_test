export const SHIPPER = 'shipper';

export const CONSIGNEE = 'consignee';

export const NOTIFY = 'notify';

export const EXPORT_REF = 'expRef';

export const FORWARDING = 'fwrdrRef';

export const PLACE_OF_RECEIPT = 'por';

export const PORT_OF_LOADING = 'pol';

export const PORT_OF_DISCHARGE = 'pod';

export const PLACE_OF_DELIVERY = 'del';

export const FINAL_DESTINATION = 'des';

export const VESSEL_VOYAGE = 'vvd';

export const PRE_CARRIAGE = 'preVvd';

export const TYPE_OF_MOVEMENT = 'moveTypeDesc';

export const CONTAINER_DETAIL = 'containerDetail';

export const CONTAINER_NUMBER = 'Container No.';

export const CONTAINER_SEAL = 'Container Seal No.';

export const CONTAINER_TYPE = 'Container Type';

export const CONTAINER_PACKAGE = 'Number of Packages';

export const CONTAINER_PACKAGE_UNIT = 'Package Type';

export const CONTAINER_WEIGHT = 'Gross Weight';

export const CONTAINER_WEIGHT_UNIT = 'Container Weight Unit';

export const CONTAINER_MEASUREMENT = 'Gross Measurement';

export const CONTAINER_MEASUREMENT_UNIT = 'Container Measurement Unit';

export const CONTAINER_MANIFEST = 'containerManifest';

export const CM_MARK = 'C/M Mark & Number';

export const CM_PACKAGE = 'C/M Package (Quantity for customs declaration only)';

export const CM_PACKAGE_UNIT = 'C/M Package Type';

export const CM_DESCRIPTION = 'C/M Description of Goods';

export const CM_WEIGHT = 'C/M Gross Weight';

export const CM_WEIGHT_UNIT = 'C/M Weight Unit';

export const CM_MEASUREMENT = 'C/M Gross Measurement';

export const CM_MEASUREMENT_UNIT = 'C/M Measurement Unit';

export const FREIGHT_CHARGES = 'chargesPayableBy';

export const PLACE_OF_BILL = 'billPlaceIssue';

export const FREIGHTED_AS = 'freightedAs';

export const RATE = 'rate';

export const DATE_CARGO = 'dateCargoReceived';

export const DATE_LADEN = 'dateLadenOnBoard';

export const SERVICE_CONTRACT_NO = 'contractNo';

export const DOC_FORM_NO = 'docFormNo';

export const COMMODITY_CODE = 'commodityCd';

export const EXCHANGE_RATE = 'exchangeRate';

export const CODE = 'blCode';

export const TARIFF_ITEM = 'tariffItem';

export const PREPAID = 'prepaid';

export const COLLECT = 'collect';

export const DATED = 'dated';

export const VVD_CODE = 'vvdCode';

export const POD_CODE = 'podCode';

export const DEL_CODE = 'delCode';

export const CONTAINER_LIST = {
  cd: [CONTAINER_NUMBER, CONTAINER_SEAL, CONTAINER_TYPE, CONTAINER_PACKAGE, CONTAINER_WEIGHT, CONTAINER_MEASUREMENT],
  cm: [CM_MARK, CM_DESCRIPTION, CM_PACKAGE, CM_WEIGHT, CM_MEASUREMENT],
  cdNumber: [CONTAINER_PACKAGE, CONTAINER_WEIGHT, CONTAINER_MEASUREMENT],
  cdUnit: [CONTAINER_PACKAGE_UNIT, CONTAINER_WEIGHT_UNIT, CONTAINER_MEASUREMENT_UNIT],
  cmNumber: [CM_PACKAGE, CM_WEIGHT, CM_MEASUREMENT],
  cmUnit: [CM_WEIGHT_UNIT, CM_PACKAGE_UNIT, CM_MEASUREMENT_UNIT],
  numberList: [CM_PACKAGE, CM_WEIGHT, CM_MEASUREMENT, CONTAINER_PACKAGE, CONTAINER_MEASUREMENT, CONTAINER_WEIGHT]
} 