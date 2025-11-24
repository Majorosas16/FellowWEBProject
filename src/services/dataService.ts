// Devuelve la fecha actual en formato YYYY-MM-DD
export const getToday = (): string => {
  return new Date().toISOString().split("T")[0];
};
