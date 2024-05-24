export interface Category {
  id: string;
  title: string;
}

export interface SubCategory {
  id: string;
  title: string;
  categoryId: string;
}

export interface CategoryCreate {
  title: string;
}

export interface SubCategoryCreate {
  categoryId: string;
  title: string;
}
