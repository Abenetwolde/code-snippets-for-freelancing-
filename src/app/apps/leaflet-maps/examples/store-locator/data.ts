export interface Store {
  id: number;
  name: string;
  lat: number;
  lng: number;
  address: string;
  hours: string;
  contact: string;
}

export const stores: Store[] = [
  {
      id: 1,
      name: "Store A",
      lat: 9.0301,
      lng: 38.7613,
      address: "123 Addis St, Addis Ababa",
      hours: "9 AM - 6 PM",
      contact: "phone: +251 11 123 4567",
  },
  {
      id: 2,
      name: "Store B",
      lat: 9.0370,
      lng: 38.7616,
      address: "456 Meskel Sq, Addis Ababa",
      hours: "10 AM - 7 PM",
      contact: "phone: +251 11 765 4321",
  },
  {
      id: 3,
      name: "Store C",
      lat: 9.0221,
      lng: 38.7500,
      address: "789 Bole Ave, Addis Ababa",
      hours: "8 AM - 5 PM",
      contact: "phone: +251 11 555 5555",
  },
];
