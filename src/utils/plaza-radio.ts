import type { PlazaStatusResponse, RadioNowPlaying } from "@/types/plaza";
import { PLAZA_STATUS_URL } from "./constants";

export const fetchPlazaStatus = async (): Promise<RadioNowPlaying | null> => {
  try {
    const response = await fetch(PLAZA_STATUS_URL);
    if (!response.ok) return null;

    const data = (await response.json()) as PlazaStatusResponse;
    const { song, listeners, updated_at } = data;
    if (!song?.title) return null;

    return {
      id: song.id,
      artist: song.artist,
      album: song.album,
      title: song.title,
      length: song.length,
      position: song.position,
      artworkUrl: song.artwork_sm_src || song.artwork_src,
      listeners,
      updatedAt: updated_at,
    };
  } catch {
    return null;
  }
};

export const formatRadioTime = (seconds: number): string => {
  const total = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(total / 60);
  const secs = total % 60;
  return `${minutes}:${String(secs).padStart(2, "0")}`;
};
