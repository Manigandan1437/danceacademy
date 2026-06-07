const Notification = require("../models/Notification");
const { sendNotification } = require("./msg91Service");

/**
 * Create in-app notification and optionally send SMS/WhatsApp
 * @param {Object} options
 */
const createNotification = async ({
  recipientId,
  title,
  message,
  type = "general",
  link = "",
  channels = { inApp: true, sms: false, whatsapp: false },
  phone = null,
  metadata = {},
}) => {
  try {
    // Save in-app notification
    const notification = await Notification.create({
      recipient: recipientId,
      title,
      message,
      type,
      link,
      channels: {
        inApp: channels.inApp,
        sms: channels.sms,
        whatsapp: channels.whatsapp,
      },
      metadata,
    });

    // Send SMS/WhatsApp if phone is provided and channels are enabled
    if (phone && (channels.sms || channels.whatsapp)) {
      const externalResults = await sendNotification({
        phone,
        message: `${title}: ${message}`,
        channels: { sms: channels.sms, whatsapp: channels.whatsapp },
      });

      // Update notification with send status
      notification.channels.smsSent = externalResults?.sms?.success || false;
      notification.channels.whatsappSent =
        externalResults?.whatsapp?.success || false;
      await notification.save();
    }

    return notification;
  } catch (error) {
    console.error(
      "[NotificationService] Error creating notification:",
      error.message,
    );
  }
};

module.exports = { createNotification };
