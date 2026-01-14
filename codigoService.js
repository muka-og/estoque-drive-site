import { v4 as uuid } from "uuid";

export function gerarCodigo() {
  return `PED-${uuid().slice(0, 8).toUpperCase()}`;
}
