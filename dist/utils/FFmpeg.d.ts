export interface EncodeConfig {
    inputPattern: string;
    outputPath: string;
    framerate?: number;
    codec?: string;
    pixFmt?: string;
    crf?: number;
    preset?: string;
}
export declare class FFmpeg {
    encode(config: EncodeConfig): Promise<void>;
    encodeWebM(config: EncodeConfig): Promise<void>;
}
//# sourceMappingURL=FFmpeg.d.ts.map