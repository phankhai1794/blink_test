export const BOOKING_NO = 'bkgNo';

export const BL_TYPE = 'blType';

export const ORIGINAL_BL = 'Original B/L';

export const SEAWAY_BILL = 'Sea WayBill';

export const SHIPPER = 'shipper';

export const SHIPPER_NAME = 'shipperName';

export const CONSIGNEE = 'consignee';

export const NOTIFY = 'notify';

export const ALSO_NOTIFY = 'alsoNotify';

export const FORWARDER = 'forwarder';

export const EXPORT_REF = 'expRef';

export const FORWARDING = 'fwrdrRef';

export const PLACE_OF_RECEIPT = 'por';

export const PORT_OF_LOADING = 'pol';

export const PORT_OF_DISCHARGE = 'pod';

export const PLACE_OF_DELIVERY = 'del';

export const FINAL_DESTINATION = 'des';

export const VESSEL_VOYAGE = 'vvd';

export const VESSEL_VOYAGE_CODE = 'vvdCode';

export const T_VVD = 'tvvd';

export const PRE_CARRIAGE = 'preVvd';

export const PRE_CARRIAGE_CODE = 'preVvdCode';

export const TYPE_OF_MOVEMENT = 'moveTypeDesc';

export const RD_TERMS = 'rdTerms';

export const SHIPPING_MARK = 'shippingMark';

export const DESCRIPTION_OF_GOODS1 = 'cargoDescription1';

export const DESCRIPTION_OF_GOODS2 = 'cargoDescription2';

export const DESCRIPTION_OF_GOODS = 'cargoDescription';

export const TOTAL_PACKAGE = 'totalPackages';

export const TOTAL_PACKAGE_UNIT = 'totalPackageUnit';

export const TOTAL_WEIGHT = 'totalWeight';

export const TOTAL_WEIGHT_UNIT = 'totalWeightUnit';

export const TOTAL_MEASUREMENT = 'totalMeasurement';

export const TOTAL_MEASUREMENT_UNIT = 'totalMeasurementUnit';

export const CONTAINER_DETAIL = 'containerDetail';

export const CONTAINER_NUMBER = 'Container No.';

export const CONTAINER_PACKAGE_NAME = 'Package Name';

export const CONTAINER_SEAL = 'Container Seal No.';

export const CONTAINER_TYPE = 'Container Type';

export const CONTAINER_PACKAGE = 'Number of Packages';

export const CONTAINER_PACKAGE_UNIT = 'Package Type';

export const CONTAINER_WEIGHT = 'Gross Weight';

export const CONTAINER_WEIGHT_UNIT = 'Container Weight Unit';

export const CONTAINER_MEASUREMENT = 'Gross Measurement';

export const CONTAINER_MEASUREMENT_UNIT = 'Container Measurement Unit';

export const CONTAINER_MANIFEST = 'containerManifest';

export const CD_MOVE_TYPE = 'CD Movement Type';

export const CM_MARK = 'C/M Marks & Numbers';

export const CM_PACKAGE = 'C/M Package (Quantity for customs declaration only)';

export const CM_PACKAGE_NAME = 'C/M Package Name';

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

export const POD_CODE = 'podCode';

export const DEL_CODE = 'delCode';

export const HS_CODE = 'HS Code';

export const HTS_CODE = 'HTS Code';

export const NCM_CODE = 'NCM Code';

export const SEQ = 'Seq';

export const BL_PRINT_COUNT = 'blPrintCount';

export const FREIGHT_TERM = 'freightTerm';

export const OTHERS = 'Others (Free Text)';

export const ONLY_ATT = 'Please refer to the attached file for your reference.';

export const NO_CONTENT_AMENDMENT = '';

export const HS_HTS_NCM_Code = 'HS/HTS/NCM Code';

export const EVENT_DATE = 'Event Date';

export const TOTAL_CONTAINERS = 'Total Containers';

export const HAZ_REF_OOG = 'HAZ/REF OOG';

export const EQUIPMENT_SUB = 'Equipment Sub';

export const CONTAINER_INF_MISMATCH = 'Container Information Mismatch';

export const CONTAINER_STATUS_INQ = 'Container Status Inquiry';

export const TOTAL_CONTAINERS_PER_TP_SZ = 'Total Containers per TP/SZ';

export const SPECIAL_CARGO_DETAIL = 'Special Cargo Detail';

export const MISSING_GATE_IN_EVENTS = 'Missing Gate In Events';

export const MISMATCH_DRAIN = 'Mismatch Drain';

export const VOLUME_DIFFRENCE = 'Volume Diffrence';

export const CTNR_NOT_LINK_IN_BOOKING = 'CTNR Not Linked In Booking';

export const MISSING_PACKAGING_GROUP = 'Missing/Mismatch Packaging Group';

export const MISSING_TEMPERATURE = 'Missing Temperature';

export const VENTILATION_MISMATCH = 'Ventilation Mismatch';

export const MISSING_PACKAGE_INFORMATION = 'Missing Package Information';

export const MISSING_MISMATCH_UN = 'Missing/Mismatch UN';

export const MISSING_MISMATCH_IMDG = 'Missing/Mismatch IMDG';

export const VOLUME_DIFFERENCE = 'Volume Difference';

export const SPECIAL_CARGO = 'Special Cargo';

export const CM_CUSTOMS_DESCRIPTION = 'C/M Customs Description';

export const TOTAL_PREPAID = 'totalPrepaid';

export const RATING_DETAIL = 'ratingDetail';

export const REMARKS = 'remarks';

export const ETD = 'etd';

export const BL_COPY = 'blCopy';

export const TYPE_OF_ONBOARD = 'typeOfOnboard';

export const CONTAINER_LIST = {
  cd: [CONTAINER_NUMBER, CONTAINER_TYPE, CONTAINER_SEAL, CONTAINER_PACKAGE, CONTAINER_WEIGHT, CONTAINER_MEASUREMENT],
  cm: [CM_PACKAGE, CM_WEIGHT, CM_MEASUREMENT, CM_MARK, CM_DESCRIPTION, HTS_CODE, HS_CODE, NCM_CODE],
  cdNumber: [CONTAINER_PACKAGE, CONTAINER_WEIGHT, CONTAINER_MEASUREMENT],
  cdUnit: [CONTAINER_PACKAGE_UNIT, CONTAINER_WEIGHT_UNIT, CONTAINER_MEASUREMENT_UNIT],
  cmNumber: [CM_PACKAGE, CM_WEIGHT, CM_MEASUREMENT],
  cmUnit: [CM_PACKAGE_UNIT, CM_WEIGHT_UNIT, CM_MEASUREMENT_UNIT],
  totalNumber: [TOTAL_PACKAGE, TOTAL_WEIGHT, TOTAL_MEASUREMENT],
  totalUnit: [TOTAL_PACKAGE_UNIT, TOTAL_WEIGHT_UNIT, TOTAL_MEASUREMENT_UNIT],
  cdMap: [CONTAINER_PACKAGE_NAME, CONTAINER_PACKAGE, CONTAINER_PACKAGE_UNIT, CONTAINER_WEIGHT_UNIT, CONTAINER_MEASUREMENT, CONTAINER_NUMBER, CONTAINER_TYPE, CONTAINER_SEAL, CONTAINER_MEASUREMENT_UNIT, CONTAINER_WEIGHT],
  cmMap: [CM_WEIGHT_UNIT, CM_PACKAGE_NAME, CM_WEIGHT, HS_CODE, SEQ, CM_MEASUREMENT, CM_MARK, CM_MEASUREMENT_UNIT, CONTAINER_NUMBER, NCM_CODE, HTS_CODE, CM_PACKAGE_UNIT, CM_PACKAGE, CM_DESCRIPTION],
}

export const mapUnit = {
  [CM_PACKAGE]: CM_PACKAGE_UNIT,
  [CM_WEIGHT]: CM_WEIGHT_UNIT,
  [CM_MEASUREMENT]: CM_MEASUREMENT_UNIT,
  [CONTAINER_PACKAGE]: CONTAINER_PACKAGE_UNIT,
  [CONTAINER_WEIGHT]: CONTAINER_WEIGHT_UNIT,
  [CONTAINER_MEASUREMENT]: CONTAINER_MEASUREMENT_UNIT
}

export const mapperBlinkStatus = {
  BC: "Draft of Inquiry Created",
  BX: "<<Blank>>",
  BI: "BL Inquired",
  BK: "Reply from Customer",
  BO: "Reply from Onshore",
  BR: "BL Inquiry Resolved",
  BD: "BL Draft Sent",
  BM: "BL Confirm by Customer",
  BA: "Customer Amendment Request",
  BQ: "Offshore Amendment Inquiry",
  BP: "Customer Amendment Reply",
  BS: "BL Amendment Success",
  BF: "BL Amendment Fail"
};

export const mapperBlinkStatusCustomer = {
  'IN_QUEUE': 'In Queue',
  'PENDING': 'Pending',
  'COMPLETED': 'Completed',
  'BLANK': '<<Blank>>'
};

export const BROADCAST = {
  LOGOUT: 'LOGOUT'
};

export const BLANK = '<<Blank>>'