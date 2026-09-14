export type SoftDeleteResponse = {
  id: string;
  deleted: true;
};

export type PermanentDeleteResponse = {
  id: string;
  permanentlyDeleted: true;
};
