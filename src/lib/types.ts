export interface Hospital {
  id: string;
  name: string;
  photo_url: string | null;
  description: string | null;
  about: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
}

export interface Doctor {
  id: string;
  name: string;
  photo_url: string | null;
  hospital_name: string | null;
  hospital_photo_url: string | null;
  created_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
}
