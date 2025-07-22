// To avoid casing errors, always match the filename exactly.
// If your file is named 'Carousel.tsx', use:
import Carousel from "./ui/Carousel";
// Or, if using Vite alias:
// import Carousel from "@/components/ui/Carousel";

const slides = [
  {
    title: 'Welcome to SoulLift',
    button: 'Start Now',
    src: '/images/slide1.jpg',
  },
  {
    title: 'Craft Your Message',
    button: 'Try It',
    src: '/images/slide2.jpg',
  },
  {
    title: 'Share the Love',
    button: 'Send Hug',
    src: '/images/slide3.jpg',
  },
];

export default function CarouselDemo() {
  return (
    <div className="w-full flex flex-col items-center py-12">
      <h1 className="text-3xl font-bold mb-8">SoulLift Carousel Demo</h1>
      <Carousel slides={slides} />
    </div>
  );
}
