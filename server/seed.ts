const pool = require('./db.ts')
import bcrypt from 'bcrypt'
// Custom lists of real names, cities, and email domains
const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Donald', 'Sandra', 'Mark', 'Ashley',
  'Paul', 'Kimberly', 'Steven', 'Emily', 'Andrew', 'Donna', 'Kenneth', 'Michelle',
  'Ahmed', 'Fatima', 'Ali', 'Zainab', 'Omar', 'Aisha', 'Youssef', 'Maryam', 'Hassan', 'Noor'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores'
];

const cities = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
  'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
  'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle',
  'Denver', 'Washington', 'Boston', 'El Paso', 'Nashville', 'Detroit', 'Portland',
  'London', 'Berlin', 'Tokyo', 'Paris', 'Dubai', 'Toronto', 'Sydney', 'Cairo'
];

const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'company.org'];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate(): string {
  const start = new Date(2022, 0, 1).getTime();
  const end = new Date().getTime();
  const randomTimestamp = start + Math.random() * (end - start);
  return new Date(randomTimestamp).toISOString().slice(0, 19).replace('T', ' ');
}

async function seedDatabase() {
  let conn;
  try {
    console.log('Connecting to database...');
    conn = await pool.getConnection();

    const batchSize = 5000;
    const totalRecords = 50000;

    console.log('Generating and inserting 50,000 customers...');

    for (let i = 0; i < totalRecords; i += batchSize) {
      const values: (string | boolean)[][] = [];

      for (let j = 0; j < batchSize; j++) {
        const index = i + j + 1;
        const firstName = getRandomItem(firstNames);
        const lastName = getRandomItem(lastNames);
        const name = `${firstName} ${lastName}`;
        const city = getRandomItem(cities);
        const domain = getRandomItem(domains);
        
        // Clean name for email format (john.doe)
        const cleanFirstName = firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanLastName = lastName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const email = `${cleanFirstName}.${cleanLastName}${index}@${domain}`;
        
        const isActive = Math.random() < 0.5;
        const createdAt = getRandomDate();

        values.push([name, city, email, isActive, createdAt]);
      }

      await conn.batch(
        'INSERT INTO customers (name, city, email, isActive, created_at) VALUES (?, ?, ?, ?, ?)',
        values
      );

      console.log(`Inserted ${i + batchSize} / ${totalRecords} records...`);
    }

    console.log('✅ 50,000 records successfully inserted!');
  } catch (err) {
    console.error('❌ Error seeding database:', err);
  } finally {
    if (conn) conn.release();
    process.exit();
  }
}


async function seendAdminUsers(){
    const data = [
        {email:"admin@example.com", password:"admin123", type:"admin", isDeactivated:false},
        {email:"staff@example.com", password:"staff123", type:"staff", isDeactivated:false},
    ]
    data.forEach(async item => {
        const salt = await bcrypt.genSalt(10)
        const encryptedPass = await bcrypt.hash(item.password, salt)
        await pool.query(
            `INSERT INTO users (email, password, type)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE email = email`,
            [item.email, encryptedPass, item.type]
        )
        console.log(`Seeded ${item.email}`)
    })
}

seedDatabase()
seendAdminUsers()