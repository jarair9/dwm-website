import Image from "next/image";

export function StorySection() {
  return (
    <section className="relative w-full">
      <div className="relative w-full" style={{ aspectRatio: "1231 / 1277" }}>
        <Image
          src="/story.png"
          alt="The eternal journey — from the earth to your story"
          fill
          className="object-contain"
          priority
          sizes="100vw"
        />
      </div>
    </section>
  );
}
