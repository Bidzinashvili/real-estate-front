"use client";

import { useCallback, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { buildCreatePropertyPayload } from "@/features/properties/addPropertyFormPayload";
import {
  initialFormState,
  subtypeFromPropertyType,
  type FormState,
} from "@/features/properties/addPropertyFormState";
import {
  type FormErrors,
  validateAddPropertyImages,
  validateFormInputs,
} from "@/features/properties/addPropertyFormValidation";
import { useCreateProperty } from "@/features/properties/useCreateProperty";

export function useAddPropertyForm() {
  const router = useRouter();
  const { create, isLoading, error } = useCreateProperty();
  const [form, setForm] = useState<FormState>(() => initialFormState());
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const activeSubtype = useMemo(
    () => subtypeFromPropertyType(form.propertyType),
    [form.propertyType],
  );

  const updateForm = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    if (key === "propertyType") {
      setFieldErrors({});
    } else if (key === "dealType") {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next["apartment.minRentalPeriod"];
        delete next["privateHouse.minRentalPeriod"];
        return next;
      });
    } else {
      setFieldErrors((prev) => {
        const prefix = String(key);
        const next = { ...prev };
        for (const k of Object.keys(next)) {
          if (k === prefix || k.startsWith(`${prefix}.`)) {
            delete next[k];
          }
        }
        return next;
      });
    }

    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const patchApartment = useCallback((patch: Partial<FormState["apartment"]>) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      for (const subKey of Object.keys(patch)) {
        const errKey = `apartment.${subKey}`;
        if (errKey in next) delete next[errKey];
      }
      return next;
    });
    setForm((prev) => ({ ...prev, apartment: { ...prev.apartment, ...patch } }));
  }, []);

  const patchPrivateHouse = useCallback((patch: Partial<FormState["privateHouse"]>) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      for (const subKey of Object.keys(patch)) {
        const errKey = `privateHouse.${subKey}`;
        if (errKey in next) delete next[errKey];
      }
      return next;
    });
    setForm((prev) => ({
      ...prev,
      privateHouse: { ...prev.privateHouse, ...patch },
    }));
  }, []);

  const patchLandPlot = useCallback((patch: Partial<FormState["landPlot"]>) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      for (const subKey of Object.keys(patch)) {
        const errKey = `landPlot.${subKey}`;
        if (errKey in next) delete next[errKey];
      }
      return next;
    });
    setForm((prev) => ({ ...prev, landPlot: { ...prev.landPlot, ...patch } }));
  }, []);

  const patchCommercial = useCallback((patch: Partial<FormState["commercial"]>) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      for (const subKey of Object.keys(patch)) {
        const errKey = `commercial.${subKey}`;
        if (errKey in next) delete next[errKey];
      }
      return next;
    });
    setForm((prev) => ({ ...prev, commercial: { ...prev.commercial, ...patch } }));
  }, []);

  const onImagesChange = useCallback((files: FileList | null) => {
    const selected = files ? Array.from(files) : [];
    const imageError = validateAddPropertyImages(selected);
    setSubmitError(imageError);
    if (!imageError) {
      setImages(selected);
    }
  }, []);

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSubmitError(null);
      const imageError = validateAddPropertyImages(images);
      if (imageError) {
        setSubmitError(imageError);
        return;
      }

      const liveErrors = validateFormInputs(form, activeSubtype);
      setFieldErrors(liveErrors);
      const { payload, errors } = buildCreatePropertyPayload(form, activeSubtype);
      if (Object.keys(liveErrors).length > 0 || !payload || errors.length > 0) {
        setSubmitError(
          Object.values(liveErrors)[0] ??
            errors[0] ??
            "Please check form values and try again.",
        );
        return;
      }

      try {
        const created = await create(payload, images);
        if (created?.id) {
          router.push(`/properties/${created.id}`);
          return;
        }
        router.push("/properties");
      } catch {
      }
    },
    [activeSubtype, create, form, images, router],
  );

  const cancel = useCallback(() => {
    router.push("/properties");
  }, [router]);

  return {
    form,
    activeSubtype,
    fieldErrors,
    submitError,
    error,
    isLoading,
    updateForm,
    patchApartment,
    patchPrivateHouse,
    patchLandPlot,
    patchCommercial,
    onImagesChange,
    onSubmit,
    cancel,
  };
}
