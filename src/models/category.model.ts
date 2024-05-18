export interface Category {
  id: number;
  title: string;
  created_at: Date;
  updated_at?: Date;
}

export interface SubCategory {
  id: number;
  title: string;
  main_category: Category;
  created_at: Date;
  updated_at?: Date;
}
