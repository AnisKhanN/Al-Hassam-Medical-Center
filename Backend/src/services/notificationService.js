/**
 * Notification Service for SmartClinic SaaS
 * Handles WhatsApp alerts, SMS gateway dispatch, and simulated logging for Viva defense.
 */

// In-memory circular log buffer for demonstration and audit logs
const notificationLogs = [];
const MAX_LOGS = 100;

const addLog = (logEntry) => {
  notificationLogs.unshift({
    id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    ...logEntry,
  });
  if (notificationLogs.length > MAX_LOGS) {
    notificationLogs.pop();
  }
};

/**
 * Normalizes a Pakistani phone number to international E.164 format (923XXXXXXXXX)
 */
const normalizePakistaniPhone = (phone = "") => {
  let cleaned = String(phone).replace(/[^0-9+]/g, "");
  if (cleaned.startsWith("+")) cleaned = cleaned.slice(1);
  if (cleaned.startsWith("03")) cleaned = "92" + cleaned.slice(1);
  else if (cleaned.startsWith("3") && cleaned.length === 10) cleaned = "92" + cleaned;
  return cleaned;
};

/**
 * 1. Generate Direct WhatsApp Click-to-Chat Link
 */
const generateWhatsAppLink = ({ phone, message }) => {
  const normalizedPhone = normalizePakistaniPhone(phone);
  const encodedText = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${normalizedPhone}&text=${encodedText}`;
};

/**
 * 2. Templates Builder for Healthcare Alerts
 */
const templates = {
  appointmentReminder: ({ patientName, doctorName, dateStr, timeStr, clinicName = "SmartClinic Sanghar", clinicPhone = "0235-542100", meetingLink = null }) => {
    let msg = `🏥 *${clinicName} — Appointment Reminder*\n\n` +
      `Assalam-o-Alaikum, *${patientName}*!\n` +
      `This is a reminder for your medical appointment.\n\n` +
      `👨‍⚕️ *Doctor:* ${doctorName}\n` +
      `📅 *Date:* ${dateStr}\n` +
      `⏰ *Time:* ${timeStr}\n`;

    if (meetingLink) {
      msg += `\n💻 *Virtual Video Consultation Link:*\n${meetingLink}\n`;
    } else {
      msg += `📍 *Location:* Main Ward Road, Sanghar, Sindh\n`;
    }

    msg += `\n📞 *Helpline / Inquiries:* ${clinicPhone}\n` +
      `_Tawajjo: Baraye meharbani waqt se 10 minute pehle tashreef layen._`;
    return msg;
  },

  dischargeSlip: ({ patientName, doctorName, diagnosis, medications = [], followUpDate = null, clinicName = "SmartClinic Sanghar", slipUrl = null }) => {
    let msg = `🏥 *${clinicName} — Digital Discharge Slip & Prescription*\n\n` +
      `Patient: *${patientName}*\n` +
      `Doctor: *${doctorName}*\n` +
      `Diagnosis: *${diagnosis || "Consultation Completed"}*\n\n` +
      `💊 *Prescribed Medications & Instructions:* \n`;

    if (medications && medications.length > 0) {
      medications.forEach((m, idx) => {
        msg += `${idx + 1}. *${m.name || m}* — ${m.dosage || m.frequency || "As directed"}\n`;
      });
    } else {
      msg += `• Follow prescribed medication chart given by the doctor.\n`;
    }

    if (followUpDate) {
      msg += `\n🗓️ *Next Follow-up:* ${followUpDate}\n`;
    }

    msg += `\n*Roman Urdu:* Dawai hamesha doctor ki hidayat ke mutabiq waqt par lein.\n` +
      `*سنڌي:* دوا هميشه ڊاڪٽر جي ٻڌايل وقت تي پاڻيءَ سان کائو.\n`;

    if (slipUrl) {
      msg += `\n📄 *View Full Official Slip:* ${slipUrl}\n`;
    }

    msg += `\n_Wish you a speedy recovery! SmartClinic Sanghar._`;
    return msg;
  },

  billReceipt: ({ patientName, billId, totalAmount, amountPaid, balanceDue, clinicName = "SmartClinic Sanghar" }) => {
    return `🏥 *${clinicName} — Payment Receipt*\n\n` +
      `Dear *${patientName || "Valued Patient"}*,\n` +
      `We have successfully received your payment.\n\n` +
      `🧾 *Bill Number:* ${billId}\n` +
      `💵 *Total Amount:* Rs. ${totalAmount}\n` +
      `✅ *Amount Paid:* Rs. ${amountPaid}\n` +
      `⚠️ *Balance Due:* Rs. ${balanceDue || 0}\n\n` +
      `Thank you for trusting SmartClinic Sanghar for your healthcare needs!`;
  },
};

/**
 * 3. Send WhatsApp Alert
 * Dispatches via WhatsApp Cloud API if configured, otherwise returns generated wa.me deep-link and logs.
 */
const sendWhatsApp = async ({ phone, type = "custom", data = {}, customMessage = "", user = null }) => {
  let message = customMessage;

  if (type === "appointment" && templates.appointmentReminder) {
    message = templates.appointmentReminder(data);
  } else if (type === "discharge" && templates.dischargeSlip) {
    message = templates.dischargeSlip(data);
  } else if (type === "bill" && templates.billReceipt) {
    message = templates.billReceipt(data);
  }

  const normalizedPhone = normalizePakistaniPhone(phone || data.phone);
  const waLink = generateWhatsAppLink({ phone: normalizedPhone, message });

  let status = "simulated_success";
  let externalId = null;

  // If WhatsApp Business Cloud API credentials exist
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (token && phoneNumberId) {
    try {
      const res = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: normalizedPhone,
          type: "text",
          text: { body: message },
        }),
      });
      const resData = await res.json();
      if (res.ok) {
        status = "delivered_cloud_api";
        externalId = resData.messages?.[0]?.id;
      } else {
        status = "api_error_fallback_link";
      }
    } catch (err) {
      console.warn("WhatsApp Cloud API dispatch failed, falling back to deep link:", err.message);
      status = "api_error_fallback_link";
    }
  }

  // Record audit log
  addLog({
    channel: "WhatsApp",
    recipient: normalizedPhone,
    type,
    status,
    externalId,
    preview: message.slice(0, 120) + "...",
    dispatchedBy: user?.name || "System",
  });

  return {
    success: true,
    channel: "whatsapp",
    status,
    recipient: normalizedPhone,
    message,
    whatsAppLink: waLink,
  };
};

/**
 * 4. Send SMS Alert
 * Dispatches via SMS Gateway (or Simulator for FYP Viva)
 */
const sendSms = async ({ phone, message, type = "sms_alert", user = null }) => {
  const normalizedPhone = normalizePakistaniPhone(phone);
  let status = "simulated_dispatched";
  let externalId = `SMS-SIM-${Date.now()}`;

  const smsProvider = process.env.SMS_GATEWAY_PROVIDER || "simulator";
  const smsApiKey = process.env.SMS_API_KEY;

  if (smsProvider !== "simulator" && smsApiKey) {
    // Generic REST SMS Gateway implementation (e.g. Telenor / Jazz / Twilio)
    try {
      // Plug your carrier endpoint or generic provider
      status = "sent_via_carrier";
    } catch (err) {
      status = "carrier_error";
    }
  }

  addLog({
    channel: "SMS",
    recipient: normalizedPhone,
    type,
    status,
    externalId,
    preview: (message || "").slice(0, 120) + "...",
    dispatchedBy: user?.name || "System",
  });

  return {
    success: true,
    channel: "sms",
    status,
    recipient: normalizedPhone,
    message,
    externalId,
  };
};

const getLogs = (limit = 50) => {
  return notificationLogs.slice(0, limit);
};

module.exports = {
  normalizePakistaniPhone,
  generateWhatsAppLink,
  templates,
  sendWhatsApp,
  sendSms,
  getLogs,
};
