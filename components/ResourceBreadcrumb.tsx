"use client";

import { useEffect, useState } from "react";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import Link from "next/link";

interface Breadcrumb {
  id: string;
  title: string;
}

export default function ResourceBreadcrumb({ id }: { id: string }) {
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  useEffect(() => {
    fetch(`/api/resources/${id}/parents`)
      .then((res) => res.json())
      .then((data) => setBreadcrumbs(data))
      .catch(console.error);
  }, [id]);

  return (
    <Breadcrumbs size="lg">
      {breadcrumbs.map((bc, index) => (
        <BreadcrumbItem key={index}>
          <Link href={`/resources/${bc.id}`}>
            {bc.title}
          </Link>
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
}
