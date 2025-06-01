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