class Viewport {
  public readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly video: HTMLVideoElement;
  private ready: boolean = false;
  private requesting: boolean = false;

  constructor(width: number, height: number) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
    this.video = document.createElement('video');
    this.video.onloadedmetadata = () => this.video.play();
    this.update = this.update.bind(this);
    this.setupStream = this.setupStream.bind(this);
    this.setupStream();
    window.addEventListener('click', this.setupStream);
  }

  getBlob() {
    return new Promise<Blob>((resolve, reject) => (
      this.canvas.toBlob((blob) => {
        if (!blob) {
          reject();
          return;
        }
        resolve(blob);
      })
    ));
  }

  isReady() {
    return this.ready;
  }

  private setupStream() {
    if (this.ready || this.requesting) {
      return;
    }
    this.requesting = true;
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: { width: this.canvas.width, height: this.canvas.height } })
      .then((stream) => {
        this.ready = true;
        this.video.srcObject = stream;
        this.video.requestVideoFrameCallback(this.update);
      })
      .catch(() => {})
      .finally(() => {
        this.requesting = false;
      })
  }

  private update() {
    const { canvas, ctx, video } = this; 
    video.requestVideoFrameCallback(this.update);
    let x = 0;
    let y = 0;
    let w = canvas.width;
    let h = canvas.height;
    if (video.videoWidth > video.videoHeight) {
      w = video.videoWidth * canvas.height / video.videoHeight;
      x = (canvas.width - w) * 0.5;
    } else {
      h = video.videoHeight * canvas.width / video.videoWidth;
      y = (canvas.height - h) * 0.5;
    }
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, x, y, w, h);
  }
}

export default Viewport;
