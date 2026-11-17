import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(prefix: string): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomNum}`;
}

export function formatDate(dateString?: string): string {
  if (!dateString) return "N/A";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateTimeString?: string): string {
  if (!dateTimeString) return "N/A";
  try {
    const d = new Date(dateTimeString);
    if (isNaN(d.getTime())) return dateTimeString;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateTimeString;
  }
}

export function formatINR(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return "₹0";
  
  // Format in Indian currency notation (Lakhs & Crores)
  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(2);
    return `₹${parseFloat(cr)} Cr`;
  } else if (amount >= 100000) {
    const lk = (amount / 100000).toFixed(2);
    return `₹${parseFloat(lk)} L`;
  } else {
    return `₹${amount.toLocaleString("en-IN")}`;
  }
}

export function formatFullINR(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return "₹0";
  return `₹${amount.toLocaleString("en-IN")}`;
}
