import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { atom } from "recoil";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const predictedState = atom({
  key: "predictedState",
  default: "",
})

export const getFile = atom({
  key: "getfile",
  default: <any>"",
})
