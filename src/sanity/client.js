import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || "qqw884xm";
const dataset = import.meta.env.VITE_SANITY_DATASET || "production";
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || "2024-03-01";
const useCdn = import.meta.env.VITE_SANITY_USE_CDN !== "false";

export const isSanityConfigured = () => {
  return Boolean(
    projectId &&
      projectId.trim() !== "" &&
      projectId !== "placeholder" &&
      projectId !== "your_project_id_here"
  );
};

export const sanityClient = isSanityConfigured()
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn,
    })
  : null;

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

export function urlForImage(source) {
  if (!source) return null;
  if (!builder) {
    // If it's already a full URL or fallback asset string, return it directly
    if (typeof source === "string") return source;
    if (source.asset && source.asset.url) return source.asset.url;
    return null;
  }
  try {
    return builder.image(source).auto("format").fit("max");
  } catch (err) {
    console.warn("Failed to build image url with Sanity client:", err);
    if (source.asset && source.asset.url) return source.asset.url;
    return null;
  }
}
