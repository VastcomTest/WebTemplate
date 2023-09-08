export interface BaseService<T> {

  add: (obj: Partial<T>) => number;

  delete: (obj: Partial<T>) => number;

  update: (obj: Partial<T>) => number;

  select: (obj: Partial<T>) => T;

  addObjs: (objs: Partial<T>[]) => number;

  deleteObjs: (objs: Partial<T>[]) => number;

  updateObjs: (objs: Partial<T>[]) => number;

  selectObjs: (objs: Partial<T>[]) => T[];


}
