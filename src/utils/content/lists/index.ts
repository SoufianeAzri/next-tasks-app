import { Periorite } from "@/utils/types";

export const tasksViewList = [
  {
    _id: 0,
    title: "Apercu Kanban",
    value: "kanban",
  },
  {
    _id: 1,
    title: "Apercu Backlog",
    value: "backlog",
  },
];

export const roles = [
  {
    id: 0,
    name: "Adminstrateur",
    value: "ADMIN",
  },
  {
    id: 1,
    name: "Employee",
    value: "EMPLOYEE",
  },
  {
    id: 2,
    name: "Manager",
    value: "MANAGER",
  },
];

export const states = [
  {
    _id: 0,
    title: "In Progress",
  },
  {
    _id: 1,
    title: "Finished",
  },
];

export const periorities: Periorite[] = [
  {
    _id: 0,
    periorite: "HAUT",
    value: "Haut",
    color: "#FF4040",
  },
  {
    _id: 1,
    periorite: "MOYENNE",
    value: "Moyene",
    color: "#FF6B01",
  },
  {
    _id: 2,
    periorite: "BAS",
    value: "Bas",
    color: "#00DD69",
  },
];

export const activityTypes = [
  {
    type: 1,
    isUpdate: true,
    item: "Titre",
    action: "a été modifié",
  },
  {
    type: 2,
    isUpdate: true,
    item: "Priorité",
    action: "a été modifiée",
  },
  {
    type: 3,
    isUpdate: true,
    item: "État",
    action: "a été modifié",
  },
  {
    type: 4,
    isUpdate: true,
    item: "Description",
    action: "a été modifiée",
  },
  {
    type: 10,
    isUpdate: false,
    item: "Tâche",
    action: "a été ajoutée",
  },
  {
    type: 11,
    isUpdate: false,
    item: "Tâche",
    action: "a été supprimée",
  },
];

export const frenchDays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
export const frenchMonths = [
  "Janvier ",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Aout",
  "Septembre ",
  "Octobre",
  "Novembre",
  "Décembre",
];
