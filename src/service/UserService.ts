import { BaseService } from "./BaseService";

export class UserService implements BaseService<{ name: string }>{
  add!: (obj: Partial<{ name: string; }>) => number;
  delete!: (obj: Partial<{ name: string; }>) => number;
  update!: (obj: Partial<{ name: string; }>) => number;
  select!: (obj: Partial<{ name: string; }>) => { name: string; };
  addObjs!: (objs: Partial<{ name: string; }>[]) => number;
  deleteObjs!: (objs: Partial<{ name: string; }>[]) => number;
  updateObjs!: (objs: Partial<{ name: string; }>[]) => number;
  selectObjs!: (objs: Partial<{ name: string; }>[]) => { name: string; }[];

}

