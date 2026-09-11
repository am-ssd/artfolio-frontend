import Image from "next/image";
import { urlForOrNull } from "@/lib/sanity/image";
import type { Project } from "@/types/project";

type ProjectCardProps = {
  project: Project;
  onOpen: (project: Project) => void;
};

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const sanityUrl = urlForOrNull(project.thumbnail, (b) =>
    b.width(900).height(675).url(),
  );
  const imageUrl = sanityUrl ?? project.imageSrc ?? null;

  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      className="group w-full text-left"
      aria-label={`Open details for ${project.title}`}
    >
      <article className="overflow-hidden rounded-2xl transition duration-300 group-hover:-translate-y-0.5">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#d0d0d0]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={project.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-sm text-neutral-500">
              {project.title}
            </div>
          )}
        </div>
      </article>
    </button>
  );
}
