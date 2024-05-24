const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Shadows1580',
  port: 5432,
});

// Read the schema.sql file
const schemaQuery = fs.readFileSync('./db/schema.sql', 'utf8');

// Check if the tables already exist
pool.query("SELECT to_regclass('public.department') AS department_exists", (err, res) => {
  if (err) {
    console.error('Error checking if tables exist:', err);
    pool.end();
  } else {
    const departmentExists = res.rows[0].department_exists;

    if (departmentExists) {
      console.log('Schema.sql already run. Skipping table creation.');
      pool.end();
    } else {
      // Tables do not exist, proceed with creating them
      pool.query(schemaQuery, (err, res) => {
        if (err) {
          console.error('Error creating tables:', err);
        } else {
          console.log('Tables created successfully');
          // Seed the database with initial data
          const seedsQuery = fs.readFileSync('./db/seeds.sql', 'utf8');
          pool.query(seedsQuery, (err, res) => {
            if (err) {
              console.error('Error seeding data:', err);
            } else {
              console.log('Database seeded successfully');
            }
            pool.end();
          });
        }
      });
    }
  }
});