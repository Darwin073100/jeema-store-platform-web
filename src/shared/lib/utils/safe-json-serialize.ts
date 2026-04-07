/**
 * Serializa cualquier instancia T a un string JSON,
 * manejando tipos no soportados nativamente como BigInt.
 */
export function safeJsonSerialize<T>(data: T): string {
  return JSON.stringify(data, (key, value) => {
    // Manejo de BigInt: lo convertimos a string (o number si prefieres)
    if (typeof value === 'bigint') {
      return value.toString();
    }

    // Aquí puedes añadir otros casos especiales, como Set o Map
    if (value instanceof Set) {
      return Array.from(value);
    }

    if (value instanceof Map) {
      return Object.fromEntries(value);
    }

    return value;
  }, 2); // El '2' es para un formato legible (pretty-print)
}