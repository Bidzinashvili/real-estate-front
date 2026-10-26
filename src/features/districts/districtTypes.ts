export type TbilisiNeighborhoodSectionKey = "main" | "other" | "surroundings";

export interface TbilisiNeighborhoodSection {
  key: TbilisiNeighborhoodSectionKey;
  title: string;
  neighborhoods: string[];
}

export interface DistrictsResponse {
  sections: TbilisiNeighborhoodSection[];
}
