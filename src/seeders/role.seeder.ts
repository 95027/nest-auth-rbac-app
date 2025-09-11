import { RoleKey, ROLES } from 'src/constants/roles';
import { AppDataSource } from 'src/data-source';
import { Role } from 'src/entities/role.entity';

export async function seedRoles() {
  const roleRepo = AppDataSource.getRepository(Role);

  for (const key of Object.keys(ROLES)) {
    const roleKey = key as RoleKey;
    const { name, guard } = ROLES[roleKey];

    // Check if role already exists
    const exists = await roleRepo.findOne({ where: { name } });
    if (!exists) {
      const newRole = roleRepo.create({
        name,
        guard,
      });
      await roleRepo.save(newRole);
      console.log(`Role "${name}" seeded`);
    } else {
      console.log(`Role "${name}" already exists`);
    }
  }
}
