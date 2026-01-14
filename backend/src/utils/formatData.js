export function dataHoje() {
  return new Date().toISOString().split("T")[0];
}
