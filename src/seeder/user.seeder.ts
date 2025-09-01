// import { DataSource } from 'typeorm';
// // import { UserManagementEntity } from './user-management/entities/user-management.entity';
// import * as bcrypt from 'bcrypt';
// // import { Roles } from './utility/enums/user-roles.enum';
// import * as jwt from 'jsonwebtoken';
// import { userEntity } from '../user-management/entities/user.entity';
// import { Roles } from "src/utility/enums/user-roles.enum";
 
 
// const AppDataSource = new DataSource({
//   type: 'mysql', // or 'postgres'
//   host: process.env.DB_HOST || 'localhost',
//   port: Number(process.env.DB_PORT) || 3306,
//   username: process.env.DB_USER || 'root',
//   password: process.env.DB_PASS || 'admin',
//   database: process.env.DB_NAME || 'worktrack',
//   entities: [userEntity],
//   synchronize: false,
// });
 
// async function runSeeder() {
//   await AppDataSource.initialize();
//   console.log('✅ Database connected');
 
// const userRepo = AppDataSource.getRepository(userEntity);

// // Get RoleEntity repository and fetch ADMIN role
// const roleRepo = AppDataSource.getRepository('RoleEntity'); // Use the correct entity class if available
// const adminRole = await roleRepo.findOne({ where: { name: Roles.ADMIN } });
// if (!adminRole) {
//   console.error('❌ ADMIN role not found in roles table');
//   process.exit(1);
// }

// // Check if admin already exists
// const existing = await userRepo.findOne({ where: { username: 'admin' } });
// if (existing) {
//   console.log('⚠️ Admin user already exists');
//   process.exit(0);
// }

// const hashedPassword = await bcrypt.hash('Admin@123', 10);

// const newUser = userRepo.create({
//   username: 'admin',
//   employeeId: 'EMP001',
//   email: 'admin@example.com',
//   password: hashedPassword,
//   role: adminRole,
// });

// const savedUser = await userRepo.save(newUser);
 
//   console.log('✅ Admin user created:', {
//     id: savedUser.id,
//     username: savedUser.username,
//     email: savedUser.email,
//     role: savedUser.role,
//   });
 
//   // Generate initial tokens for immediate use
//   const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'default_access_secret';
//   const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret';
 
//   const accessToken = jwt.sign(
//     {
//       id: savedUser.id,
//       username: savedUser.username,
//       employeeId: savedUser.employeeId,
//       role: savedUser.role,
//     },
//     accessTokenSecret,
//     { expiresIn: '1h' },
//   );
 
//   const refreshToken = jwt.sign(
//     {
//       id: savedUser.id,
//       username: savedUser.username,
//       employeeId: savedUser.employeeId,
//       role: savedUser.role,
//     },
//     refreshTokenSecret,
//     { expiresIn: '7d' },
//   );
 
//   console.log('🎟️ Access Token:', accessToken);
//   console.log('🔄 Refresh Token:', refreshToken);
 
//   process.exit(0);
// }
 
// runSeeder().catch((err) => {
//   console.error('❌ Seeder failed:', err);
//   process.exit(1);
// });