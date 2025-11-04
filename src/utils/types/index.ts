export interface SidebarLink {
  id: number;
  title: string;
  path: string | "/";
  icon: string;
  name: string;
}

export interface Role {
  id: number | string;
  name: string;
  value: "ADMIN" | "MANAGER" | "EMPLOYEE";
}

export interface State {
  id?: string;
  name: string;
  color?: string;
  order?: number;
  state?: string;
  percentage?: string;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  image?: string;
  addedDate?: string;
  role: "ADMIN" | "MANAGER" | "EMPLOYEE"; 
}

export interface Subtask {
  id?: string;
  title: string;
  taskId: string;
  status?: boolean;
  addedDate?: string;
  lastModified?: string;
  managerId?: string;
  manager?: User;
  teamMembersIds: string[] | [];
  teamMembers?: User[] | [];
}

export interface Task {
  id?: string;
  title: string;
  description: string;
  addedDate?: string; 
  lastModified?: string;
  beginDate: string;
  finishDate: string;
  stateId: string | null;
  managerId: string | null;
  teamMembersIds: string[];
  periorite: string;
  manager?: User;

  state?: State;
  teamMembers?: User[];
  subtasks?: Subtask[];
}

export interface Periorite {
  _id?: number;
  periorite: string;
  color: string;
  value: string;
}

export interface Activity {
  id?: string;
  userId?: string;
  entityId: string;
  entityType?: "TASK";
  entityTitle?: string;
  description: string;
  type: number;
  isOldState: boolean;
  oldState?: string | null;
  newState?: string | null;
  createdAt?: Date;
}
