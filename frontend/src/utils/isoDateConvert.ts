export const isoDateConvert = (inputDate: string | undefined) => {
  if (inputDate) {
    const [y, m, d] = inputDate.split("-");
    return `${d}/${m}/${y}`;
  }
}