export default function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
  });
}
