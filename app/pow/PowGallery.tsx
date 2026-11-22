"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AppIcon, { type AppIconName } from "@/app/components/AppIcon";

type Photo = { id: string; url: string; createdAt: string };
type GalleryData = {
  photos: Photo[];
  totalCount: number;
  hasMore: boolean;
  nextCursor: string | null;
  canUpload: boolean;
};
type PendingPhoto = { file: File; previewUrl: string; fingerprint: string };

const PAGE_SIZE = 12;
const MAX_PHOTOS = 15;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_TOTAL_SIZE = 50 * 1024 * 1024;

function addDays(date: string, days: number) {
  const value = new Date(`${date}T00:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function formatDate(date: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-IN", {
    ...options,
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00.000Z`));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

function thumbnailUrl(url: string) {
  return url.replace("/image/upload/", "/image/upload/f_auto,q_auto,w_700,c_limit/");
}

function imageUrl(url: string) {
  return url.replace("/image/upload/", "/image/upload/f_auto,q_auto,w_1600,c_limit/");
}

const iconNames = {
  verified_user: "verified",
  chevron_left: "chevronLeft",
  calendar_month: "calendar",
  add_a_photo: "cameraPlus",
  checklist: "checklist",
  photo_camera: "camera",
  broken_image: "brokenImage",
  check: "check",
  open_in_full: "expand",
  expand_more: "chevronDown",
  database: "database",
  close: "close",
  cloud_upload: "upload",
  chevron_right: "chevronRight",
} satisfies Record<string, AppIconName>;

function Icon({
  name,
  className = "",
}: {
  name: keyof typeof iconNames;
  className?: string;
}) {
  return <AppIcon name={iconNames[name]} className={className} />;
}

export default function PowGallery({ todayDate }: { todayDate: string }) {
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [gallery, setGallery] = useState<GalleryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [loadMoreError, setLoadMoreError] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(`${todayDate.slice(0, 7)}-01`);
  const [recordDates, setRecordDates] = useState<Set<string> | null>(null);
  const [calendarError, setCalendarError] = useState("");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<Set<string>>(new Set());
  const [viewerPhotoId, setViewerPhotoId] = useState<string | null>(null);
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([]);
  const [uploadError, setUploadError] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const cacheRef = useRef(new Map<string, GalleryData>());
  const pendingRef = useRef(pendingPhotos);
  const loadingMoreRef = useRef(false);
  const selectedDateRef = useRef(selectedDate);

  useEffect(() => {
    pendingRef.current = pendingPhotos;
  }, [pendingPhotos]);

  useEffect(() => {
    selectedDateRef.current = selectedDate;
  }, [selectedDate]);

  useEffect(() => {
    return () => pendingRef.current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
  }, []);

  useEffect(() => {
    const cached = cacheRef.current.get(selectedDate);
    let active = true;
    if (cached) {
      setGallery(cached);
      setLoadError("");
      setLoading(false);
      return () => {
        active = false;
      };
    }

    const controller = new AbortController();
    setGallery(null);
    setLoading(true);
    setLoadError("");

    fetch(`/api/logs/pow?date=${selectedDate}&limit=${PAGE_SIZE}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "Gallery could not be loaded.");
        return body as GalleryData;
      })
      .then((data) => {
        if (!active) return;
        cacheRef.current.set(selectedDate, data);
        setGallery(data);
      })
      .catch((error: unknown) => {
        if (!active || (error instanceof DOMException && error.name === "AbortError")) return;
        setLoadError(error instanceof Error ? error.message : "Gallery could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [selectedDate, refreshKey]);

  const openCalendar = async () => {
    setCalendarOpen(true);
    setCalendarMonth(`${selectedDate.slice(0, 7)}-01`);
    if (recordDates) return;
    setCalendarError("");
    try {
      const response = await fetch("/api/logs/pow?dates=1", { cache: "no-store" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Calendar dates could not be loaded.");
      setRecordDates(new Set<string>(body.dates));
    } catch (error) {
      setCalendarError(error instanceof Error ? error.message : "Calendar dates could not be loaded.");
    }
  };

  const loadMore = useCallback(async () => {
    if (!gallery?.hasMore || !gallery.nextCursor || loadingMoreRef.current) return [] as Photo[];
    loadingMoreRef.current = true;
    setLoadingMore(true);
    setLoadMoreError("");
    try {
      const params = new URLSearchParams({
        date: selectedDate,
        limit: String(PAGE_SIZE),
        cursor: gallery.nextCursor,
      });
      const response = await fetch(`/api/logs/pow?${params}`, { cache: "no-store" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "More photos could not be loaded.");
      if (selectedDateRef.current !== selectedDate) return [] as Photo[];
      const page = body as GalleryData;
      const existing = new Set(gallery.photos.map((photo) => photo.id));
      const combined: GalleryData = {
        ...page,
        photos: [...gallery.photos, ...page.photos.filter((photo) => !existing.has(photo.id))],
        totalCount: gallery.totalCount,
      };
      cacheRef.current.set(selectedDate, combined);
      setGallery(combined);
      return page.photos;
    } catch (error) {
      setLoadMoreError(error instanceof Error ? error.message : "More photos could not be loaded.");
      return [] as Photo[];
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [gallery, selectedDate]);

  const photos = useMemo(() => gallery?.photos ?? [], [gallery?.photos]);
  const viewerIndex = photos.findIndex((photo) => photo.id === viewerPhotoId);
  const viewerPhoto = viewerIndex >= 0 ? photos[viewerIndex] : null;
  const remainingSlots = Math.max(0, MAX_PHOTOS - (gallery?.totalCount ?? 0) - pendingPhotos.length);

  const calendarCells = useMemo(() => {
    const first = new Date(`${calendarMonth}T00:00:00.000Z`);
    const year = first.getUTCFullYear();
    const month = first.getUTCMonth();
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const mondayOffset = (first.getUTCDay() + 6) % 7;
    return [
      ...Array.from({ length: mondayOffset }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) =>
        `${year}-${String(month + 1).padStart(2, "0")}-${String(index + 1).padStart(2, "0")}`
      ),
    ];
  }, [calendarMonth]);

  const monthLabel = formatDate(calendarMonth, { month: "long", year: "numeric" });
  const isToday = selectedDate === todayDate;

  const handleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    setUploadError("");
    if (!files.length) return;

    const room = Math.max(0, MAX_PHOTOS - (gallery?.totalCount ?? 0) - pendingPhotos.length);
    const accepted: PendingPhoto[] = [];
    const fingerprints = new Set(pendingPhotos.map((photo) => photo.fingerprint));
    let acceptedSize = pendingPhotos.reduce((total, photo) => total + photo.file.size, 0);
    const messages: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        messages.push(`${file.name}: choose an image file.`);
        continue;
      }
      if (file.size === 0 || file.size > MAX_FILE_SIZE) {
        messages.push(`${file.name}: images must be smaller than 10 MB.`);
        continue;
      }
      if (acceptedSize + file.size > MAX_TOTAL_SIZE) {
        messages.push(`${file.name}: the combined upload must stay under 50 MB.`);
        continue;
      }
      let fingerprint: string;
      try {
        const bytes = await file.arrayBuffer();
        const digest = await crypto.subtle.digest("SHA-256", bytes);
        fingerprint = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
      } catch {
        fingerprint = `${file.name}:${file.size}:${file.lastModified}`;
      }
      if (fingerprints.has(fingerprint)) {
        messages.push(`${file.name}: this image is already selected.`);
        continue;
      }
      if (accepted.length >= room) {
        messages.push(`Only ${room} more photo${room === 1 ? "" : "s"} can be added to today's 15-photo limit.`);
        break;
      }
      fingerprints.add(fingerprint);
      accepted.push({ file, previewUrl: URL.createObjectURL(file), fingerprint });
      acceptedSize += file.size;
    }

    if (accepted.length) setPendingPhotos((current) => [...current, ...accepted]);
    if (messages.length) setUploadError(messages.join(" "));
  };

  const removePendingPhoto = (fingerprint: string) => {
    setPendingPhotos((current) => {
      const removed = current.find((photo) => photo.fingerprint === fingerprint);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return current.filter((photo) => photo.fingerprint !== fingerprint);
    });
  };

  const submitUpload = async () => {
    if (!pendingPhotos.length || uploading || !isToday || !gallery?.canUpload) return;
    setUploading(true);
    setUploadProgress(0);
    setUploadError("");
    let uploadedSuccessfully = false;

    try {
      await new Promise<void>((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open("POST", "/api/logs/today/pow");
        request.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setUploadProgress(Math.round((event.loaded / event.total) * 100));
          }
        };
        request.onerror = () => reject(new Error("Upload failed. Check your connection and try again."));
        request.onload = () => {
          let body: { error?: string } = {};
          try {
            body = JSON.parse(request.responseText);
          } catch {
            reject(new Error("The upload response could not be read."));
            return;
          }
          if (request.status < 200 || request.status >= 300) {
            reject(new Error(request.status === 401
              ? "Your session has expired. Sign in again before uploading."
              : body.error || "Upload failed. Please try again."));
            return;
          }
          resolve();
        };
        const formData = new FormData();
        pendingPhotos.forEach(({ file }) => formData.append("files", file));
        request.send(formData);
      });

      uploadedSuccessfully = true;
      pendingPhotos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
      setPendingPhotos([]);
      setUploadProgress(100);
      cacheRef.current.delete(todayDate);
      const response = await fetch(`/api/logs/pow?date=${todayDate}&limit=${PAGE_SIZE}`, { cache: "no-store" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Photos uploaded, but the gallery could not refresh.");
      const refreshed = body as GalleryData;
      cacheRef.current.set(todayDate, refreshed);
      setGallery(refreshed);
      setRecordDates((current) => current ? new Set([...current, todayDate]) : current);
      window.setTimeout(() => setUploadProgress(null), 900);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed. Please try again.";
      if (uploadedSuccessfully) {
        setLoadError(message);
      } else {
        setUploadError(message);
      }
      setUploadProgress(null);
    } finally {
      setUploading(false);
    }
  };

  const changeDate = (date: string) => {
    if (date > todayDate) return;
    setSelectedDate(date);
    setCalendarOpen(false);
    setSelectionMode(false);
    setSelectedPhotoIds(new Set());
    setViewerPhotoId(null);
  };

  const togglePhoto = (id: string) => {
    setSelectedPhotoIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const navigateViewer = useCallback(async (direction: -1 | 1) => {
    const index = photos.findIndex((photo) => photo.id === viewerPhotoId);
    if (index < 0) return;
    if (direction < 0 && index > 0) {
      setViewerPhotoId(photos[index - 1].id);
      return;
    }
    if (direction > 0 && index < photos.length - 1) {
      setViewerPhotoId(photos[index + 1].id);
      return;
    }
    if (direction > 0 && gallery?.hasMore) {
      const added = await loadMore();
      if (added[0]) setViewerPhotoId(added[0].id);
    }
  }, [photos, viewerPhotoId, gallery?.hasMore, loadMore]);

  useEffect(() => {
    if (!viewerPhotoId) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setViewerPhotoId(null);
      if (event.key === "ArrowLeft") void navigateViewer(-1);
      if (event.key === "ArrowRight") void navigateViewer(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [viewerPhotoId, navigateViewer]);

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-white/[0.04] bg-[#1a1b22] p-4 shadow-lg shadow-black/10">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#00f59b]" />
              <h1 className="text-[21px] font-bold leading-6 tracking-tight">PROOF OF WORK</h1>
            </div>
            <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#b9cbbd]">
              {formatDate(selectedDate, { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}{" // "}{loading ? "LOADING" : `${gallery?.totalCount ?? 0} STORED WORK PHOTOS`}
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-[#292931] px-2.5 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-[#00f59b]">
            <Icon name="verified_user" className="text-[17px]" />
            STORED
          </div>
        </div>

        <div className="grid grid-cols-[1fr_1fr_1fr] gap-1 rounded-xl bg-[#0d0e15] p-1">
          <button
            type="button"
            onClick={() => changeDate(addDays(selectedDate, -1))}
            className="flex min-h-[48px] items-center justify-center gap-1 rounded-lg bg-[#1a1b22] px-2 font-mono text-[11px] font-bold uppercase tracking-wide text-[#b9cbbd] transition hover:bg-[#292931]"
            aria-label="Previous day"
          >
            <Icon name="chevron_left" className="text-[19px]" />
            <span>{formatDate(addDays(selectedDate, -1), { day: "2-digit", month: "short" }).toUpperCase()}</span>
          </button>
          <button
            type="button"
            onClick={() => changeDate(todayDate)}
            className={`min-h-[48px] rounded-lg px-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] transition ${isToday ? "bg-[#00f59b] text-[#003920]" : "bg-[#292931] text-[#e3e1ec] hover:bg-[#34353e]"}`}
          >
            {isToday ? "TODAY" : formatDate(selectedDate, { day: "2-digit", month: "short" }).toUpperCase()}
            <span className="block text-[10px]">({gallery?.totalCount ?? 0})</span>
          </button>
          <button
            type="button"
            onClick={() => void openCalendar()}
            className="flex min-h-[48px] items-center justify-center gap-1 rounded-lg bg-[#1a1b22] px-2 font-mono text-[11px] font-bold uppercase tracking-wide text-[#b9cbbd] transition hover:bg-[#292931]"
          >
            <Icon name="calendar_month" className="text-[17px]" />
            CALENDAR
          </button>
        </div>

        <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
          <button
            type="button"
            disabled={!isToday || !gallery?.canUpload || remainingSlots === 0 || loading}
            onClick={() => inputRef.current?.click()}
            className="flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-[#00f59b] px-3 font-mono text-[12px] font-bold uppercase tracking-wide text-[#003920] transition hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-[#34353e] disabled:text-[#85868e]"
          >
            <Icon name="add_a_photo" className="text-[20px]" />
            ADD WORK PHOTO
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectionMode((value) => !value);
              setSelectedPhotoIds(new Set());
            }}
            className={`flex min-h-[50px] items-center justify-center gap-1.5 rounded-xl px-3 font-mono text-[11px] font-bold uppercase tracking-wide transition ${selectionMode ? "bg-[#00f59b] text-[#003920]" : "bg-[#292931] text-[#e3e1ec] hover:bg-[#34353e]"}`}
          >
            <Icon name="checklist" className="text-[18px]" />
            {selectionMode ? "CANCEL" : "SELECT"}
          </button>
        </div>
        {isToday && !gallery?.canUpload && !loading && (
          <p className="mt-2 font-mono text-[10px] font-semibold uppercase leading-4 text-[#b9cbbd]">
            Submit today&apos;s log before adding photos. <Link href="/" className="text-[#00f59b] underline">OPEN TODAY</Link>
          </p>
        )}
        {isToday && gallery?.canUpload && remainingSlots === 0 && (
          <p className="mt-2 font-mono text-[10px] font-semibold uppercase text-[#b9cbbd]">TODAY&apos;S 15-PHOTO LIMIT REACHED</p>
        )}
      </section>

      <section aria-label="Photo filters" className="-mx-4 overflow-x-auto px-4">
        <div className="flex w-max items-center gap-2">
          <span className="flex h-9 items-center gap-2 rounded-full bg-[#00f59b] px-4 font-mono text-[11px] font-bold uppercase tracking-wider text-[#003920]">
            <span className="h-2 w-2 rounded-full bg-[#00975e]" /> ALL PHOTOS&nbsp; ({gallery?.totalCount ?? 0})
          </span>
          <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-[#85868e]">SUBJECT TAGS NOT STORED</span>
        </div>
      </section>

      {selectionMode && (
        <div className="flex items-center justify-between rounded-xl border border-[#00f59b]/20 bg-[#1a1b22] px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wide">
          <span className="text-[#00f59b]">{selectedPhotoIds.size} SELECTED</span>
          <button type="button" onClick={() => setSelectedPhotoIds(new Set())} className="text-[#b9cbbd] hover:text-[#e3e1ec]">CLEAR</button>
        </div>
      )}

      <section aria-label="Proof of work photos">
        {loading && (
          <div className="grid grid-cols-2 gap-2.5" aria-label="Loading photos">
            {[0, 1, 2, 3].map((item) => <div key={item} className="aspect-[4/5] animate-pulse rounded-2xl bg-[#1a1b22]" />)}
          </div>
        )}
        {!loading && loadError && (
          <div className="rounded-2xl border border-[#ffb4ab]/20 bg-[#1a1b22] p-5 text-center">
            <p className="font-semibold text-[#ffb4ab]">{loadError}</p>
            {loadError.toLowerCase().includes("sign in") ? (
              <Link href="/login" className="mt-3 inline-flex rounded-lg bg-[#00f59b] px-4 py-2 font-mono text-xs font-bold uppercase text-[#003920]">SIGN IN</Link>
            ) : (
              <button type="button" onClick={() => { cacheRef.current.delete(selectedDate); setRefreshKey((value) => value + 1); }} className="mt-3 rounded-lg bg-[#292931] px-4 py-2 font-mono text-xs font-bold uppercase">TRY AGAIN</button>
            )}
          </div>
        )}
        {!loading && !loadError && photos.length === 0 && (
          <div className="rounded-2xl border border-white/[0.04] bg-[#1a1b22] px-5 py-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#292931] text-[#00f59b]"><Icon name="photo_camera" className="text-[24px]" /></div>
            <h2 className="font-semibold">{isToday ? "No photos uploaded today" : "No photos for this date"}</h2>
            <p className="mt-1 text-sm text-[#b9cbbd]">{isToday && !gallery?.canUpload ? "Submit today's log first, then add your study photos." : "Your saved study photos will appear here."}</p>
          </div>
        )}
        {!loading && !loadError && photos.length > 0 && (
          <div className="grid grid-cols-2 gap-2.5">
            {photos.map((photo, index) => {
              const selected = selectedPhotoIds.has(photo.id);
              return (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => selectionMode ? togglePhoto(photo.id) : setViewerPhotoId(photo.id)}
                  className={`group relative overflow-hidden rounded-2xl border bg-[#1a1b22] text-left transition ${selected ? "border-[#00f59b] ring-2 ring-[#00f59b]/50" : "border-white/[0.04] hover:border-white/15"}`}
                  aria-label={selectionMode ? `${selected ? "Deselect" : "Select"} stored photo ${index + 1}` : `View stored photo ${index + 1}`}
                >
                  <div className="relative aspect-[4/5] bg-[#292931]">
                    <Image
                      src={thumbnailUrl(photo.url)}
                      alt={`Proof of work photo ${index + 1}`}
                      fill
                      sizes="(max-width: 480px) 50vw, 224px"
                      unoptimized
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                        const fallback = event.currentTarget.parentElement?.querySelector("[data-image-fallback]");
                        fallback?.classList.remove("hidden");
                      }}
                    />
                    <div data-image-fallback className="absolute inset-0 hidden flex-col items-center justify-center gap-2 bg-[#292931] text-[#b9cbbd]">
                      <Icon name="broken_image" className="text-[28px]" />
                      <span className="font-mono text-[9px] font-bold uppercase">IMAGE UNAVAILABLE</span>
                    </div>
                    <span className="absolute left-2 top-2 rounded-md bg-[#0d0e15]/85 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-[#00f59b] backdrop-blur">
                      <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#00f59b]" />STORED
                    </span>
                    <span className="absolute bottom-2 left-2 rounded bg-[#0d0e15]/75 px-1.5 py-1 font-mono text-[10px] text-[#e3e1ec] backdrop-blur">{formatTime(photo.createdAt)}</span>
                    {selectionMode && (
                      <span className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-md border ${selected ? "border-[#00f59b] bg-[#00f59b] text-[#003920]" : "border-white/60 bg-[#0d0e15]/55 text-transparent"}`}>
                        <Icon name="check" className="text-[17px]" />
                      </span>
                    )}
                    {!selectionMode && <span className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#0d0e15]/70 text-[#e3e1ec] opacity-0 backdrop-blur transition group-hover:opacity-100"><Icon name="open_in_full" className="text-[17px]" /></span>}
                  </div>
                  <div className="px-2.5 py-2.5">
                    <p className="truncate text-[13px] font-bold">Proof of work photo</p>
                    <p className="mt-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.08em] text-[#b9cbbd]">{formatDate(selectedDate, { day: "2-digit", month: "short" }).toUpperCase()}{" // ENTRY "}{String(index + 1).padStart(2, "0")}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
        {gallery?.hasMore && !loadError && (
          <>
            {loadMoreError && <p role="alert" className="mb-2 text-center text-xs text-[#ffb4ab]">{loadMoreError}</p>}
            <button type="button" disabled={loadingMore} onClick={() => void loadMore()} className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#292931] font-mono text-[11px] font-bold uppercase tracking-wider text-[#e3e1ec] disabled:opacity-60">
              {loadingMore ? "LOADING PHOTOS…" : loadMoreError ? "RETRY LOADING PHOTOS" : "LOAD MORE PHOTOS"}<Icon name="expand_more" className="text-[18px]" />
            </button>
          </>
        )}
      </section>

      <section className="rounded-xl border border-white/[0.03] bg-[#1a1b22] p-3.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-[#00f59b]"><Icon name="database" className="text-[21px]" /><div className="font-mono text-[9px] font-bold uppercase leading-[1.55] tracking-[0.1em] text-[#b9cbbd]">CLOUDINARY STORAGE<br />POSTGRESQL RECORDS</div></div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#00f59b]">{gallery?.totalCount ?? 0} STORED</span>
        </div>
      </section>

      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(event) => void handleFiles(event)} />

      {pendingPhotos.length > 0 && (
        <section className="fixed inset-x-0 bottom-0 z-[60] mx-auto max-w-[480px] rounded-t-2xl border border-white/10 bg-[#1a1b22] p-4 pb-24 shadow-2xl shadow-black/60">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <h2 className="font-semibold">Ready to upload</h2>
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#b9cbbd]">{pendingPhotos.length} PHOTO{pendingPhotos.length === 1 ? "" : "S"} SELECTED</p>
            </div>
            <button type="button" disabled={uploading} onClick={() => inputRef.current?.click()} className="rounded-lg bg-[#292931] px-3 py-2 font-mono text-[10px] font-bold uppercase text-[#e3e1ec] disabled:opacity-50">ADD MORE</button>
          </div>
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {pendingPhotos.map((photo) => (
              <div key={photo.fingerprint} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#292931]">
                <Image src={photo.previewUrl} alt="Selected upload preview" fill sizes="64px" unoptimized className="h-full w-full object-cover" />
                <button type="button" disabled={uploading} onClick={() => removePendingPhoto(photo.fingerprint)} aria-label={`Remove ${photo.file.name}`} className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0d0e15]/85 text-white disabled:opacity-50"><Icon name="close" className="text-[15px]" /></button>
              </div>
            ))}
          </div>
          {uploadError && (
            <p role="alert" className="mb-2 text-xs leading-5 text-[#ffb4ab]">
              {uploadError}{uploadError.toLowerCase().includes("sign in") && <> <Link href="/login" className="font-bold underline">SIGN IN</Link></>}
            </p>
          )}
          {uploadProgress !== null && (
            <div className="mb-3">
              <div className="mb-1 flex justify-between font-mono text-[10px] font-bold uppercase text-[#b9cbbd]"><span>{uploading ? "UPLOADING" : "UPLOADED"}</span><span>{uploadProgress}%</span></div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#292931]"><div className="h-full rounded-full bg-[#00f59b] transition-all" style={{ width: `${uploadProgress}%` }} /></div>
            </div>
          )}
          <div className="grid grid-cols-[auto_1fr] gap-2">
            <button type="button" disabled={uploading} onClick={() => { pendingPhotos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl)); setPendingPhotos([]); setUploadError(""); }} className="rounded-xl bg-[#292931] px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wide text-[#e3e1ec] disabled:opacity-50">CANCEL</button>
            <button type="button" disabled={uploading || !gallery?.canUpload || !isToday} onClick={() => void submitUpload()} className="flex items-center justify-center gap-2 rounded-xl bg-[#00f59b] px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-wide text-[#003920] disabled:cursor-not-allowed disabled:bg-[#34353e] disabled:text-[#85868e]">
              <Icon name="cloud_upload" className="text-[18px]" />{uploading ? "UPLOADING…" : `UPLOAD ${pendingPhotos.length} PHOTO${pendingPhotos.length === 1 ? "" : "S"}`}
            </button>
          </div>
        </section>
      )}

      {calendarOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#0d0e15]/80 p-4 backdrop-blur-sm" onClick={() => setCalendarOpen(false)}>
          <section role="dialog" aria-modal="true" aria-label="Choose a date" className="w-full max-w-[380px] rounded-2xl border border-white/[0.06] bg-[#1a1b22] p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <button type="button" onClick={() => setCalendarMonth(addDays(calendarMonth, -1).slice(0, 7) + "-01")} aria-label="Previous month" className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#292931] text-[#e3e1ec]"><Icon name="chevron_left" /></button>
              <div className="text-center"><h2 className="font-semibold uppercase">{monthLabel}</h2><p className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#b9cbbd]">DATES WITH PHOTOS ARE MARKED</p></div>
              <button type="button" disabled={calendarMonth.slice(0, 7) >= todayDate.slice(0, 7)} onClick={() => setCalendarMonth(addDays(calendarMonth, 32).slice(0, 7) + "-01")} aria-label="Next month" className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#292931] text-[#e3e1ec] disabled:opacity-30"><Icon name="chevron_right" /></button>
            </div>
            <div className="mb-1 grid grid-cols-7 text-center font-mono text-[9px] font-bold uppercase text-[#85868e]">{["M", "T", "W", "T", "F", "S", "S"].map((day, index) => <span key={`${day}${index}`} className="py-2">{day}</span>)}</div>
            <div className="grid grid-cols-7 gap-1">
              {calendarCells.map((date, index) => {
                if (!date) return <span key={`blank-${index}`} />;
                const disabled = date > todayDate;
                const active = date === selectedDate;
                const hasPhotos = recordDates?.has(date) ?? false;
                return (
                  <button key={date} type="button" disabled={disabled} onClick={() => changeDate(date)} className={`relative flex aspect-square flex-col items-center justify-center rounded-lg font-mono text-[12px] font-bold transition disabled:cursor-not-allowed disabled:opacity-20 ${active ? "bg-[#00f59b] text-[#003920]" : hasPhotos ? "bg-[#292931] text-[#e3e1ec] hover:bg-[#34353e]" : "text-[#b9cbbd] hover:bg-[#292931]"}`}>
                    {Number(date.slice(-2))}<span className={`absolute bottom-1 h-1 w-1 rounded-full ${hasPhotos ? (active ? "bg-[#003920]" : "bg-[#00f59b]") : "bg-transparent"}`} />
                  </button>
                );
              })}
            </div>
            {calendarError && <p role="alert" className="mt-3 text-xs text-[#ffb4ab]">{calendarError}{calendarError.toLowerCase().includes("sign in") && <> <Link href="/login" className="font-bold underline">SIGN IN</Link></>}</p>}
            <button type="button" onClick={() => changeDate(todayDate)} className="mt-4 min-h-10 w-full rounded-lg bg-[#292931] font-mono text-[10px] font-bold uppercase tracking-widest text-[#00f59b]">GO TO TODAY</button>
          </section>
        </div>
      )}

      {viewerPhoto && (
        <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-[#090a0f]/95 p-3 backdrop-blur" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={() => setViewerPhotoId(null)}>
          <div className="mb-3 flex w-full max-w-[800px] items-center justify-between px-1">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#b9cbbd]">{viewerIndex + 1} / {gallery?.totalCount ?? photos.length}</span>
            <button type="button" onClick={() => setViewerPhotoId(null)} aria-label="Close photo viewer" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#292931] text-white"><Icon name="close" /></button>
          </div>
          <div className="flex min-h-0 w-full max-w-[900px] flex-1 items-center justify-center gap-2" onClick={(event) => event.stopPropagation()}>
            <button type="button" disabled={viewerIndex <= 0} onClick={() => void navigateViewer(-1)} aria-label="Previous photo" className="flex h-11 w-10 shrink-0 items-center justify-center rounded-full bg-[#292931] text-white disabled:opacity-30"><Icon name="chevron_left" /></button>
            <Image src={imageUrl(viewerPhoto.url)} alt={`Proof of work photo ${viewerIndex + 1}`} width={1600} height={1200} unoptimized className="max-h-full max-w-full rounded-lg object-contain" />
            <button type="button" disabled={viewerIndex === photos.length - 1 && !gallery?.hasMore} onClick={() => void navigateViewer(1)} aria-label="Next photo" className="flex h-11 w-10 shrink-0 items-center justify-center rounded-full bg-[#292931] text-white disabled:opacity-30"><Icon name="chevron_right" /></button>
          </div>
          <p className="mt-3 font-mono text-[10px] font-bold uppercase tracking-wider text-[#b9cbbd]">{formatTime(viewerPhoto.createdAt)} IST // STORED</p>
        </div>
      )}
    </div>
  );
}
