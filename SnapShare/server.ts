import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

interface ImageMetadata {
  id: string;
  name: string;
  type: string;
  size: number;
  filename: string;
}

interface TransferSession {
  id: string;
  createdAt: number;
  expiresAt: number;
  images: ImageMetadata[];
  password?: string;
  oneTimeView: boolean;
  selfDestruct: boolean;
  hideFilename: boolean;
  allowDownload: boolean;
  viewCount: number;
  downloadCount: number;
  hasBeenViewed: boolean;
}

interface ShareAccessGrant {
  id: string;
  transferId: string;
  createdAt: number;
  expiresAt: number;
}

const transfersMap = new Map<string, TransferSession>();
const accessGrants = new Map<string, ShareAccessGrant>();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const MAX_EXPIRY_MINUTES = 60;
const ALLOWED_EXPIRY_PRESETS = new Set(["5m", "10m", "30m", "1h", "custom"]);

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

const parseCookies = (cookieHeader?: string) => {
  if (!cookieHeader) return {} as Record<string, string>;
  return cookieHeader.split(";").reduce((acc, pair) => {
    const idx = pair.indexOf("=");
    if (idx > -1) {
      const key = pair.slice(0, idx).trim();
      const value = decodeURIComponent(pair.slice(idx + 1).trim());
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, string>);
};

const getShareGrant = (req: express.Request, transferId: string) => {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[`snapshare_access_${transferId}`];
  if (!token) return null;
  const grant = accessGrants.get(token);
  if (!grant) return null;
  if (grant.transferId !== transferId || Date.now() > grant.expiresAt) {
    accessGrants.delete(token);
    return null;
  }
  return { token, grant };
};

const issueShareGrant = (res: express.Response, transferId: string, expiresAt: number) => {
  const token = crypto.randomBytes(24).toString("hex");
  accessGrants.set(token, { id: token, transferId, createdAt: Date.now(), expiresAt });
  res.setHeader("Set-Cookie", `snapshare_access_${transferId}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Expires=${new Date(expiresAt).toUTCString()}`);
};

const clearShareGrant = (res: express.Response, transferId: string) => {
  res.setHeader("Set-Cookie", `snapshare_access_${transferId}=; Path=/; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT`);
};

function deleteSessionFiles(session: TransferSession) {
  for (const img of session.images) {
    const filePath = path.join(UPLOAD_DIR, img.filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Failed deleting ${img.filename}`, err);
      }
    }
  }
}

function removeTransfer(id: string) {
  const session = transfersMap.get(id);
  if (!session) return;
  deleteSessionFiles(session);
  transfersMap.delete(id);
  for (const [token, grant] of accessGrants.entries()) {
    if (grant.transferId === id) accessGrants.delete(token);
  }
}

function cleanExpiredTransfers() {
  const now = Date.now();
  for (const [id, session] of transfersMap.entries()) {
    if (now >= session.expiresAt) removeTransfer(id);
  }
  for (const [token, grant] of accessGrants.entries()) {
    if (now >= grant.expiresAt) accessGrants.delete(token);
  }
}

setInterval(cleanExpiredTransfers, 30000);

const noStoreHeaders = (res: express.Response) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
};

type ExpiryResolution = { ok: true; minutes: number } | { ok: false; error: string };

const resolveExpiryMinutes = (expiry: unknown, customExpiryMinutes: unknown): ExpiryResolution => {
  if (typeof expiry !== "string" || !ALLOWED_EXPIRY_PRESETS.has(expiry)) {
    return { ok: false, error: "Invalid expiry option. Allowed presets: 5m, 10m, 30m, 1h, or custom (1-60 minutes)." };
  }

  if (expiry === "5m") return { ok: true, minutes: 5 };
  if (expiry === "10m") return { ok: true, minutes: 10 };
  if (expiry === "30m") return { ok: true, minutes: 30 };
  if (expiry === "1h") return { ok: true, minutes: 60 };

  const parsed = Number.parseInt(String(customExpiryMinutes), 10);
  if (!Number.isFinite(parsed) || Number.isNaN(parsed)) {
    return { ok: false, error: "Custom expiry must be a number between 1 and 60 minutes." };
  }
  if (parsed < 1 || parsed > MAX_EXPIRY_MINUTES) {
    return { ok: false, error: "Custom expiry cannot exceed 60 minutes." };
  }
  return { ok: true, minutes: parsed };
};

const isExpiryError = (value: ExpiryResolution): value is { ok: false; error: string } => !value.ok;

app.post("/api/upload", (req, res) => {
  const {
    images,
    expiry,
    customExpiryMinutes,
    password,
    oneTimeView,
    selfDestruct,
    hideFilename,
    allowDownload,
    customSlug,
  } = req.body;

  if (!Array.isArray(images) || images.length === 0) return res.status(400).json({ error: "No files provided" });

  const expiryResult = resolveExpiryMinutes(expiry, customExpiryMinutes);
  if (isExpiryError(expiryResult)) {
    return res.status(400).json({ error: expiryResult.error });
  }
  const expiryMinutes = expiryResult.minutes;
  const expiresAt = Date.now() + expiryMinutes * 60 * 1000;

  const savedImages: ImageMetadata[] = [];

  try {
    for (const img of images) {
      const match = typeof img?.data === "string" ? img.data.match(/^data:([^;]+);base64,(.*)$/) : null;
      if (!match) throw new Error("Invalid payload");
      const mime = match[1];
      const buffer = Buffer.from(match[2], "base64");

      const isVideo = mime.startsWith("video/");
      const max = isVideo ? 10 * 1024 * 1024 : 15 * 1024 * 1024;
      if (buffer.length > max) throw new Error(`File over ${isVideo ? "10" : "15"}MB limit`);

      const ext = (img.name && String(img.name).includes(".")) ? String(img.name).split(".").pop() : mime.split("/").pop() || "bin";
      const fileId = crypto.randomUUID();
      const filename = `${fileId}.${ext}`;
      fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer);

      savedImages.push({
        id: fileId,
        name: String(img.name || `asset.${ext}`),
        type: mime,
        size: Number(img.size || buffer.length),
        filename,
      });
    }
  } catch (error: any) {
    for (const img of savedImages) {
      const fp = path.join(UPLOAD_DIR, img.filename);
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    }
    return res.status(400).json({ error: error.message || "Upload failed" });
  }

  let sessionId = crypto.randomBytes(4).toString("hex");
  if (typeof customSlug === "string") {
    const slug = customSlug.replace(/[^a-zA-Z0-9-_]/g, "").trim();
    if (slug.length >= 3) {
      if (transfersMap.has(slug)) return res.status(400).json({ error: "Slug already in use" });
      sessionId = slug;
    }
  }

  transfersMap.set(sessionId, {
    id: sessionId,
    createdAt: Date.now(),
    expiresAt,
    images: savedImages,
    password: typeof password === "string" && password.trim() ? password.trim() : undefined,
    oneTimeView: !!oneTimeView,
    selfDestruct: !!selfDestruct,
    hideFilename: !!hideFilename,
    allowDownload: allowDownload !== false,
    viewCount: 0,
    downloadCount: 0,
    hasBeenViewed: false,
  });

  return res.json({ id: sessionId, expiresAt, imagesCount: savedImages.length });
});

app.post("/api/share/:id/verify", (req, res) => {
  noStoreHeaders(res);
  const { id } = req.params;
  const session = transfersMap.get(id);
  if (!session) return res.status(404).json({ error: "Transfer not found" });
  if (Date.now() >= session.expiresAt) {
    removeTransfer(id);
    clearShareGrant(res, id);
    return res.status(404).json({ error: "Transfer expired" });
  }

  if (session.password && session.password !== String(req.body?.password || "")) {
    clearShareGrant(res, id);
    return res.status(401).json({ error: "Incorrect password" });
  }

  issueShareGrant(res, id, session.expiresAt);
  return res.json({ success: true, expiresAt: session.expiresAt });
});

app.get("/api/share/:id", (req, res) => {
  noStoreHeaders(res);
  const { id } = req.params;
  const session = transfersMap.get(id);
  if (!session) return res.status(404).json({ error: "Transfer not found" });

  if (Date.now() >= session.expiresAt) {
    removeTransfer(id);
    clearShareGrant(res, id);
    return res.status(404).json({ error: "Transfer expired" });
  }

  const access = getShareGrant(req, id);
  if (session.password && !access) {
    return res.status(401).json({ passwordRequired: true, expiresAt: session.expiresAt, id });
  }

  if (access) issueShareGrant(res, id, session.expiresAt);

  session.viewCount += 1;
  const images = session.images.map((img, index) => {
    const ext = img.name.includes(".") ? img.name.split(".").pop() : img.type.split("/").pop() || "bin";
    return {
      id: img.id,
      name: session.hideFilename ? `Asset_${index + 1}.${ext}` : img.name,
      type: img.type,
      size: img.size,
    };
  });

  return res.json({
    id: session.id,
    createdAt: session.createdAt,
    expiresAt: session.expiresAt,
    images,
    oneTimeView: session.oneTimeView,
    selfDestruct: session.selfDestruct,
    hideFilename: session.hideFilename,
    allowDownload: session.allowDownload,
    viewCount: session.viewCount,
    downloadCount: session.downloadCount,
    passwordRequired: false,
  });
});

app.get("/api/share/:id/image/:imageId", (req, res) => {
  noStoreHeaders(res);
  const { id, imageId } = req.params;
  const session = transfersMap.get(id);
  if (!session) return res.status(404).json({ error: "Transfer not found" });
  if (Date.now() >= session.expiresAt) {
    removeTransfer(id);
    clearShareGrant(res, id);
    return res.status(404).json({ error: "Transfer expired" });
  }

  const access = getShareGrant(req, id);
  if (session.password && !access) return res.status(401).json({ error: "Password required" });

  const image = session.images.find((img) => img.id === imageId);
  if (!image) return res.status(404).json({ error: "File not found" });

  const isDownload = req.query.download === "true";
  if (isDownload && !session.allowDownload) return res.status(403).json({ error: "Download disabled for this transfer" });

  const filePath = path.join(UPLOAD_DIR, image.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File missing" });

  if (isDownload) session.downloadCount += 1;

  res.setHeader("Content-Type", image.type);
  if (isDownload) {
    const name = session.hideFilename ? `asset.${image.name.split(".").pop() || "png"}` : image.name;
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(name)}"`);
  }

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);

  if (session.oneTimeView || (session.selfDestruct && isDownload)) {
    setTimeout(() => removeTransfer(id), 15000);
  }
});

app.post("/api/share/:id/delete", (req, res) => {
  const { id } = req.params;
  const session = transfersMap.get(id);
  if (!session) return res.status(404).json({ error: "Transfer not found" });

  if (session.password && session.password !== String(req.body?.password || "")) return res.status(401).json({ error: "Incorrect password" });

  removeTransfer(id);
  clearShareGrant(res, id);
  return res.json({ success: true });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
