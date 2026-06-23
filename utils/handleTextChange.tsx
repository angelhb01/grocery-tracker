// Ensure input is numerical
export default function handleTextChange(text: string) {
  let numericValue = text.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
  return numericValue;
}
