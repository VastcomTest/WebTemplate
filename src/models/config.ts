import { Setting } from "./setting";

export interface Config {
    id: number;
    name: string;
    settings: Setting[];
    enabled: boolean;
    lastUpdatedAt: Date;
}