import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create David Morris Super Admin user
  const superAdminEmail = "dmorris@dmsi.com";
  const superAdminPassword = "dmorris!";

  const existingSuperAdmin = await prisma.user.findUnique({
    where: { email: superAdminEmail },
  });

  if (!existingSuperAdmin) {
    const hashedPassword = await bcrypt.hash(superAdminPassword, 12);

    const superAdmin = await prisma.user.create({
      data: {
        email: superAdminEmail,
        name: "David Morris",
        hashedPassword,
        role: Role.SUPER_ADMIN,
      },
    });

    console.log("Created Super Admin:", superAdmin.email);
  } else {
    console.log("Super Admin already exists:", existingSuperAdmin.email);
  }

  // Create legacy admin user for backwards compatibility
  const legacyAdminEmail = "admin@example.com";
  const legacyAdminPassword = process.env.ADMIN_PASSWORD || "dmorris";

  const existingLegacyAdmin = await prisma.user.findUnique({
    where: { email: legacyAdminEmail },
  });

  if (!existingLegacyAdmin) {
    const hashedPassword = await bcrypt.hash(legacyAdminPassword, 12);

    const legacyAdmin = await prisma.user.create({
      data: {
        email: legacyAdminEmail,
        name: "Legacy Administrator",
        hashedPassword,
        role: Role.SUPER_ADMIN,
      },
    });

    console.log("Created Legacy Admin:", legacyAdmin.email);
  } else {
    console.log("Legacy Admin already exists:", existingLegacyAdmin.email);
  }

  // Create default user from environment variables
  const userEmail = "user@example.com";
  const userPassword = process.env.APP_PASSWORD || "dmsi1234";

  const existingUser = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(userPassword, 12);

    const user = await prisma.user.create({
      data: {
        email: userEmail,
        name: "Default User",
        hashedPassword,
        role: Role.USER,
      },
    });

    console.log("Created Default User:", user.email);
  } else {
    console.log("Default User already exists:", existingUser.email);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
