import { useId } from "react";
import { cn } from "@/components/jabkit/lib/cn";
import type { Team17Culture, Team17Member, Team17NamedList, Team17Props } from "./Team17.types";

const DEFAULT_TITLE = "The people in the room";
const DEFAULT_DESCRIPTION =
  "Harbor keeps a small table on purpose. These portraits are who sits here now. The lists below are who taught the craft and who still joins when a brief needs extra hands.";

const DEFAULT_MEMBERS: Team17Member[] = [
  {
    src: "/assets/bd48582e630a15fa.webp",
    alt: "Portrait of Amara Cole",
    name: "Amara Cole",
    role: "Design director",
  },
  {
    src: "/assets/2a364f729e4f7c09.webp",
    alt: "Portrait of Julian Hart",
    name: "Julian Hart",
    role: "Product engineer",
  },
  {
    src: "/assets/d111cc60a8f2bf68.webp",
    alt: "Portrait of Priya Nair",
    name: "Priya Nair",
    role: "Brand lead",
  },
  {
    src: "/assets/040bd026249d7af9.webp",
    alt: "Portrait of Eli Voss",
    name: "Eli Voss",
    role: "Studio producer",
  },
  {
    src: "/assets/45dad0903fef5d02.webp",
    alt: "Portrait of Ines Calder",
    name: "Ines Calder",
    role: "Research lead",
  },
  {
    src: "/assets/1391b53bc91d2127.webp",
    alt: "Portrait of Rowan Hale",
    name: "Rowan Hale",
    role: "Frontend",
  },
];

const DEFAULT_ALUMNI: Team17NamedList = {
  label: "Alumni",
  names: ["Noor Elamin", "Mira Solano", "Theo Brant", "Leah Okonkwo", "Soren Vale"],
};

const DEFAULT_COLLABORATORS: Team17NamedList = {
  label: "Collaborators",
  names: ["Fieldwork Press", "Northline Type", "Kite Photo", "Velvet Rail", "Lumen Studio"],
};

const DEFAULT_CULTURE: Team17Culture = {
  title: "How we work",
  paragraphs: [
    "We start with photographs and a sentence that can survive a quiet room. Type, crop, and product live on the same desk so the page does not get translated three times before it ships.",
    "Reviews are short and in person when we can manage it. If a layout needs a tour to make sense, it is not ready. We keep the crew small so the person who heard the brief is still in the file on Thursday.",
  ],
};

function MemberCard({ member }: { member: Team17Member }) {
  return (
    <article className="min-w-0">
      <figure className="overflow-hidden rounded-[--radius] bg-muted">
        <img
          src={member.src}
          alt={member.alt}
          className="aspect-[3/4] w-full object-cover object-top"
        />
      </figure>
      <h3 className="mt-3 text-base font-medium tracking-[-0.02em]">{member.name}</h3>
      <p className="mt-0.5 text-sm text-muted-foreground">{member.role}</p>
    </article>
  );
}

function NamedList({ list }: { list: Team17NamedList }) {
  if (list.names.length === 0) return null;

  return (
    <div className="grid gap-3 border-t border-border py-8 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-baseline sm:gap-8">
      <h3 className="text-sm font-medium tracking-[-0.01em]">{list.label}</h3>
      <ul className="flex flex-wrap gap-x-5 gap-y-2">
        {list.names.map((name) => (
          <li key={name} className="text-base text-muted-foreground">
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CultureBand({ culture }: { culture: Team17Culture }) {
  if (culture.paragraphs.length === 0) return null;

  return (
    <div className="grid gap-4 border-t border-border py-10 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8 lg:py-12">
      <h3 className="text-sm font-medium tracking-[-0.01em]">{culture.title}</h3>
      <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
        {culture.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-base leading-7 text-muted-foreground">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

export function Team17({
  className,
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  members = DEFAULT_MEMBERS,
  alumni = DEFAULT_ALUMNI,
  collaborators = DEFAULT_COLLABORATORS,
  culture = DEFAULT_CULTURE,
  ...props
}: Team17Props) {
  const headingId = useId();

  return (
    <section
      data-slot="team17"
      aria-labelledby={headingId}
      className={cn("bg-background text-foreground", className)}
      {...props}
    >
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <header className="max-w-2xl">
          <h2
            id={headingId}
            className="text-3xl font-semibold tracking-[-0.05em] text-balance sm:text-4xl lg:text-5xl"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {description}
            </p>
          ) : null}
        </header>

        {members.length > 0 ? (
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:mt-16 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-12">
            {members.map((member) => (
              <MemberCard key={`${member.name}-${member.src}`} member={member} />
            ))}
          </div>
        ) : null}

        <div className="mt-14 sm:mt-16">
          {alumni ? <NamedList list={alumni} /> : null}
          {collaborators ? <NamedList list={collaborators} /> : null}
          {culture ? <CultureBand culture={culture} /> : null}
        </div>
      </div>
    </section>
  );
}
