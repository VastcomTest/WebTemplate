import { DocumentCategory } from "@core/interfaces/document-category";
import { DocumentDate } from "@core/models/document-date";
import { DocumentSubCategory } from "@core/interfaces/document-sub-category";

export interface DocumentOverview {
    name: string;
    tableName: string;
    displayName: string;
    count: number;
}

export interface CachedOverview {
    documentCategory: DocumentCategory;
    documentSubCategory: DocumentSubCategory;
    documentDate: DocumentDate;
    searchTerms: string[];
}