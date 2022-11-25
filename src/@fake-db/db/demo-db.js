import mock from '../mock';
import _ from '@lodash';

const employeeDB = [
  {
    id: 'employee1',
    name: 'Nhi',
    address: 'abc, vn',
    position: 'customer services'
  },
  {
    id: 'employee2',
    name: 'Thi',
    address: 'abc, vn',
    position: 'customer services'
  },
  {
    id: 'employee3',
    name: 'vinh',
    address: 'abc, vn',
    position: 'Sales'
  },
  {
    id: 'employee4',
    name: 'phong',
    address: 'abc, vn',
    position: 'Ops'
  }
];

const bookingDB = {
  booking: [
    {
      orderId: 'IS1907013',
      saleBy: employeeDB[ 0 ],
      cusSer: employeeDB[ 1 ],
      opSer: employeeDB[ 3 ],
      bkgInfo: {
        preCarrNm: 'Pre-Carriage',
        vslNm: 'Vessel Name',
        voyNm: 'Voyage',
        pol: 'Port of loading/Air port loading',
        pod: 'Port of discharge/ Air port discharge',
        delNm: 'Place of delivery name',
        mbCd: 'Master bill',
        hbCd: 'House bill code',
        shipperCd: 'Ma so thue cty chuyen hang',
        shipperNm: '',
        shipperAddr: '',
        consigneeCd: 'Ma so thue cty nhan hang',
        consigneeNm: 'Ten cong ty nhan hang',
        consigneeAddr: 'Dia chi cong ty nhan hang',
        notifyCd: 'Ma so thu ben thu 3 lien quan',
        notifyNm: '',
        notifyAddr: '',
        shippingMark: 'Mo ta nhan dien hang hoa',
        desOfGoods: [
          {
            goodsNm: '',
            hsCd: '',
            goodsNW: 'Trong luong net cua hang hoa'
          }
        ],
        demension: '',
        term: 'CY/CY',
        noCtn: 'Number of containers',
        obrdEtdDt: 'Date on Board: 2021-09-19',
        cgoRcvDt: 'Date of arrival: 2021-09-19',
        freight: 'PREPAID/COLLECT',
        poi: 'Place of Issue: Noi phat hanh bill',
        doi: 'Date of issue',
        whNm: 'Warehouse: hang hoa se ve kho nao khi ve VN',
        volume: [
          {
            cntrTpSz: 'D5',
            cntrQty: '1',
            eqCntrTpSz: '',
            eqCntrQty: '0'
          }
        ],
        container: [
          {
            ctnGW: '',
            cntrNo: 'TEMU8836991',
            cntrSealNo: [ 'SGAC64653' ],
            cntrTpsz: [ 'D5' ],
            pkgTp: 'PALLETS',
            pkgQty: '34',
            cntrMf: [
              {
                hsCd: '851020',
                htsCd: '',
                ncmNo: ''
              }
            ]
          }
        ],
        air: {
          // Don hang AIR
          'air': "Issuing Carrier's Agent Name",
        },
        manifest: {
          // using for import
          authCd: 'Ma phan quyen',
          fncDoc: 'Chuc nang chung tu',
          poviaCd: 'Port of via: Ma cang chuyen tai',
          porCd: 'Port of destination/receive code: Ma cang dich',
          polCd: 'Ma cang xep hang',
          podCd: 'Port of discharge code: Ma cang do hang'
        },
        delivery: {
          decCd: 'Declaration code: So to khai',
          decFlw: 'Declaration Flow: Luong to khai',
          nop: 'Number of Plate: So xe',
          shippingAddr: 'Dia chi giao hang',
          cusInfo: 'Thong tin khach hang'
        }
      }
    }
  ]
};

mock.onGet('/api/booking').reply((request) => {
  const response = bookingDB.booking;
  return [ 200, response ];
});
mock.onGet('/api/booking/:bookingId').reply((request) => {
  const { id } = request.params;
  const response = _.find(bookingDB.booking, { id: id });
  return [ 200, response ];
});
