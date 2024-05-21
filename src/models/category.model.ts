export interface Category {
  id: number;
  title: string;
}

export interface SubCategory {
  id: number;
  title: string;
  main_category: Category;
}

export interface CategoryCreate {
  title: string;
}

export interface SubCategoryCreate {
  title: string;
}
