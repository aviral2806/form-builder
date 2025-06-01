import { supabase } from "~/lib/supabase";
import type { Section } from "~/stores/formBuilder";

export interface FormTemplate {
  id: string;
  form_name: string;
  description?: string;
  tags?: string[];
  form_structure: Section[];
  expiry_date?: string;
  is_default: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTemplateData {
  form_name: string;
  description?: string;
  tags?: string[];
  expiry_date?: string;
}

export class FormTemplateService {
  // Save a new template
  static async saveTemplate(
    templateData: CreateTemplateData,
    formStructure: Section[]
  ): Promise<FormTemplate> {
    console.log("🔄 FormTemplateService.saveTemplate called with:", {
      templateData,
      formStructureLength: formStructure.length,
    });

    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("User must be authenticated to save templates");
    }

    console.log("👤 User authenticated:", user.user.id);

    // Let Supabase handle ID generation and timestamps
    const templateRecord = {
      form_name: templateData.form_name,
      description: templateData.description || null,
      tags: templateData.tags || null,
      form_structure: formStructure,
      expiry_date: templateData.expiry_date || null,
      is_default: false,
      created_by: user.user.id,
    };

    console.log("📝 Template record to insert:", templateRecord);

    const { data, error } = await supabase
      .from("form_templates")
      .insert([templateRecord])
      .select()
      .single();

    if (error) {
      console.error("❌ Error saving template:", error);
      throw new Error(`Failed to save template: ${error.message}`);
    }

    console.log("✅ Template saved successfully:", data);
    return data;
  }

  // Get user's templates (forms they created)
  static async getUserTemplates(): Promise<FormTemplate[]> {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return [];
    }

    const { data, error } = await supabase
      .from("form_templates")
      .select("*")
      .eq("created_by", user.user.id)
      .eq("is_default", false)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching user templates:", error);
      throw new Error(`Failed to fetch templates: ${error.message}`);
    }

    return data || [];
  }

  // Get a single template by ID
  static async getTemplateById(templateId: string): Promise<FormTemplate | null> {
    const { data, error } = await supabase
      .from("form_templates")
      .select("*")
      .eq("id", templateId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error("Error fetching template:", error);
      throw new Error(`Failed to fetch template: ${error.message}`);
    }

    return data;
  }

  // Update existing template
  static async updateTemplate(
    templateId: string,
    templateData: CreateTemplateData,
    formStructure: Section[]
  ): Promise<FormTemplate> {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("User must be authenticated to update templates");
    }

    const updateRecord = {
      form_name: templateData.form_name,
      description: templateData.description || null,
      tags: templateData.tags || null,
      form_structure: formStructure,
      expiry_date: templateData.expiry_date || null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("form_templates")
      .update(updateRecord)
      .eq("id", templateId)
      .eq("created_by", user.user.id) // Ensure user can only update their own templates
      .select()
      .single();

    if (error) {
      console.error("❌ Error updating template:", error);
      throw new Error(`Failed to update template: ${error.message}`);
    }

    return data;
  }

  // Delete template
  static async deleteTemplate(templateId: string): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("User must be authenticated to delete templates");
    }

    const { data, error } = await supabase
      .from("form_templates")
      .delete()
      .eq("id", templateId)
      .eq("created_by", user.user.id); // Ensure user can only delete their own templates

    console.log("🗑️ Deleting template:", templateId);
    if (data) {
      console.log("✅ Template deleted successfully:", data);
    }
    if (error) {
      console.error("❌ Error deleting template:", error);
      throw new Error(`Failed to delete template: ${error.message}`);
    }
  }

  // Get default templates (is_default = true)
  static async getDefaultTemplates(): Promise<FormTemplate[]> {
    console.log("📚 Fetching default templates from Supabase...");

    const { data, error } = await supabase
      .from("form_templates")
      .select("*")
      .eq("is_default", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Error fetching default templates:", error);
      throw new Error(`Failed to fetch default templates: ${error.message}`);
    }

    console.log("✅ Fetched default templates:", data?.length || 0);
    return data || [];
  }

  // Check if template is expired
  static isTemplateExpired(template: FormTemplate): boolean {
    if (!template.expiry_date) return false;
    return new Date(template.expiry_date) < new Date();
  }

  // Check if template is active (not expired)
  static isTemplateActive(template: FormTemplate): boolean {
    return !this.isTemplateExpired(template);
  }
}