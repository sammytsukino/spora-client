import { cldVideo } from "@/lib/cloudinary";

const FORM_BACKGROUND_VIDEO_BASE =
  "https://res.cloudinary.com/dsy30p7gf/video/upload/v1770320881/BACKGROUND-GRADIENT_bejhdr.mp4";

export const FORM_BACKGROUND_VIDEO_URL = cldVideo(FORM_BACKGROUND_VIDEO_BASE, {
  autoplay: true,
});
