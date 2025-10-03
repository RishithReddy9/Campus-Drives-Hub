// app/api/resources/[id]/children/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Resource from "@/models/Resource";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const {id} = await params;
  await dbConnect();
  const children = await Resource.find({ parentId: id });

  return NextResponse.json(children);
}
