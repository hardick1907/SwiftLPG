import cron from 'node-cron';
import { db } from '../lib/db.js';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

export const resetYearlyCylinderAllocation = async () => {
  try {
    const now = new Date();
    const customersCollection = collection(db, "customers");
    const snapshot = await getDocs(customersCollection);

    const updatePromises = snapshot.docs.map(async (customerDoc) => {
      const customerData = customerDoc.data();
      const lastResetDate = new Date(customerData.cylinderAllocation?.lastResetDate || now);
      const yearDiff = now.getFullYear() - lastResetDate.getFullYear();

      if (yearDiff >= 1) {
        const customerRef = doc(db, "customers", customerDoc.id);

        await updateDoc(customerRef, {
          cylinderAllocation: {
            total: 15,
            rate: 800,
            lastResetDate: now.toISOString(),
            monthlyBookedCylinders: 0,
            yearlyBookedCylinders: 0
          }
        });

        console.log(`Reset cylinder allocation for customer: ${customerDoc.id}`);
      }
    });

    await Promise.all(updatePromises);
    console.log('Yearly cylinder allocation reset completed');
  } catch (error) {
    console.error('Error in yearly cylinder allocation reset:', error);
  }
};

export const setupCylinderAllocationCronJob = () => {
  cron.schedule('0 0 * * *', resetYearlyCylinderAllocation);
  console.log('Cylinder allocation reset cron job scheduled');
};