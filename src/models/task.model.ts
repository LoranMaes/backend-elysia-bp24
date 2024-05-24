export interface Task {
  id: string;
  userId: string;
  start: Date;
  end: Date;
  title: string;
  description?: string | null;
  categoryId: string;
  subCategoryId?: string | null;
  status: string;
  color: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export interface TaskCreate {
  start: string;
  end: string;
  title: string;
  description?: string | null;
  categoryId: string;
  subCategoryId?: string | null;
  color: string;
}