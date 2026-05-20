"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
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
import { useSessionDraft } from "@/shared/hooks/useSessionDraft";

const addPropertyDraftStorageKey = "draft:property:new";

export function useAddPropertyForm() {
  const router = useRouter();
  const { create, isLoading, error } = useCreateProperty();
  const { restoredDraft, saveDraft, clearDraft } = useSessionDraft<FormState>(
    addPropertyDraftStorageKey,
  );
  const [form, setForm] = useState<FormState>(() => ({
    ...initialFormState(),
    ...(restoredDraft ?? {}),
  }));
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const activeSubtype = useMemo(
    () => subtypeFromPropertyType(form.propertyType),
    [form.propertyType],
  );

  useEffect(() => {
    saveDraft(form);
  }, [form, saveDraft]);

  const updateForm = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    if (key === "propertyType") {
      setFieldErrors({});
    } else if (key === "dealType") {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next["apartment.minRentalPeriod"];
        delete next["privateHouse.minRentalPeriod"];
        delete next["landPlot.minRentalPeriod"];
        delete next["commercial.minRentalPeriod"];
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

    setForm((prev) => {
      if (key === "dealType") {
        const nextDealType = value as FormState["dealType"];
        if (nextDealType !== "RENT") {
          return {
            ...prev,
            dealType: nextDealType,
            apartment: { ...prev.apartment, minRentalPeriod: "" },
            privateHouse: { ...prev.privateHouse, minRentalPeriod: "" },
            landPlot: { ...prev.landPlot, minRentalPeriod: "" },
            commercial: { ...prev.commercial, minRentalPeriod: "" },
          };
        }
        return { ...prev, dealType: nextDealType };
      }
      if (key === "listingLifecycleStatus") {
        const nextLifecycle = value as FormState["listingLifecycleStatus"];
        return {
          ...prev,
          listingLifecycleStatus: nextLifecycle,
          verificationReminderLocal:
            nextLifecycle === "TO_BE_VERIFIED"
              ? prev.verificationReminderLocal
              : "",
        };
      }
      if (key === "propertyType") {
        const nextPropertyType = value as FormState["propertyType"];
        return {
          ...prev,
          propertyType: nextPropertyType,
          hotelScope: nextPropertyType === "HOTEL" ? prev.hotelScope : "",
        };
      }
      if (key === "city" || key === "district") {
        return { ...prev, [key]: value, selectedStreetId: null };
      }
      return { ...prev, [key]: value };
    });
  }, []);

  const updateAddress = useCallback(
    (next: string, addressChangeMeta?: { selectedStreetId: string | null }) => {
      setFieldErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors.address;
        return nextErrors;
      });
      setForm((prev) => ({
        ...prev,
        address: next,
        selectedStreetId: addressChangeMeta?.selectedStreetId ?? null,
      }));
    },
    [],
  );

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

  const addImages = useCallback((incomingImages: File[]) => {
    if (incomingImages.length === 0) return;

    setImages((previousImages) => {
      const nextImages = [...previousImages, ...incomingImages];
      const nextError = validateAddPropertyImages(nextImages);
      if (nextError) {
        setImageError(nextError);
        return previousImages;
      }
      setImageError(null);
      return nextImages;
    });
  }, []);

  const removeImage = useCallback((imageIndex: number) => {
    setImages((previousImages) => {
      const nextImages = previousImages.filter(
        (_image, currentIndex) => currentIndex !== imageIndex,
      );
      setImageError(null);
      return nextImages;
    });
  }, []);

  const reorderImages = useCallback((sourceIndex: number, targetIndex: number) => {
    setImages((previousImages) => {
      if (sourceIndex === targetIndex) return previousImages;
      if (
        sourceIndex < 0 ||
        targetIndex < 0 ||
        sourceIndex >= previousImages.length ||
        targetIndex > previousImages.length
      ) {
        return previousImages;
      }

      const nextImages = [...previousImages];
      const [movingImage] = nextImages.splice(sourceIndex, 1);
      nextImages.splice(targetIndex, 0, movingImage);
      setImageError(null);
      return nextImages;
    });
  }, []);

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSubmitError(null);
      setImageError(null);
      const imageError = validateAddPropertyImages(images);
      if (imageError) {
        setImageError(imageError);
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
          clearDraft();
          router.push(`/properties/${created.id}/edit`);
          return;
        }
        clearDraft();
        router.push("/properties");
      } catch {
      }
    },
    [activeSubtype, clearDraft, create, form, images, router],
  );

  const cancel = useCallback(() => {
    clearDraft();
    router.push("/properties");
  }, [clearDraft, router]);

  return {
    form,
    activeSubtype,
    fieldErrors,
    submitError,
    error,
    isLoading,
    images,
    imageError,
    updateForm,
    updateAddress,
    patchApartment,
    patchPrivateHouse,
    patchLandPlot,
    patchCommercial,
    addImages,
    removeImage,
    reorderImages,
    onSubmit,
    cancel,
  };
}
