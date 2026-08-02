import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, ART_BUCKET, ART_FOLDER } from "@/lib/supabaseAdmin";

function checkAuth(req: NextRequest) {
  const key = req.headers.get("x-admin-key");
  return key && key === process.env.ADMIN_UPLOAD_KEY;
}

async function uploadFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${ART_FOLDER}/${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from(ART_BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (error) throw error;

  const { data } = supabaseAdmin.storage.from(ART_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const title = form.get("title") as string;
  const description = (form.get("description") as string) || "";
  const story = (form.get("story") as string) || null;
  const category = (form.get("category") as string) || null;
  const cover = form.get("cover") as File | null;
  const extraImages = form.getAll("images") as File[];

  if (!title || !cover) {
    return NextResponse.json({ error: "title and cover image are required" }, { status: 400 });
  }

  const screenshot_url = await uploadFile(cover);

  const { data: project, error: insertError } = await supabaseAdmin
    .from("portfolio_projects")
    .insert({ title, description, story, category, screenshot_url, site: "art" })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  const imageRows = [];
  for (let i = 0; i < extraImages.length; i++) {
    const url = await uploadFile(extraImages[i]);
    imageRows.push({ project_id: project.id, url, sort_order: i });
  }

  if (imageRows.length > 0) {
    const { error: imagesError } = await supabaseAdmin
      .from("portfolio_project_images")
      .insert(imageRows);
    if (imagesError) {
      return NextResponse.json({ error: imagesError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true, artwork: project });
}
