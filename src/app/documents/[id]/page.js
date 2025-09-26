// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";
// import { Loader2, ArrowLeft } from "lucide-react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// export default function DocumentPage() {
//   const { id } = useParams();
//   const [doc, setDoc] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchDoc() {
//       try {
//         const res = await fetch(`/api/documents/${id}`);
//         const data = await res.json();
//         setDoc(data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchDoc();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
//       </div>
//     );
//   }

//   if (!doc) {
//     return <p className="text-center mt-20">Document not found</p>;
//   }

//   return (
//     <div className="min-h-screen pt-20 px-6 sm:px-10">
//       <Link
//         href="/documents"
//         className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
//       >
//         <ArrowLeft className="h-4 w-4" /> Back to documents
//       </Link>

//       <Card className="mt-6 rounded-2xl shadow-md">
//         <CardHeader>
//           <CardTitle>{doc.title}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <pre className="whitespace-pre-wrap text-sm leading-relaxed">
//             {doc.content}
//           </pre>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }







"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, Trash2, Download } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DocumentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchDoc() {
      try {
        const res = await fetch(`/api/documents/${id}`);
        const data = await res.json();
        if (res.ok) setDoc(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDoc();
  }, [id]);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this document?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/documents"); // back to list
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  }

  function handleDownload() {
    if (!doc) return;
    const blob = new Blob([doc.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.title.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  if (!doc) {
    return <p className="text-center mt-20">Document not found</p>;
  }

  return (
    <div className="min-h-screen pt-20 px-6 sm:px-10">
      <Link
        href="/documents"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to documents
      </Link>

      <Card className="mt-6 rounded-2xl shadow-md">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>{doc.title}</CardTitle>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" /> Download
            </Button>
            <Button
              onClick={handleDelete}
              variant="destructive"
              disabled={deleting}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className= 'p-5'>  
          <pre className="whitespace-pre-wrap text-sm leading-relaxed p-5">
            {doc.content}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}