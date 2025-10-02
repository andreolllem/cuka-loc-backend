declare module "bcryptjs" {
  export type HashInput = string | Buffer;
  export type CompareInput = string | Buffer;

  export function genSalt(rounds?: number): Promise<string>;
  export function genSaltSync(rounds?: number): string;

  export function hash(data: HashInput, saltOrRounds: string | number): Promise<string>;
  export function hashSync(data: HashInput, saltOrRounds: string | number): string;

  export function compare(data: CompareInput, encrypted: string): Promise<boolean>;
  export function compareSync(data: CompareInput, encrypted: string): boolean;

  export function getRounds(encrypted: string): number;
  export function getSalt(encrypted: string): string;

  export const version: string;
}
