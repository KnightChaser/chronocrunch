export const INITIAL_CONFIG = {
    title: "TEMPORAL\nCRUNCH",
    // Defaults to current year progress
    startTime: new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 16),
    endTime: new Date(new Date().getFullYear() + 1, 0, 1).toISOString().slice(0, 16),
    precision: 7,
};