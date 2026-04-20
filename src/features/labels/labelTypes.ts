export type LabelType = "STREET" | "CUSTOM";

export interface LabelDto {
  id: string;
  name: string;
  type: LabelType;
}

export interface LabelsAutocompleteResponse {
  labels: LabelDto[];
}

export interface LabelSelection {
  id: string | null;
  name: string;
  type: LabelType | null;
}
