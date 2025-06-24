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

  // Clear existing data
  console.log("🧹 Cleaning existing data...");
  await prisma.notification.deleteMany();
  await prisma.weightRecord.deleteMany();
  await prisma.material.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create users with different roles
  console.log("👥 Creating users...");
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const hashedPasswordManager = await bcrypt.hash("manager123", 12);
  const hashedPasswordMarketing = await bcrypt.hash("marketing123", 12);
  const hashedPasswordOperator = await bcrypt.hash("operator123", 12);

  const [admin, manager, marketing, operator1, operator2] = await Promise.all([
    prisma.user.create({
      data: {
        email: "admin@company.com",
        name: "System Administrator",
        password: hashedPassword,
        role: UserRole.ADMIN,
        department: "IT",
        phone: "+62 812 3456 7890",
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "manager@company.com",
        name: "Operations Manager",
        password: hashedPasswordManager,
        role: UserRole.MANAGER,
        department: "Operations",
        phone: "+62 813 4567 8901",
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "marketing@company.com",
        name: "Marketing Staff",
        password: hashedPasswordMarketing,
        role: UserRole.MARKETING,
        department: "Marketing",
        phone: "+62 814 5678 9012",
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "operator@company.com",
        name: "Weighing Operator 1",
        password: hashedPasswordOperator,
        role: UserRole.OPERATOR,
        department: "Operations",
        phone: "+62 815 6789 0123",
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "operator2@company.com",
        name: "Weighing Operator 2",
        password: hashedPasswordOperator,
        role: UserRole.OPERATOR,
        department: "Operations",
        phone: "+62 816 7890 1234",
        isActive: true,
      },
    }),
  ]);

  console.log("✅ Users created successfully");

  // Create suppliers
  console.log("🚛 Creating suppliers...");
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: {
        name: "PT Batu Sejahtera",
        contactPerson: "Ahmad Wijaya",
        phone: "+62 21 1234 5678",
        email: "ahmad@batusejahtera.com",
        address: "Jl. Industri No. 123, Jakarta Selatan",
        materials: "Sand,Gravel,Stone",
        status: SupplierStatus.ACTIVE,
        rating: 4.5,
        totalOrders: 156,
        lastOrder: new Date("2025-01-15"),
      },
    }),
    prisma.supplier.create({
      data: {
        name: "PT Semen Utama",
        contactPerson: "Budi Santoso",
        phone: "+62 21 2345 6789",
        email: "budi@semenutama.com",
        address: "Jl. Raya Bekasi Km 25, Bekasi",
        materials: "Cement,Mortar",
        status: SupplierStatus.ACTIVE,
        rating: 4.8,
        totalOrders: 89,
        lastOrder: new Date("2025-01-14"),
      },
    }),
    prisma.supplier.create({
      data: {
        name: "PT Baja Kencana",
        contactPerson: "Sarah Dewi",
        phone: "+62 21 3456 7890",
        email: "sarah@bajakencana.com",
        address: "Jl. Industri Baja No. 45, Tangerang",
        materials: "Steel Rebar,Steel Plate,Iron Rod",
        status: SupplierStatus.ACTIVE,
        rating: 4.2,
        totalOrders: 67,
        lastOrder: new Date("2025-01-13"),
      },
    }),
    prisma.supplier.create({
      data: {
        name: "CV Blok Beton Mandiri",
        contactPerson: "Joko Susilo",
        phone: "+62 21 4567 8901",
        email: "joko@blokbeton.com",
        address: "Jl. Raya Bogor Km 30, Depok",
        materials: "Concrete Block,Paving Stone",
        status: SupplierStatus.ACTIVE,
        rating: 4.0,
        totalOrders: 34,
        lastOrder: new Date("2025-01-12"),
      },
    }),
    prisma.supplier.create({
      data: {
        name: "PT Kayu Jati Prima",
        contactPerson: "Siti Nurhaliza",
        phone: "+62 21 5678 9012",
        email: "siti@kayujati.com",
        address: "Jl. Kayu Manis No. 78, Jakarta Timur",
        materials: "Teak Wood,Mahogany Wood",
        status: SupplierStatus.PENDING,
        rating: 0,
        totalOrders: 0,
        lastOrder: null,
      },
    }),
  ]);

  console.log("✅ Suppliers created successfully");

  // Create materials
  console.log("📦 Creating materials...");
  const materials = await Promise.all([
    // Sand and Aggregates
    prisma.material.create({
      data: {
        name: "Fine Sand",
        category: "Aggregate",
        supplier: "PT Batu Sejahtera",
        unitPrice: 85000,
        unit: "ton",
        stock: 125.5,
        status: MaterialStatus.ACTIVE,
        createdBy: marketing.id,
      },
    }),
    prisma.material.create({
      data: {
        name: "Coarse Sand",
        category: "Aggregate",
        supplier: "PT Batu Sejahtera",
        unitPrice: 90000,
        unit: "ton",
        stock: 89.2,
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
        unit: "ton",
        stock: 67.8,
        status: MaterialStatus.ACTIVE,
        createdBy: marketing.id,
      },
    }),
    prisma.material.create({
      data: {
        name: "Crushed Stone",
        category: "Aggregate",
        supplier: "PT Batu Sejahtera",
        unitPrice: 105000,
        unit: "ton",
        stock: 45.3,
        status: MaterialStatus.LOW_STOCK,
        createdBy: marketing.id,
      },
    }),
    // Cement and Binding Agents
    prisma.material.create({
      data: {
        name: "Portland Cement Type I",
        category: "Binding Agent",
        supplier: "PT Semen Utama",
        unitPrice: 65000,
        unit: "bag",
        stock: 450,
        status: MaterialStatus.ACTIVE,
        createdBy: marketing.id,
      },
    }),
    prisma.material.create({
      data: {
        name: "Portland Cement Type II",
        category: "Binding Agent",
        supplier: "PT Semen Utama",
        unitPrice: 68000,
        unit: "bag",
        stock: 320,
        status: MaterialStatus.ACTIVE,
        createdBy: marketing.id,
      },
    }),
    prisma.material.create({
      data: {
        name: "Quick Setting Mortar",
        category: "Binding Agent",
        supplier: "PT Semen Utama",
        unitPrice: 75000,
        unit: "bag",
        stock: 180,
        status: MaterialStatus.ACTIVE,
        createdBy: marketing.id,
      },
    }),
    // Steel and Reinforcement
    prisma.material.create({
      data: {
        name: "Steel Rebar 10mm",
        category: "Reinforcement",
        supplier: "PT Baja Kencana",
        unitPrice: 12500,
        unit: "meter",
        stock: 2340,
        status: MaterialStatus.ACTIVE,
        createdBy: marketing.id,
      },
    }),
    prisma.material.create({
      data: {
        name: "Steel Rebar 12mm",
        category: "Reinforcement",
        supplier: "PT Baja Kencana",
        unitPrice: 15000,
        unit: "meter",
        stock: 1890,
        status: MaterialStatus.ACTIVE,
        createdBy: marketing.id,
      },
    }),
    prisma.material.create({
      data: {
        name: "Steel Plate 6mm",
        category: "Reinforcement",
        supplier: "PT Baja Kencana",
        unitPrice: 85000,
        unit: "sheet",
        stock: 45,
        status: MaterialStatus.LOW_STOCK,
        createdBy: marketing.id,
      },
    }),
    prisma.material.create({
      data: {
        name: "Iron Rod 8mm",
        category: "Reinforcement",
        supplier: "PT Baja Kencana",
        unitPrice: 9500,
        unit: "meter",
        stock: 1200,
        status: MaterialStatus.ACTIVE,
        createdBy: marketing.id,
      },
    }),
    // Masonry
    prisma.material.create({
      data: {
        name: "Concrete Block 20x20x40",
        category: "Masonry",
        supplier: "CV Blok Beton Mandiri",
        unitPrice: 3500,
        unit: "piece",
        stock: 25,
        status: MaterialStatus.LOW_STOCK,
        createdBy: marketing.id,
      },
    }),
    prisma.material.create({
      data: {
        name: "Concrete Block 15x20x40",
        category: "Masonry",
        supplier: "CV Blok Beton Mandiri",
        unitPrice: 3200,
        unit: "piece",
        stock: 0,
        status: MaterialStatus.OUT_OF_STOCK,
        createdBy: marketing.id,
      },
    }),
    prisma.material.create({
      data: {
        name: "Paving Stone 20x20",
        category: "Masonry",
        supplier: "CV Blok Beton Mandiri",
        unitPrice: 4500,
        unit: "piece",
        stock: 150,
        status: MaterialStatus.ACTIVE,
        createdBy: marketing.id,
      },
    }),
    // Wood Materials
    prisma.material.create({
      data: {
        name: "Teak Wood Plank 5x20x400",
        category: "Wood",
        supplier: "PT Kayu Jati Prima",
        unitPrice: 125000,
        unit: "piece",
        stock: 0,
        status: MaterialStatus.OUT_OF_STOCK,
        createdBy: marketing.id,
      },
    }),
  ]);

  console.log("✅ Materials created successfully");

  // Create weight records with realistic data
  console.log("⚖️ Creating weight records...");
  const weightRecords = [];
  
  // Create records for the last 7 days
  for (let day = 0; day < 7; day++) {
    const recordDate = new Date();
    recordDate.setDate(recordDate.getDate() - day);
    recordDate.setHours(8, 0, 0, 0); // Start at 8 AM
    
    // Create 3-8 records per day
    const recordsPerDay = Math.floor(Math.random() * 6) + 3;
    
    for (let i = 0; i < recordsPerDay; i++) {
      const entryTime = new Date(recordDate);
      entryTime.setHours(entryTime.getHours() + i * 2 + Math.floor(Math.random() * 2));
      
      const weighingTime = new Date(entryTime);
      weighingTime.setMinutes(weighingTime.getMinutes() + Math.floor(Math.random() * 45) + 15);
      
      const randomMaterial = materials[Math.floor(Math.random() * materials.length)];
      const randomOperator = Math.random() > 0.5 ? operator1 : operator2;
      
      // Generate realistic weights based on material type
      let grossWeight, tareWeight, netWeight;
      if (randomMaterial.category === "Aggregate") {
        grossWeight = Math.floor(Math.random() * 5000) + 15000; // 15-20 tons
        tareWeight = Math.floor(Math.random() * 2000) + 13000; // 13-15 tons
      } else if (randomMaterial.category === "Reinforcement") {
        grossWeight = Math.floor(Math.random() * 3000) + 8000; // 8-11 tons
        tareWeight = Math.floor(Math.random() * 1500) + 7000; // 7-8.5 tons
      } else {
        grossWeight = Math.floor(Math.random() * 4000) + 12000; // 12-16 tons
        tareWeight = Math.floor(Math.random() * 2000) + 11000; // 11-13 tons
      }
      netWeight = grossWeight - tareWeight;
      
      const vehicleNumbers = [
        "B 1234 ABC", "B 5678 DEF", "B 9012 GHI", "B 3456 JKL", 
        "B 7890 MNO", "B 2468 PQR", "B 1357 STU", "B 9753 VWX",
        "D 1111 AAA", "D 2222 BBB", "F 3333 CCC", "L 4444 DDD"
      ];
      
      const status = day === 0 && i >= recordsPerDay - 2 ? 
        (Math.random() > 0.5 ? WeightStatus.PENDING : WeightStatus.IN_PROGRESS) : 
        WeightStatus.COMPLETED;
      
      const record = await prisma.weightRecord.create({
        data: {
          materialId: randomMaterial.id,
          grossWeight,
          tareWeight,
          netWeight,
          vehicleNumber: vehicleNumbers[Math.floor(Math.random() * vehicleNumbers.length)],
          operatorId: randomOperator.id,
          status,
          entryDate: entryTime,
          weighingDate: status === WeightStatus.COMPLETED ? weighingTime : null,
        },
      });
      
      weightRecords.push(record);
    }
  }

  console.log("✅ Weight records created successfully");

  // Create notifications
  console.log("🔔 Creating notifications...");
  const notifications = await Promise.all([
    // Low stock alerts
    prisma.notification.create({
      data: {
        title: "Critical Stock Alert",
        message: "Concrete Block 15x20x40 is completely out of stock. Immediate restocking required.",
        type: NotificationType.ERROR,
        category: "Inventory",
        priority: NotificationPriority.HIGH,
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        title: "Low Stock Warning",
        message: "Concrete Block 20x20x40 inventory is running low (25 pieces remaining). Consider restocking soon.",
        type: NotificationType.WARNING,
        category: "Inventory",
        priority: NotificationPriority.HIGH,
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        title: "Low Stock Warning",
        message: "Crushed Stone inventory is running low (45.3 tons remaining). Consider restocking soon.",
        type: NotificationType.WARNING,
        category: "Inventory",
        priority: NotificationPriority.HIGH,
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        title: "Low Stock Warning",
        message: "Steel Plate 6mm inventory is running low (45 sheets remaining). Consider restocking soon.",
        type: NotificationType.WARNING,
        category: "Inventory",
        priority: NotificationPriority.HIGH,
        isRead: false,
      },
    }),
    // Operational notifications
    prisma.notification.create({
      data: {
        title: "Weight Record Completed",
        message: "Weight record for Fine Sand has been successfully processed (1,250 kg)",
        type: NotificationType.SUCCESS,
        category: "Operations",
        priority: NotificationPriority.NORMAL,
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        title: "Daily Operations Summary",
        message: `Today's weighing operations completed: ${weightRecords.filter(r => {
          const today = new Date();
          const recordDate = new Date(r.entryDate);
          return recordDate.toDateString() === today.toDateString() && r.status === 'COMPLETED';
        }).length} records processed successfully.`,
        type: NotificationType.INFO,
        category: "Operations",
        priority: NotificationPriority.NORMAL,
        isRead: true,
      },
    }),
    // Supplier notifications
    prisma.notification.create({
      data: {
        title: "New Supplier Registration",
        message: "PT Kayu Jati Prima has submitted registration for approval. Review required.",
        type: NotificationType.INFO,
        category: "Suppliers",
        priority: NotificationPriority.NORMAL,
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        title: "Supplier Performance Alert",
        message: "PT Baja Kencana delivery was delayed by 2 days. Consider discussing with supplier.",
        type: NotificationType.WARNING,
        category: "Suppliers",
        priority: NotificationPriority.NORMAL,
        isRead: true,
      },
    }),
    // System notifications
    prisma.notification.create({
      data: {
        title: "System Maintenance Scheduled",
        message: "Scheduled maintenance on January 20, 2025 from 02:00 - 04:00 AM. System will be temporarily unavailable.",
        type: NotificationType.INFO,
        category: "System",
        priority: NotificationPriority.LOW,
        isRead: true,
      },
    }),
    prisma.notification.create({
      data: {
        title: "IoT Device Status",
        message: "All weighing scale devices are online and functioning normally.",
        type: NotificationType.SUCCESS,
        category: "System",
        priority: NotificationPriority.LOW,
        isRead: true,
      },
    }),
    // Security notifications
    prisma.notification.create({
      data: {
        title: "Security Alert",
        message: "Multiple failed login attempts detected from IP 192.168.1.100. Account temporarily locked.",
        type: NotificationType.WARNING,
        category: "Security",
        priority: NotificationPriority.HIGH,
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        title: "User Access Update",
        message: "New operator account created for Weighing Operator 2. Access granted to weighing operations.",
        type: NotificationType.INFO,
        category: "Security",
        priority: NotificationPriority.NORMAL,
        isRead: true,
      },
    }),
  ]);

  console.log("✅ Notifications created successfully");

  // Update material stock based on weight records
  console.log("📊 Updating material stock based on weight records...");
  for (const record of weightRecords) {
    if (record.status === WeightStatus.COMPLETED) {
      await prisma.material.update({
        where: { id: record.materialId },
        data: {
          stock: {
            decrement: record.netWeight / 1000, // Convert kg to tons for most materials
          },
        },
      });
    }
  }

  console.log("🎉 Database seeding completed successfully!");
  console.log("\n📋 Demo accounts created:");
  console.log("👤 Admin: admin@company.com / admin123");
  console.log("👤 Manager: manager@company.com / manager123");
  console.log("👤 Marketing: marketing@company.com / marketing123");
  console.log("👤 Operator 1: operator@company.com / operator123");
  console.log("👤 Operator 2: operator2@company.com / operator123");
  console.log("\n📊 Data Summary:");
  console.log(`• ${suppliers.length} suppliers created`);
  console.log(`• ${materials.length} materials created`);
  console.log(`• ${weightRecords.length} weight records created`);
  console.log(`• ${notifications.length} notifications created`);
  console.log("\n🔗 IoT Integration:");
  console.log("• POST /api/iot/weighing - For IoT device data submission");
  console.log("• GET /api/iot/weighing - For monitoring recent weighing data");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });