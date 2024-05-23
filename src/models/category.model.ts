export interface Category {
  id: string;
  title: string;
}

export interface SubCategory {
  id: string;
  title: string;
  main_category: Category;
}

export interface CategoryCreate {
  title: string;
}

export interface SubCategoryCreate {
  title: string;
}
