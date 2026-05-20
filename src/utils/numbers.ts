import moment, { type Moment } from "moment";
import { EQUATION_LENGTH, GAME_START_DATE } from "./constants";
import { evaluate } from "./evaluate";

const OPERATORS = ["+", "-", "*", "/"] as const;

/** Digit lengths for the three numbers in `N1 op1 N2 op2 N3` (must sum to 4). */
const DIGIT_LENGTH_PATTERNS: readonly [number, number, number][] = [
  [2, 1, 1],
  [1, 2, 1],
  [1, 1, 2],
];

const DATE_PARAM_FORMAT_COMPACT = "YYYYMMDD";
const GAME_START_MOMENT = moment(GAME_START_DATE).startOf("day");

const toStartOfDay = (value: Moment | Date): Moment =>
  moment(value).startOf("day");

/** Formats a date for the `?date=` query param (`YYYYMMDD`). */
export const formatDateParam = (date: Date): string =>
  moment(date).format(DATE_PARAM_FORMAT_COMPACT);

/** Parses `?date=` as `YYYYMMDD` or ISO (`YYYY-MM-DD` / full ISO datetime). */
export const parseDateParam = (dateParam: string): Date | null => {
  const trimmed = dateParam.trim();
  if (!trimmed) return null;

  const compact = moment(trimmed, DATE_PARAM_FORMAT_COMPACT, true);
  if (compact.isValid()) return toStartOfDay(compact).toDate();

  const iso = moment(trimmed, moment.ISO_8601, true);
  if (iso.isValid()) return toStartOfDay(iso).toDate();

  return null;
};

export function getReferenceDate(): Date {
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();

  const dateParam = searchParams.get("date");
  if (dateParam) {
    const parsed = parseDateParam(dateParam);
    if (parsed) return parsed;
  }

  return moment().startOf("day").toDate();
}

export function getDayIndex(referenceDate: Date = getReferenceDate()): number {
  return toStartOfDay(referenceDate).diff(GAME_START_MOMENT, "days");
}

const createRng = (seed: number): (() => number) => {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
};

const pick = <T>(rng: () => number, items: readonly T[]): T => {
  const index = Math.floor(rng() * items.length);
  return items[index] ?? items[0];
};

const randomDigits = (rng: () => number, length: number): string => {
  if (length === 1) return String(Math.floor(rng() * 10));
  const value = 10 + Math.floor(rng() * 90);
  return String(value);
};

const isValidEquation = (equation: string): boolean => {
  if (equation.length !== EQUATION_LENGTH) return false;
  if (!/[+\-*/]/.test(equation)) return false;

  const result = evaluate(equation);
  return result !== null && Number.isInteger(result) && result > 0;
};

/** Builds `N1 op1 N2 op2 N3` with random operators and digit groups (always 6 chars). */
const buildRandomEquation = (rng: () => number): string => {
  const [len1, len2, len3] = pick(rng, DIGIT_LENGTH_PATTERNS);
  const op1 = pick(rng, OPERATORS);
  const op2 = pick(rng, OPERATORS);
  return `${randomDigits(rng, len1)}${op1}${randomDigits(rng, len2)}${op2}${randomDigits(rng, len3)}`;
};

export function generateEquationForDay(dayIndex: number): string {
  const maxAttempts = 64;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const rng = createRng(dayIndex + attempt * 9973);
    const equation = buildRandomEquation(rng);
    if (isValidEquation(equation)) return equation;
  }

  return "12*4+3";
}

export function getNumberOfTheDayForDate(referenceDate: Date): string {
  return generateEquationForDay(getDayIndex(referenceDate));
}

export function getNumberOfTheDayForDateParam(dateParam: string): string {
  const parsed = parseDateParam(dateParam);
  if (!parsed) return getNumberOfTheDay();
  return getNumberOfTheDayForDate(parsed);
}

export function getNumberOfTheDay(): string {
  return getNumberOfTheDayForDate(getReferenceDate());
}
