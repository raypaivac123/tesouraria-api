export function limitInputValue(name: string, value: string) {
  if (name === "telefone") {
    return value.slice(0, 15);
  }

  if (name === "cpf") {
    return value.slice(0, 14);
  }

  return value;
}
