import { auth } from "./firebaseConfig";
import type { UserEvent } from "../redux/slices/eventsSlice";

/**
 * Email notification service
 * Sends email notifications when events reach their scheduled date and time
 * 
 * Note: This service requires a backend endpoint or Firebase Cloud Function
 * to actually send emails. For now, it provides the structure and logs the notification.
 * 
 * To implement email sending, you can:
 * 1. Use Firebase Cloud Functions with nodemailer
 * 2. Use a service like SendGrid, Mailgun, or AWS SES
 * 3. Use EmailJS for client-side email sending (limited but works)
 */

export interface EmailNotificationData {
  to: string;
  subject: string;
  petName: string;
  eventTitle: string;
  eventType: "medicine" | "event";
  description: string;
  date: string;
  time?: string;
}

/**
 * Format email subject based on event type
 */
const formatEmailSubject = (
  eventType: "medicine" | "event",
  eventTitle: string,
  petName: string
): string => {
  if (eventType === "medicine") {
    return `Reminder: ${eventTitle} for ${petName}`;
  }
  return `Reminder: ${eventTitle} for ${petName}`;
};


/**
 * Send email notification
 * 
 * This function should be connected to a backend service or Firebase Cloud Function
 * that actually sends the email. For now, it logs the notification data.
 * 
 * @param event - The event that triggered the notification
 * @param petName - Name of the pet associated with the event
 */
export const sendEmailNotification = async (
  event: UserEvent,
  petName: string
): Promise<void> => {
  const user = auth.currentUser;
  if (!user || !user.email) {
    console.warn("Cannot send email: User not authenticated or no email");
    return;
  }

  const emailData: EmailNotificationData = {
    to: user.email,
    subject: formatEmailSubject(
      event.type,
      event.type === "medicine" ? event.name || "Medication" : event.title || "Event",
      petName
    ),
    petName,
    eventTitle:
      event.type === "medicine" ? event.name || "Medication" : event.title || "Event",
    eventType: event.type,
    description: event.description,
    date: event.date,
    time: event.time,
  };

  try {
    // Note: Replace this with actual email sending service
    // Example: Call Firebase Cloud Function or external API
    console.log("Email notification would be sent:", emailData);

    // Example implementation with a Cloud Function:
    // const sendEmailFunction = httpsCallable(functions, 'sendEmailNotification');
    // await sendEmailFunction(emailData);

    // For now, we'll use a simple fetch to a backend endpoint
    // You should create a backend endpoint that handles email sending
    const response = await fetch("/api/send-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      // If the endpoint doesn't exist, just log (this is expected in development)
      console.log("Email notification endpoint not available (expected in development)");
    }
  } catch (error) {
    // Silently fail in development - the endpoint might not exist
    console.log("Email notification service not configured:", error);
  }
};

/**
 * Check if event time has been reached
 */
export const shouldSendNotification = (event: UserEvent): boolean => {
  try {
    const now = new Date();
    const eventDate = new Date(event.date);

    // If event has a time, combine date and time
    if (event.time) {
      const [hours, minutes] = event.time.split(":").map(Number);
      eventDate.setHours(hours, minutes, 0, 0);
    } else {
      // If no time, set to start of day
      eventDate.setHours(0, 0, 0, 0);
    }

    // Check if current time is equal to or past event time
    return now >= eventDate;
  } catch {
    return false;
  }
};

