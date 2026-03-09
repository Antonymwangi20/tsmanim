export declare class DevServer {
    private port;
    private wss;
    private currentScene;
    private renderer;
    private isRendering;
    constructor(port?: number);
    start(scriptPath: string): Promise<void>;
    private reload;
    private serveFrame;
    private getPreviewHTML;
}
//# sourceMappingURL=dev.d.ts.map