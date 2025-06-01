export interface Template {
  id: string;
  name: string;
  description: string;
  tags: string[];
  thumbnail?: string;
  structure: {
    formName: string;
    sections: Array<{
      id: string;
      title: string;
      fields: Array<{
        id: string;
        type: string;
        label: string;
        required?: boolean;
        placeholder?: string;
        options?: Array<{ key: string; value: any }>;
      }>;
    }>;
  };
  isPopular?: boolean;
  estimatedTime?: string;
}