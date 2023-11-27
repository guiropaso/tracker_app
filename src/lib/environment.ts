export function environment() {
  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test"
  ) {
    const environment = process.env.NEXT_PUBLIC_URL;
    return environment;
  } else {
    return "";
  }
}
