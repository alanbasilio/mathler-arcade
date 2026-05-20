export interface PlazaSong {
  id: string;
  artist: string;
  album: string;
  title: string;
  length: number;
  position: number;
  artwork_src: string;
  artwork_sm_src: string;
}

export interface PlazaStatusResponse {
  song: PlazaSong;
  listeners: number;
  updated_at: number;
}

export interface RadioNowPlaying {
  id: string;
  artist: string;
  album: string;
  title: string;
  length: number;
  position: number;
  artworkUrl: string;
  listeners: number;
  updatedAt: number;
}
