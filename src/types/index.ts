export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  preferences?: string[];
}

export interface Vendor {
  id: string;
  name: string;
  profile: string;
  description: string;
  address: string;
  contact_number: string;
  rating: string;
  foodType: string;
  images: string[];
  menu: string[];
  reviews: Review[];
}

export interface Review {
  id: string;
  user_id: string;
  name: string;
  profile: string;
  rating: number;
  review: string;
  created: string;
  reviewImages?: string[];
}

export interface VendorPageProps {
  vendor: Vendor;
}