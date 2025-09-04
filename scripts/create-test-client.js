import 'dotenv/config';
import { init, createClient } from '../apps/crm/db.js';

async function createTestClient() {
  await init();
  
  try {
    const client = await createClient({
      phone: '3001234567',
      password: '123456',
      first_name: 'Usuario',
      last_name: 'Prueba',
      email: 'test@example.com'
    });
    
    console.log('Cliente de prueba creado:', client);
    console.log('');
    console.log('Puedes usar estas credenciales para probar el login:');
    console.log('Teléfono: 3001234567');
    console.log('Contraseña: 123456');
  } catch (e) {
    if (e.message.includes('duplicate') || e.message.includes('already exists')) {
      console.log('El cliente de prueba ya existe:');
      console.log('Teléfono: 3001234567');
      console.log('Contraseña: 123456');
    } else {
      console.error('Error creando cliente:', e);
    }
  }
  
  process.exit(0);
}

createTestClient();
