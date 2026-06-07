const axios = require("axios");

const MSG91_BASE_URL = "https://api.msg91.com/api/v5";

/**
 * Send SMS via MSG91
 * @param {string} phone - 10-digit mobile number
 * @param {string} message - SMS message text
 */
const sendSMS = async (phone, message) => {
  if (
    !process.env.MSG91_AUTH_KEY ||
    process.env.MSG91_AUTH_KEY === "your_msg91_auth_key"
  ) {
    console.warn("[MSG91] SMS not sent: AUTH_KEY not configured");
    return { success: false, reason: "MSG91 not configured" };
  }

  try {
    const response = await axios.post(
      `${MSG91_BASE_URL}/flow/`,
      {
        template_id: process.env.MSG91_TEMPLATE_ID_OTP,
        short_url: "0",
        recipients: [
          {
            mobiles: `91${phone}`,
            VAR1: message,
          },
        ],
      },
      {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          "Content-Type": "application/json",
        },
      },
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("[MSG91] SMS error:", error?.response?.data || error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send WhatsApp message via MSG91
 * @param {string} phone - 10-digit mobile number
 * @param {string} message - Message text
 */
const sendWhatsApp = async (phone, message) => {
  if (
    !process.env.MSG91_AUTH_KEY ||
    process.env.MSG91_AUTH_KEY === "your_msg91_auth_key"
  ) {
    console.warn("[MSG91] WhatsApp not sent: AUTH_KEY not configured");
    return { success: false, reason: "MSG91 not configured" };
  }

  try {
    const response = await axios.post(
      `${MSG91_BASE_URL}/whatsapp/whatsapp-outbound-message/bulk/`,
      {
        integrated_number: process.env.MSG91_WHATSAPP_NUMBER,
        content_type: "template",
        payload: {
          to: `91${phone}`,
          type: "text",
          text: { body: message },
        },
      },
      {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          "Content-Type": "application/json",
        },
      },
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error(
      "[MSG91] WhatsApp error:",
      error?.response?.data || error.message,
    );
    return { success: false, error: error.message };
  }
};

/**
 * Send notification across selected channels
 */
const sendNotification = async ({
  phone,
  message,
  channels = { sms: false, whatsapp: false },
}) => {
  const results = {};
  if (channels.sms && phone) {
    results.sms = await sendSMS(phone, message);
  }
  if (channels.whatsapp && phone) {
    results.whatsapp = await sendWhatsApp(phone, message);
  }
  return results;
};

module.exports = { sendSMS, sendWhatsApp, sendNotification };
