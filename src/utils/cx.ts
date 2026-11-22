/** Joins class names, skipping falsy values. */
export const cx = (...parts: Array<string | false | null | undefined>): string => parts.filter(Boolean).join(' ');

/** Replaces {name} placeholders in a template. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));
}

/** Splits a template around one placeholder so the value can be styled. */
export function splitTemplate(template: string, key: string): [string, string] {
  const token = `{${key}}`;
  const i = template.indexOf(token);
  if (i === -1) return [template, ''];
  return [template.slice(0, i), template.slice(i + token.length)];
}
