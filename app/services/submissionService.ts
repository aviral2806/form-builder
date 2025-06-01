import { supabase } from "~/lib/supabase";

export interface FormSubmission {
  id: string;
  created_at: string;
  form_id: string;
  form_data: Record<string, any>;
}

export interface CreateSubmissionRequest {
  form_id: string;
  form_data: Record<string, any>;
}

export class FormSubmissionService {
  /**
   * Submit form data to the backend
   */
  static async createSubmission(
    data: CreateSubmissionRequest
  ): Promise<FormSubmission> {
    console.log("📤 Submitting form data to backend:", data);

    const { data: submission, error } = await supabase
      .from("form_submissions")
      .insert({
        form_id: data.form_id,
        form_data: data.form_data,
      })
      .select()
      .single();

    if (error) {
      console.error("❌ Error creating submission:", error);
      throw new Error(`Failed to submit form: ${error.message}`);
    }

    console.log("✅ Form submitted successfully:", submission);
    return submission;
  }

  /**
   * Get submissions for a specific form (for admin/analytics)
   */
  static async getSubmissionsForForm(
    formId: string
  ): Promise<FormSubmission[]> {
    const { data: submissions, error } = await supabase
      .from("form_submissions")
      .select("*")
      .eq("form_id", formId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Error fetching submissions:", error);
      throw new Error(`Failed to fetch submissions: ${error.message}`);
    }

    return submissions || [];
  }

  /**
   * Get a specific submission by ID
   */
  static async getSubmissionById(id: string): Promise<FormSubmission | null> {
    const { data: submission, error } = await supabase
      .from("form_submissions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return null;
      }
      console.error("❌ Error fetching submission:", error);
      throw new Error(`Failed to fetch submission: ${error.message}`);
    }

    return submission;
  }

  /**
   * Delete a submission (for admin cleanup)
   */
  static async deleteSubmission(id: string): Promise<void> {
    const { error } = await supabase
      .from("form_submissions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("❌ Error deleting submission:", error);
      throw new Error(`Failed to delete submission: ${error.message}`);
    }

    console.log("✅ Submission deleted successfully:", id);
  }

  /**
   * Get submission statistics for a form
   */
  static async getSubmissionStats(formId: string): Promise<{
    totalSubmissions: number;
    submissionsToday: number;
    submissionsThisWeek: number;
    submissionsThisMonth: number;
  }> {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    ).toISOString();
    const startOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    ).toISOString();

    // Get total submissions
    const { count: totalSubmissions, error: totalError } = await supabase
      .from("form_submissions")
      .select("*", { count: "exact", head: true })
      .eq("form_id", formId);

    if (totalError) {
      throw new Error(`Failed to fetch total submissions: ${totalError.message}`);
    }

    // Get today's submissions
    const { count: submissionsToday, error: todayError } = await supabase
      .from("form_submissions")
      .select("*", { count: "exact", head: true })
      .eq("form_id", formId)
      .gte("created_at", startOfDay);

    if (todayError) {
      throw new Error(`Failed to fetch today's submissions: ${todayError.message}`);
    }

    // Get this week's submissions
    const { count: submissionsThisWeek, error: weekError } = await supabase
      .from("form_submissions")
      .select("*", { count: "exact", head: true })
      .eq("form_id", formId)
      .gte("created_at", startOfWeek);

    if (weekError) {
      throw new Error(`Failed to fetch this week's submissions: ${weekError.message}`);
    }

    // Get this month's submissions
    const { count: submissionsThisMonth, error: monthError } = await supabase
      .from("form_submissions")
      .select("*", { count: "exact", head: true })
      .eq("form_id", formId)
      .gte("created_at", startOfMonth);

    if (monthError) {
      throw new Error(`Failed to fetch this month's submissions: ${monthError.message}`);
    }

    return {
      totalSubmissions: totalSubmissions || 0,
      submissionsToday: submissionsToday || 0,
      submissionsThisWeek: submissionsThisWeek || 0,
      submissionsThisMonth: submissionsThisMonth || 0,
    };
  }
}