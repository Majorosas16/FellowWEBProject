import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useFetchPets } from "./useFetchPets";
import { useEventsListener } from "./useEventsListener";
import { sendEmailNotification, shouldSendNotification } from "../services/emailNotificationService";
import type { RootState } from "../redux/store";
import type { UserEvent } from "../redux/slices/eventsSlice";

/**
 * Hook to monitor events and send email notifications
 * when event date and time are reached
 * 
 * Checks events every minute to see if any notification should be sent
 */
export const useEventNotifications = (): void => {
  const pets = useSelector((state: RootState) => state.pets.pets);
  const events = useSelector((state: RootState) => state.events.events);
  const sentNotificationsRef = useRef<Set<string>>(new Set());

  // Fetch pets and events
  useFetchPets();
  useEventsListener();

  useEffect(() => {
    const handleEventNotification = (event: UserEvent): void => {
      // Skip if already sent
      if (sentNotificationsRef.current.has(event.id)) {
        return;
      }

      // Check if notification should be sent
      if (!shouldSendNotification(event)) {
        return;
      }

      const pet = pets.find((p) => p.id === event.petId);
      const petName = pet?.name || "your pet";

      // Send notification
      sendEmailNotification(event, petName)
        .then(() => {
          // Mark as sent
          sentNotificationsRef.current.add(event.id);
          console.log(`Notification sent for event: ${event.id}`);
        })
        .catch((error) => {
          console.error("Error sending notification:", error);
        });
    };

    // Check events every minute
    const checkInterval = setInterval(() => {
      for (const event of events) {
        handleEventNotification(event);
      }
    }, 60000); // Check every minute

    // Also check immediately on mount
    for (const event of events) {
      handleEventNotification(event);
    }

    return () => {
      clearInterval(checkInterval);
    };
  }, [events, pets]);

  // Reset sent notifications when events change (new events added)
  useEffect(() => {
    const currentEventIds = new Set(events.map((e) => e.id));
    // Remove IDs that no longer exist
    for (const id of sentNotificationsRef.current) {
      if (!currentEventIds.has(id)) {
        sentNotificationsRef.current.delete(id);
      }
    }
  }, [events]);
};

