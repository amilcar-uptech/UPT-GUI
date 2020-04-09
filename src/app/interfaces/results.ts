export interface Results {
    name?: string;
    description?: string;
    units?: string;
    value?: number;
}

export interface Scenarios {
    scenario_id: number;
    name?: string;
    results?: {
        [key: string]: Results
    };
}
