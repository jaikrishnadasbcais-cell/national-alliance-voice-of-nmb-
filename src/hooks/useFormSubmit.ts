/// <reference types="vite/client" />
import { useState } from "react";

export interface FormSubmissionPayload {
  type: "issue" | "volunteer";
  payload: any;
}

export function useFormSubmit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitForm = async (type: "issue" | "volunteer", data: any) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const endpoint = import.meta.env.VITE_APPS_SCRIPT_URL;

    // Local logging for audit/development
    console.log(`[Form Submission - ${type}] Logging local data payload:`, data);

    if (!endpoint) {
      console.warn(
        "VITE_APPS_SCRIPT_URL is not configured in environment variables. Simulating local success."
      );
      // Simulate network lag
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
      setSuccess(true);
      return { success: true, simulated: true };
    }

    try {
      // Use text/plain to prevent CORS preflight OPTIONS request
      // which Google Apps Script web apps do not handle elegantly.
      const bodyPayload = JSON.stringify({
        formType: type,
        timestamp: new Date().toISOString(),
        ...data,
      });

      const response = await fetch(endpoint, {
        method: "POST",
        mode: "no-cors", // Required due to Google Apps Script's automatic 302 redirection behavior
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: bodyPayload,
      });

      // Note: With mode: 'no-cors', we cannot inspect response.ok or response.status,
      // but the browser will complete the request. We assume success unless an exception is caught.
      setLoading(false);
      setSuccess(true);
      return { success: true };
    } catch (err: any) {
      console.error("Error submitting form to Google Sheets:", err);
      const errMsg = err?.message || "Failed to submit form. Please check your network connection.";
      setError(errMsg);
      setLoading(false);
      return { success: false, error: errMsg };
    }
  };

  return {
    submitForm,
    loading,
    error,
    success,
    setError,
    setSuccess,
  };
}
