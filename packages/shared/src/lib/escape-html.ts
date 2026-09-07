// Form values end up interpolated into the HTML body of an outbound email, so
// they have to be escaped: unescaped input lets a submitter inject markup into
// the message the team reads in their inbox.
export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
