import {
  PrismaClient,
  UserRole,
  MaterialStatus,
  SupplierStatus,
  WeightStatus,
  NotificationType,
  NotificationPriority,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create users with different roles
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const hashedPasswordManager = await bcrypt.hash("manager123", 12);
  const hashedPasswordMarketing = await bcrypt.hash("marketing123", 12);
  const hashedPasswordOperator = await bcrypt.hash("operator123", 12);

  const [admin, manager, marketing, operator] = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@company.com" },
      update: {},
      create: {
        email: "admin@company.com",
        name: "System Administrator",
        password: hashedPassword,
        role: UserRole.ADMIN,
        department: "IT",
        phone: "+62 812 3456 7890",
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { email: "manager@company.com" },
      update: {},
      create: {
        email: "manager@company.com",
        name: "Operations Manager",
        password: hashedPasswordManager,
        role: UserRole.MANAGER,
        department: "Operations",
        phone: "+62 813 4567 8901",
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { email: "marketing@company.com" },
      update: {},
      create: {
        email: "marketing@company.com",
        name: "Marketing Staff",
        password: hashedPasswordMarketing,
        role: UserRole.MARKETING,
        department: "Marketing",
        phone: "+62 814 5678 9012",
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { email: "operator@company.com" },
      update: {},
      create: {
        email: "operator@company.com",
        name: "Weighing Operator",
        password: hashedPasswordOperator,
        role: UserRole.OPERATOR,
        department: "Operations",
        phone: "+62 815 6789 0123",
        isActive: true,
      },
    }),
  ]);

  console.log("✅ Users created successfully");

  // Create suppliers
  const suppliers = await Promise.all([
    prisma.supplier.upsert({
      where: { email: "ahmad@batusejahtera.com" },
      update: {},
      create: {
        name: "PT Batu Sejahtera",
        contactPerson: "Ahmad Wijaya",
        phone: "+62 21 1234 5678",
        email: "ahmad@batusejahtera.com",
        address: "Jakarta Selatan",
        materials: "Sand,Gravel,Stone",
        status: SupplierStatus.ACTIVE,
        rating: 4.5,
        totalOrders: 156,
        lastOrder: new Date("2025-01-15"),
      },
    }),
    prisma.supplier.upsert({
      where: { email: "budi@semenutama.com" },
      update: {},
      create: {
        name: "PT Semen Utama",
        contactPerson: "Budi Santoso",
        phone: "+62 21 2345 6789",
        email: "budi@semenutama.com",
        address: "Bekasi",
        materials: "Cement,Mortar",
        status: SupplierStatus.ACTIVE,
        rating: 4.8,
        totalOrders: 89,
        lastOrder: new Date("2025-01-14"),
      },
    }),
    prisma.supplier.upsert({
      where: { email: "sarah@bajakencana.com" },
      update: {},
      create: {
        name: "PT Baja Kencana",
        contactPerson: "Sarah Dewi",
        phone: "+62 21 3456 7890",
        email: "sarah@bajakencana.com",
        address: "Tangerang",
        materials: "Steel Rebar,Steel Plate",
        status: SupplierStatus.ACTIVE,
        rating: 4.2,
        totalOrders: 67,
        lastOrder: new Date("2025-01-13"),
      },
    }),
  ]);

  console.log("✅ Suppliers created successfully");

  // Create materials
  const materials = await Promise.all([
    prisma.material.create({
      data: {
        name: "Sand (Fine)",
        category: "Aggregate",
        supplier: "PT Batu Sejahtera",
        unitPrice: 85000,
        unit: "per ton",
        stock: 125,
        status: MaterialStatus.ACTIVE,
        createdBy: marketing.id,
      },
    }),
    prisma.material.create({
      data: {
        name: "Gravel (Medium)",
        category: "Aggregate",
        supplier: "PT Batu Sejahtera",
        unitPrice: 95000,
        unit: "per ton",
        stock: 89,
        status: MaterialStatus.ACTIVE,
        createdBy: marketing.id,
      },
    }),
    prisma.material.create({
      data: {
        name: "Cement (Type I)",
        category: "Binding Agent",
        supplier: "PT Semen Utama",
        unitPrice: 65000,
        unit: "per bag",
        stock: 450,
        status: MaterialStatus.ACTIVE,
        createdBy: marketing.id,
      },
    }),
    prisma.material.create({
      data: {
        name: "Steel Rebar (10mm)",
        category: "Reinforcement",
        supplier: "PT Baja Kencana",
        unitPrice: 12500,
        unit: "per meter",
        stock: 2340,
        status: MaterialStatus.ACTIVE,
        createdBy: marketing.id,
      },
    }),
    prisma.material.create({
      data: {
        name: "Concrete Block",
        category: "Masonry",
        supplier: "PT Blok Beton",
        unitPrice: 3500,
        unit: "per piece",
        stock: 25,
        status: MaterialStatus.LOW_STOCK,
        createdBy: marketing.id,
      },
    }),
  ]);

  console.log("✅ Materials created successfully");

  // Create weight records
  const weightRecords = await Promise.all([
    prisma.weightRecord.create({
      data: {
        materialId: materials[0].id,
        grossWeight: 15250,
        tareWeight: 14000,
        netWeight: 1250,
        vehicleNumber: "B 1234 ABC",
        operatorId: operator.id,
        status: WeightStatus.COMPLETED,
        entryDate: new Date("2025-01-15T08:00:00"),
        weighingDate: new Date("2025-01-15T09:24:00"),
      },
    }),
    prisma.weightRecord.create({
      data: {
        materialId: materials[1].id,
        grossWeight: 17100,
        tareWeight: 15000,
        netWeight: 2100,
        vehicleNumber: "B 5678 DEF",
        operatorId: operator.id,
        status: WeightStatus.COMPLETED,
        entryDate: new Date("2025-01-15T08:30:00"),
        weighingDate: new Date("2025-01-15T09:15:00"),
      },
    }),
    prisma.weightRecord.create({
      data: {
        materialId: materials[2].id,
        grossWeight: 16500,
        tareWeight: 15000,
        netWeight: 1500,
        vehicleNumber: "B 9012 GHI",
        operatorId: operator.id,
        status: WeightStatus.COMPLETED,
        entryDate: new Date("2025-01-15T08:15:00"),
        weighingDate: new Date("2025-01-15T08:52:00"),
      },
    }),
    prisma.weightRecord.create({
      data: {
        materialId: materials[3].id,
        grossWeight: 13800,
        tareWeight: 13000,
        netWeight: 800,
        vehicleNumber: "B 3456 JKL",
        operatorId: operator.id,
        status: WeightStatus.PENDING,
        entryDate: new Date("2025-01-15T08:00:00"),
      },
    }),
  ]);

  console.log("✅ Weight records created successfully");

  // Create notifications
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        title: "Low Stock Alert",
        message: "Concrete Block inventory is running low (25 pieces remaining)",
        type: NotificationType.WARNING,
        category: "Inventory",
        priority: NotificationPriority.HIGH,
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        title: "Weight Record Completed",
        message: "Weight record has been successfully processed",
        type: NotificationType.SUCCESS,
        category: "Operations",
        priority: NotificationPriority.NORMAL,
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        title: "New Supplier Registration",
        message: "PT Material Baru has submitted registration for approval",
        type: NotificationType.INFO,
        category: "Suppliers",
        priority: NotificationPriority.NORMAL,
        isRead: true,
      },
    }),
    prisma.notification.create({
      data: {
        title: "System Maintenance Scheduled",
        message: "Scheduled maintenance on January 20, 2025 from 02:00 - 04:00 AM",
        type: NotificationType.INFO,
        category: "System",
        priority: NotificationPriority.LOW,
        isRead: true,
      },
    }),
  ]);

  console.log("✅ Notifications created successfully");

  console.log("🎉 Database seeding completed!");
  console.log("\n📋 Demo accounts created:");
  console.log("👤 Admin: admin@company.com / admin123");
  console.log("👤 Manager: manager@company.com / manager123");
  console.log("👤 Marketing: marketing@company.com / marketing123");
  console.log("👤 Operator: operator@company.com / operator123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seeding error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });