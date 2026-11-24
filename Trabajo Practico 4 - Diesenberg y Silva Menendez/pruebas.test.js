import { test } from 'node:test';
import assert from 'node:assert/strict';

// 1. Ejemplo de función para calcular el total de un carrito o pedido
function calcularTotal(precio, cantidad) {
  return precio * cantidad;
}

// 2. Ejemplo de función para validar que un campo no esté vacío
function validarTexto(texto) {
  return typeof texto === 'string' && texto.trim().length > 0;
}

test('calcularTotal multiplica correctamente precio por cantidad', () => {
  assert.strictEqual(calcularTotal(1500, 3), 4500);
});

test('validarTexto devuelve true para texto válido y false para vacío', () => {
  assert.strictEqual(validarTexto('Producto'), true);
  assert.strictEqual(validarTexto('   '), false);
});
