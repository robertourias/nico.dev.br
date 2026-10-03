"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import ChatCTAButton from "./ChatCTAButton";

export default function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className="py-24 md:py-32 px-6 md:px-8 bg-surface-container-low" aria-labelledby="about-title">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
        <figure className="relative group">
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <Image
              alt={t("imageAlt")}
              className="object-cover"
              src="/roberto-nicoletti.png"
              fill
              priority
            />
          </div>
          <figcaption className="sr-only">{t("imageCaption")}</figcaption>
        </figure>

        <article className="space-y-8">
          <div className="space-y-2">
            <p className="text-primary font-sans font-bold text-xs tracking-widest uppercase">{t("tag")}</p>
            <h2 id="about-title" className="font-display text-4xl md:text-5xl font-bold text-on-surface tracking-tight">
              {t("title")}
            </h2>
          </div>

          <p className="text-on-surface-variant text-lg leading-relaxed">
            {t("description")}
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full text-sm font-semibold shadow-md shadow-primary/10 hover:scale-105 transition-transform"
            >
              {t("ctaProjects")}
            </a>
            <Link
              href="/curriculo"
              className="inline-flex items-center gap-2 px-6 py-3 border border-outline-variant text-on-surface rounded-full text-sm font-semibold hover:bg-surface-container transition-all"
            >
              {t("ctaResume")}
            </Link>
            <ChatCTAButton className="inline-flex items-center gap-2 px-6 py-3 border border-outline-variant text-on-surface rounded-full text-sm font-semibold hover:bg-surface-container transition-all" />
          </div>
        </article>
      </div>
    </section>
  );
}
