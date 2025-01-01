type ClassValue = string | number | boolean | undefined | null;
type ClassArray = ClassValue[];
type ClassDictionary = Record<string, any>;
type ClassInput = ClassValue | ClassArray | ClassDictionary;

export function cn(...inputs: ClassInput[]): string {
  const classes = inputs.filter(Boolean).join(' ');
  return classes;
}