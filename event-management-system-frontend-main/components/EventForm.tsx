"use client";

import React, { memo, useCallback, useState } from "react";
import type { EventFormValues } from "../types/event";
import { Notice } from "./ui";

interface EventFormProps {
  event?: EventFormValues;
  isSubmitting?: boolean;
  onSubmit: (data: EventFormValues) => void | Promise<void>;
  onCancel?: () => void;
}

interface FormFieldProps {
  id: keyof EventFormValues;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  helpText?: string;
}

const TextField = memo(function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = true,
  helpText,
}: FormFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        className="input-field"
        placeholder={placeholder}
        required={required}
      />
      {helpText ? <p className="form-help">{helpText}</p> : null}
    </div>
  );
});

const TextAreaField = memo(function TextAreaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = true,
  helpText,
}: Omit<FormFieldProps, "type">) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="input-field min-h-32 resize-y"
        placeholder={placeholder}
        required={required}
      />
      {helpText ? <p className="form-help">{helpText}</p> : null}
    </div>
  );
});

function getInitialFormValues(event?: EventFormValues): EventFormValues {
  return {
    title: event?.title ?? "",
    description: event?.description ?? "",
    start_time: event?.start_time ?? "",
    end_time: event?.end_time ?? "",
    location: event?.location ?? "",
    category: event?.category ?? "",
  };
}

export default function EventForm({
  event,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: EventFormProps) {
  const [formValues, setFormValues] = useState<EventFormValues>(() =>
    getInitialFormValues(event)
  );
  const [error, setError] = useState("");

  const handleFieldChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      setFormValues((currentValues) => ({ ...currentValues, [name]: value }));
    },
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];
    const { title, description, start_time, end_time, location, category } =
      formValues;

    if (!title.trim()) errors.push("Title is required");
    if (!description.trim()) errors.push("Description is required");
    if (!start_time) errors.push("Start time is required");
    if (!end_time) errors.push("End time is required");
    if (!location.trim()) errors.push("Location is required");
    if (!category.trim()) errors.push("Category is required");
    if (new Date(start_time) >= new Date(end_time)) {
      errors.push("Start time must be before end time");
    }

    if (errors.length) {
      setError(errors.join(", "));
      return;
    }

    setError("");
    void onSubmit(formValues);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      aria-describedby={error ? "event-form-error" : undefined}
    >
      <div className="form-grid md:grid-cols-2">
        <div className="md:col-span-2">
          <TextField
            id="title"
            label="Title"
            value={formValues.title}
            onChange={handleFieldChange}
            placeholder="Spring product launch"
            helpText="Use a concise, descriptive title people can scan quickly."
          />
        </div>
        <div className="md:col-span-2">
          <TextAreaField
            id="description"
            label="Description"
            value={formValues.description}
            onChange={handleFieldChange}
            placeholder="Describe the event, atmosphere, and key details."
            helpText="A short summary is enough. Keep it readable on mobile."
          />
        </div>
        <TextField
            id="start_time"
            label="Start time"
            value={formValues.start_time}
            onChange={handleFieldChange}
            type="datetime-local"
          />
        <TextField
            id="end_time"
            label="End time"
            value={formValues.end_time}
            onChange={handleFieldChange}
            type="datetime-local"
          />
        <TextField
            id="location"
            label="Location"
            value={formValues.location}
            onChange={handleFieldChange}
            placeholder="Mumbai Convention Hall"
          />
        <TextField
            id="category"
            label="Category"
            value={formValues.category}
            onChange={handleFieldChange}
            placeholder="Conference"
          />
      </div>
      {error && (
        <Notice tone="error">
          <span id="event-form-error">{error}</span>
        </Notice>
      )}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="secondary-button w-full sm:w-auto"
          >
            {event ? "Back" : "Cancel"}
          </button>
        ) : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="primary-button w-full sm:w-auto"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "Saving..." : event ? "Update Event" : "Create Event"}
        </button>
      </div>
    </form>
  );
}
