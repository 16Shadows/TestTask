export const PasswordTypes = {
    Email: 'Email',
    Website: 'Website'
} as const;
export type PasswordTypes = typeof PasswordTypes[keyof typeof PasswordTypes];

export type PasswordEntry = {
    id: number;
    type: PasswordTypes;
    passwordFor: string;
    creationTime: Date;
};