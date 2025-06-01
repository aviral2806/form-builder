import { nanoid } from "nanoid";
import type { Template } from "~/types/template";

export const mockTemplates: Template[] = [
  {
    id: "contact-form",
    name: "Contact Form",
    description: "Simple contact form with name, email, and message fields",
    tags: ["business", "contact", "simple"],
    estimatedTime: "2 min",
    isPopular: true,
    structure: {
      formName: "Contact Us",
      sections: [
        {
          id: nanoid(),
          title: "Contact Information",
          fields: [
            {
              id: nanoid(),
              type: "text",
              label: "Full Name",
              required: true,
              placeholder: "Enter your full name"
            },
            {
              id: nanoid(),
              type: "email",
              label: "Email Address",
              required: true,
              placeholder: "Enter your email"
            },
            {
              id: nanoid(),
              type: "textarea",
              label: "Message",
              required: true,
              placeholder: "How can we help you?"
            }
          ]
        }
      ]
    }
  },
  {
    id: "job-application",
    name: "Job Application",
    description: "Complete job application form with personal and professional details",
    tags: ["hr", "recruitment", "professional"],
    estimatedTime: "5 min",
    isPopular: true,
    structure: {
      formName: "Job Application Form",
      sections: [
        {
          id: nanoid(),
          title: "Personal Information",
          fields: [
            {
              id: nanoid(),
              type: "text",
              label: "Full Name",
              required: true,
              placeholder: "Enter your full name"
            },
            {
              id: nanoid(),
              type: "email",
              label: "Email Address",
              required: true,
              placeholder: "Enter your email"
            },
            {
              id: nanoid(),
              type: "phone",
              label: "Phone Number",
              required: true,
              placeholder: "Enter your phone number"
            }
          ]
        }
      ]
    }
  },
  {
    id: "feedback-survey",
    name: "Customer Feedback",
    description: "Gather customer feedback and satisfaction ratings",
    tags: ["survey", "feedback", "customer"],
    estimatedTime: "3 min",
    structure: {
      formName: "Customer Feedback Survey",
      sections: [
        {
          id: nanoid(),
          title: "Your Experience",
          fields: [
            {
              id: nanoid(),
              type: "radio",
              label: "Overall Satisfaction",
              required: true,
              options: [
                { key: "excellent", value: "Excellent" },
                { key: "good", value: "Good" },
                { key: "average", value: "Average" },
                { key: "poor", value: "Poor" }
              ]
            },
            {
              id: nanoid(),
              type: "textarea",
              label: "Comments",
              required: false,
              placeholder: "Tell us about your experience..."
            }
          ]
        }
      ]
    }
  }
];