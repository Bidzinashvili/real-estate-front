"use client";

import { AddPropertyApartmentSection } from "@/widgets/AddProperty/AddPropertyApartmentSection";
import { AddPropertyCommercialSection } from "@/widgets/AddProperty/AddPropertyCommercialSection";
import { AddPropertyCoreFields } from "@/widgets/AddProperty/AddPropertyCoreFields";
import { AddPropertyLandPlotSection } from "@/widgets/AddProperty/AddPropertyLandPlotSection";
import { AddPropertyPrivateHouseSection } from "@/widgets/AddProperty/AddPropertyPrivateHouseSection";
import { useAddPropertyForm } from "@/features/properties/useAddPropertyForm";

export function AddPropertyForm() {
  const {
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
  } = useAddPropertyForm();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6">
      <div className="mx-auto w-full max-w-5xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-semibold tracking-tight">Add property</h1>
        <p className="mt-1 text-sm text-slate-600">
          Fill in required details and the matching property subtype section.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-6" noValidate>
          <AddPropertyCoreFields
            form={form}
            fieldErrors={fieldErrors}
            updateForm={updateForm}
            onImagesChange={onImagesChange}
          />

          {activeSubtype === "apartment" && (
            <AddPropertyApartmentSection
              dealType={form.dealType}
              apartment={form.apartment}
              fieldErrors={fieldErrors}
              patchApartment={patchApartment}
            />
          )}

          {activeSubtype === "privateHouse" && (
            <AddPropertyPrivateHouseSection
              dealType={form.dealType}
              privateHouse={form.privateHouse}
              fieldErrors={fieldErrors}
              patchPrivateHouse={patchPrivateHouse}
            />
          )}

          {activeSubtype === "landPlot" && (
            <AddPropertyLandPlotSection
              dealType={form.dealType}
              landPlot={form.landPlot}
              fieldErrors={fieldErrors}
              patchLandPlot={patchLandPlot}
            />
          )}

          {activeSubtype === "commercial" && (
            <AddPropertyCommercialSection
              dealType={form.dealType}
              commercial={form.commercial}
              fieldErrors={fieldErrors}
              patchCommercial={patchCommercial}
            />
          )}

          {(submitError || error) && (
            <p className="whitespace-pre-line text-sm text-red-600" role="alert">
              {submitError ?? error}
            </p>
          )}

          <div className="mt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={cancel}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Saving…" : "Create property"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
