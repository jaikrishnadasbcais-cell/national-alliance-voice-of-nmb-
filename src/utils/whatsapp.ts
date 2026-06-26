export interface IssuePayload {
  submittedBy: string;
  ward: string;
  issueType: string;
  urgency: 'low' | 'medium' | 'high';
  description: string;
}

/**
 * Formats a 'Report an Issue' payload into a clean, markdown-supported string
 * with bold titles and emojis, and generates a secure wa.me redirect link.
 * 
 * Target Phone: +27 71 674 7186 (Designated Team Coordinator)
 */
export function generateWhatsAppLink(payload: IssuePayload): string {
  const phone = "27716747186";
  
  const urgencyLabels = {
    low: "🟢 LOW URGENCY",
    medium: "🟡 MEDIUM URGENCY",
    high: "🔴 HIGH URGENCY"
  };

  const urgencyStr = urgencyLabels[payload.urgency] || "⚠️ UNKNOWN";

  // Build the message with bold text (*text*) and clear formatting
  const messageLines = [
    `📢 *NATIONAL ALLIANCE - WARD INFRASTRUCTURE WATCH* 📢`,
    `----------------------------------------`,
    `👤 *Reported By:* ${payload.submittedBy}`,
    `📍 *Ward/Area:* ${payload.ward}`,
    `🛠️ *Issue Category:* ${payload.issueType}`,
    `🚨 *Urgency level:* ${urgencyStr}`,
    `----------------------------------------`,
    `📝 *Details & Location:*`,
    `_${payload.description.trim()}_`,
    `----------------------------------------`,
    `✊ *i❤️NA - Voice of Nelson Mandela Bay*`,
    `💬 Escalated via NA Community Action Hub.`
  ];

  const fullMessage = messageLines.join("\n");
  const encodedText = encodeURIComponent(fullMessage);
  
  return `https://wa.me/${phone}?text=${encodedText}`;
}
