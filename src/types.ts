export interface User {
  id?: any;
  name: string;
  lastname: string;
  fullname: string;
  email: string;
  username: string;
  password?: string;
  roles?: string[];
  profileImage?: Image | string;
  deviceToken?: string;
}

export interface Role {
  id?: any;
  name: string;
}

export interface Availability {
  id?: any;
  user: string | User;
  available: boolean;
}

export interface Chat {
  id?: any;
  createdAt: Date;
  expiredAt: Date;
  active: boolean;
  expired: boolean;
  user: string | User;
  supportUser: string | User;
}

export interface ChatMessage {
  id?: any;
  chat: string | Chat;
  createdAt: Date;
  sender: string | User;
  content: string;
}

export interface Image {
  name: string,
  extension: string
}

export interface Commerce {
  id?: any;
  name: string;
  tinNumber: string;
  logoImage: Image | string;
  priority: CommercePriority | string;
  geoLocation: GeoLocation;
}


export interface CommercePriority {
  id?: any;
  name: string;
  color: string;
}

export interface Subsidiary {
  id?: any;
  name: string;
  address: string;
  personInCharge: User | string;
  commerce: Commerce | string;
}

export interface GeoLocation {
  lat: number;
  lon: number;
}

export interface Issue {
  id?: any;
  name: string;
}

export interface Service {
  id?: any;
  status: string;
  creationComments: string;
  subsidiary: Subsidiary | string;
  issues: Issue[] | string[];
  active: boolean;
  technician?: User | string;
  scheduledTime?: Date;
  startedData?: {
    devicesToMaintain: string[];
    technicianComments: string;
  },
  finishedData?: {
    installedDevices: string[];
    retiredDevices: string[];
  }
}
