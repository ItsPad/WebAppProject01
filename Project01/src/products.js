const CATS = [
  {
    "id": "all",
    "label": "ทั้งหมด"
  },
  {
    "id": "ignition",
    "label": "ระบบจุดระเบิด"
  },
  {
    "id": "oil",
    "label": "ออยล์เพลท"
  },
  {
    "id": "turbo",
    "label": "เทอร์โบ"
  },
  {
    "id": "exhaust",
    "label": "ท่อไอเสีย"
  }
];
const PRODUCTS = [
  {
    "id": 2,
    "name": "D650 0003",
    "cat": "ignition",
    "desc": "ระบบจุดระเบิด • D650 0003",
    "hero": "assets/ignition coil/D650-0003/D650-0003.png",
    "variants": [
      {
        "id": "single",
        "label": "1 ชิ้น",
        "price": 800,
        "img": "assets/ignition coil/D650-0003/D650-0003-1.png"
      },
      {
        "id": "set4",
        "label": "เซ็ท 4 ชิ้น",
        "price": 3000,
        "img": "assets/ignition coil/D650-0003/D650-0003-4.png"
      }
    ]
  },
  {
    "id": 3,
    "name": "D650 0004",
    "cat": "ignition",
    "desc": "ระบบจุดระเบิด • D650 0004",
    "hero": "assets/ignition coil/D650-0004/D650-0004.png",
    "variants": [
      {
        "id": "single",
        "label": "1 ชิ้น",
        "price": 800,
        "img": "assets/ignition coil/D650-0004/D650-0004-1.png"
      },
      {
        "id": "set4",
        "label": "เซ็ท 4 ชิ้น",
        "price": 3000,
        "img": "assets/ignition coil/D650-0004/D650-0004-4.png"
      }
    ]
  },
  {
    "id": 4,
    "name": "Ngk 90654",
    "cat": "ignition",
    "desc": "ระบบจุดระเบิด • Ngk 90654",
    "hero": "assets/ignition coil/ngk 90654/ngk90654.png",
    "variants": [
      {
        "id": "single",
        "label": "1 ชิ้น",
        "price": 800,
        "img": "assets/ignition coil/ngk 90654/ngk90654-1.png"
      },
      {
        "id": "set4",
        "label": "เซ็ท 4 ชิ้น",
        "price": 3000,
        "img": "assets/ignition coil/ngk 90654/ngk90654-4.png"
      }
    ]
  },
  {
    "id": 5,
    "name": "Ngk 96206",
    "cat": "ignition",
    "desc": "ระบบจุดระเบิด • Ngk 96206",
    "hero": "assets/ignition coil/ngk 96206/ngk96206.png",
    "variants": [
      {
        "id": "single",
        "label": "1 ชิ้น",
        "price": 800,
        "img": "assets/ignition coil/ngk 96206/ngk96206-1.png"
      },
      {
        "id": "set4",
        "label": "เซ็ท 4 ชิ้น",
        "price": 3000,
        "img": "assets/ignition coil/ngk 96206/ngk96206-4.png"
      }
    ]
  },
  {
    "id": 6,
    "name": "Ngk 97506",
    "cat": "ignition",
    "desc": "ระบบจุดระเบิด • Ngk 97506",
    "hero": "assets/ignition coil/ngk 97506/ngk97506.png",
    "variants": [
      {
        "id": "single",
        "label": "1 ชิ้น",
        "price": 800,
        "img": "assets/ignition coil/ngk 97506/ngk97506-1.png"
      },
      {
        "id": "set4",
        "label": "เซ็ท 4 ชิ้น",
        "price": 3000,
        "img": "assets/ignition coil/ngk 97506/ngk97506-4.png"
      }
    ]
  },
  {
    "id": 7,
    "name": "Ga",
    "cat": "oil",
    "desc": "ออยล์เพลท • Ga",
    "hero": "assets/oil plate/GA/GA1.png",
    "gallery": [
      "assets/oil plate/GA/GA1.png",
      "assets/oil plate/GA/GA2.png",
      "assets/oil plate/GA/GA3.png",
      "assets/oil plate/GA/GA4.png",
      "assets/oil plate/GA/GA5.png"
    ],
    "price": 2200
  },
  {
    "id": 8,
    "name": "Zf",
    "cat": "oil",
    "desc": "ออยล์เพลท • Zf",
    "hero": "assets/oil plate/ZF/ZF1.png",
    "gallery": [
      "assets/oil plate/ZF/ZF1.png",
      "assets/oil plate/ZF/ZF2.png",
      "assets/oil plate/ZF/ZF3.png",
      "assets/oil plate/ZF/ZF4.png",
      "assets/oil plate/ZF/ZF5.png"
    ],
    "price": 2500
  },
  {
    "id": 9,
    "name": "PDI Turbo",
    "cat": "turbo",
    "desc": "cummins turbo",
    "hero": "assets/turbo/Big Boss Cummins Stage 1 Turbo.png",
    "price": 35000
  },
  {
    "id": 10,
    "name": "DINAN FREE FLOW AXLE-BACK EXHAUST",
    "cat": "exhaust",
    "desc": "สำหรับ M2 2023-2024 G87 เพิ่มแรงม้า: + 6 HP, แรงบิด + 5 LB-FT ",
    "hero": "assets/exhaust/DINAN VALVED M2.png",
    "price": 150000
  },
  {
    "id": 11,
    "name": "DINAN FREE FLOW AXLE-BACK EXHAUST",
    "cat": "exhaust",
    "desc": "2020-2024 BMW M340I/M440I G20 เพิ่มแรงม้า: + 6 HP, แรงบิด + 5 LB-FT ",
    "hero": "assets/exhaust/DINAN M340I.png",
    "price": 120000
  }
];
