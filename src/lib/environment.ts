export default function environment() {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  } else {
    const url = process.env.URL;
    return url;
  }
}
