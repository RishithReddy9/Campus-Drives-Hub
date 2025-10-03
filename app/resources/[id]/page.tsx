'use client';
import { IResource } from "@/models/Resource";
import AdminControls from "./AdminControls";
import MarkdownClient from "@/components/MarkdownClient";
import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import SubmitResource from "@/components/SubmitResource";
import Link from "next/link";

export default function DrivePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const {data: session} = useSession();
  const [children, setChildren] = useState<IResource[]>([]);
  const [resource, setResource] = useState<IResource>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getResource(id).then((res) => {
      if(!res) return;
      setResource(res);
    }).catch((err) => { console.error(err); }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    if(resource?.type=="folder"){
      getChildren(id).then((children) => {
        setChildren(children);
      }).catch((err) => { console.error(err); });
      console.log(children);
    }
    setLoading(false);
  }, [resource]);

  const getResource = async (id: string) => { 
    const res = await fetch("/api/resources/" + id, {
      method: "GET",
    });
    if (res.ok) {
      return res.json();
    } else {
      return null;
    }
  }

  const getChildren = async (parentId: string) => { 
    const res = await fetch("/api/resources/" + parentId + "/children", {
      method: "GET",
    });

    if (res.ok) {
      return res.json();
    } else {
      return [];
    }

  }

  const markdown = resource?.content ?? "";
  

  return (
    <div>
      {session?.user.role==='admin' && <SubmitResource currentFolderId={id} />}
      {loading && <p>Loading...</p>}
      { resource?.type === "folder" &&
        <div className="p-6 bg-white shadow rounded">
          <h1 className="text-2xl font-bold">{resource.title}</h1>
          {
            children.length>0 && children.map((child) => (
              <article key={child.title} className="mt-4 p-4 border rounded">
                <Link href={`/resources/${child._id}`}>
                  <h2 className="text-xl font-semibold mb-2">{child.title}</h2>
                </Link>
              </article>
            ))
          }
          {children.length===0 && <p className="mt-4 text-gray-500">No resources found in this folder.</p>}
          {children.length===0 && session?.user.role==='admin' && <AdminControls id={id} />}
        </div>
      }

      { resource?.type === "blog" &&
        <article className="p-6 bg-white shadow rounded">
          <h1 className="text-2xl font-bold">{resource.title}</h1>
          
          <div className="mt-2 prose max-w-none bg-white">
            <MarkdownClient markdown={markdown} />
          </div>

          {session && session.user.role === "admin" && <AdminControls id={id} />}
        </article>
      }
    </div>
  );
}
