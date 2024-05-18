import { Category, SubCategory } from "./category.model";
import { Status } from "./status.enum";

export interface Task {
  id: number;
  start: Date;
  end: Date;
  title: string;
  description: string;
  main_category: Category;
  sub_category: SubCategory;
  status: Status;
  color: string;
  created_at: Date;
  updated_at?: Date;
}

export interface TaskCreate {
  start: Date;
  end: Date;
  title: string;
  description: string;
  main_category: number;
  sub_category: number;
  status: Status;
  color: string;
}
