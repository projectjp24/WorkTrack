import { DataSource } from 'typeorm';
// import { UserManagementEntity } from './user-management/entities/user-management.entity';
import * as bcrypt from 'bcrypt';
// import { Roles } from './utility/enums/user-roles.enum';
import * as jwt from 'jsonwebtoken';
import { UserManagementEntity } from 'src/user-management/entities/user-management.entity';
import { Roles } from "src/utility/enums/user-roles.enum";


const AppDataSource = new DataSource({
  type: 'mysql', // or 'postgres'
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'admin',
  database: process.env.DB_NAME || 'worktrack',
  entities: [UserManagementEntity],
  synchronize: false,
});

async function runSeeder() {
  await AppDataSource.initialize();
  console.log('✅ Database connected');

  const userRepo = AppDataSource.getRepository(UserManagementEntity);

  // Check if admin already exists
  const existing = await userRepo.findOne({ where: { username: 'admin' } });
  if (existing) {
    console.log('⚠️ Admin user already exists');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  const newUser = userRepo.create({
    name: 'Super Admin',
    username: 'admin',
    employeeId: 'EMP001',
    email: 'admin@example.com',
    password: hashedPassword,
    role: Roles.ADMIN,
  });

  const savedUser = await userRepo.save(newUser);

  console.log('✅ Admin user created:', {
    id: savedUser.id,
    username: savedUser.username,
    email: savedUser.email,
    role: savedUser.role,
  });

  // Generate initial tokens for immediate use
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'default_access_secret';
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret';

  const accessToken = jwt.sign(
    {
      id: savedUser.id,
      username: savedUser.username,
      employeeId: savedUser.employeeId,
      role: savedUser.role,
    },
    accessTokenSecret,
    { expiresIn: '1h' },
  );

  const refreshToken = jwt.sign(
    {
      id: savedUser.id,
      username: savedUser.username,
      employeeId: savedUser.employeeId,
      role: savedUser.role,
    },
    refreshTokenSecret,
    { expiresIn: '7d' },
  );

  console.log('🎟️ Access Token:', accessToken);
  console.log('🔄 Refresh Token:', refreshToken);

  process.exit(0);
}

runSeeder().catch((err) => {
  console.error('❌ Seeder failed:', err);
  process.exit(1);
});
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImVtcGxveWVlSWQiOiJFTVAwMDEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTYxMTQyNzMsImV4cCI6MTc1NjExNzg3M30.vPwDQPKWA6MYH4PhvQryWVKoDGbFIddh3QzDtu-8scj0

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImVtcGxveWVlSWQiOiJFTVAwMDEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTYxMTQyNzMsImV4cCI6MTc1NjcxOTA3M30.5DzjmUCTBYA45hxS5f-yFfVIEReLBunzCk4SSemqyfA