import { BlockMetadata } from "../../yeying/api/asset/block_pb";

export interface DownloadResult {
  block: BlockMetadata;
  data: Uint8Array;
  progress: Progress;
}

export type DownloadCallback = (result: DownloadResult) => void;
export type UploadCallback = (result: UploadResult) => void;

export interface UploadResult {
  block: BlockMetadata;
  progress: Progress;
}

export interface Progress {
  total: number;
  completed: number;
}

export interface BlockDetail {
  block: BlockMetadata;
  data: Uint8Array;
}
