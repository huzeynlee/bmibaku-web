/** Screen-reader note for links that open a new tab. */
export function NewTabHint({ text }: { text: string }) {
  return <span className="sr-only"> {text}</span>;
}
