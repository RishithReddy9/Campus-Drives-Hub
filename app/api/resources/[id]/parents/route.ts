import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Resource, { IResource } from "@/models/Resource";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    const { id } = await params;
  await dbConnect();

  let chain: { id: string; title: string }[] = [];

  let current: IResource | null = await Resource.findById(id).lean<IResource>();

  while (current) {
    chain.unshift({
      id: String(current._id),
      title: current.title,
    });

    if (!current.parentId) break;

    current = await Resource.findById(current.parentId).lean<IResource>();
  }

  // Always prepend Home at the start
  chain.unshift({
    id: "",  // special ID for home/root
    title: "Home",
  });

  return NextResponse.json(chain);
}
