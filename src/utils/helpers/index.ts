import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { frenchDays, frenchMonths } from "../content/lists";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const localeFormatFr = {
  localize: {
    day: (n: number) => frenchDays[n],
    month: (n: number) => frenchMonths[n],
  },
  formatLong: {
    date: () => "mm/dd/yyyy",
  },
};

export function formatDate(dateInput: string | Date | undefined): string {
  if (!dateInput) return "";

  const date = new Date(dateInput);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  const formatted = date.toLocaleDateString("en-US", options);

  const [day, month, year] = formatted.split(" ");
  return `${day.replace(",", "")} ${month} ${year}`;
}

export const numbersFormatter = (num: number): string => {
  if (num === null || num === undefined) return "0";
  return num >= 10 ? num.toString() : `0${num.toString()}`;
};

export const getDaysDifference = (
  date1: Date | string,
  date2: Date | string
): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);


  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());

  const diffMs = Math.abs(utc2 - utc1);
  return Math.floor(diffMs / (1000 * 60 * 60 * 24)); 
};

export const areIdArraysEqual = (arr1: string[], arr2: string[]): boolean => {
  if (arr1?.length !== arr2?.length) return false;
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  if (set1.size !== set2.size) return false;
  for (const id of set1) {
    if (!set2.has(id)) return false;
  }
  return true;
};
