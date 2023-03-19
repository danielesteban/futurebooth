import Diffusers from '@danielesteban/diffusers';

class Diffusion {
  private readonly diffusers: Diffusers = new Diffusers('799b65dd2681d9123862b618d038b86f');
  private readonly queue: Map<any, { blob: Blob; resolve: (blob: Blob) => void; }> = new Map();

  private prompt: string = '';
  private negativePrompt: string = 'deformed, distorted, disfigured, poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, mutated hands and fingers, disconnected limbs, mutation, mutated, ugly, disgusting, blurry, amputation.';
  private strength: number = 0.9;

  available() {
    return this.diffusers.available().then(({ diffusion }) => (diffusion));
  }

  generate(key: any, blob: Blob) {
    return new Promise<Blob>((resolve) => {
      const { queue } = this;
      const queued = queue.get(key);
      if (queued) {
        queued.blob = blob;
        queued.resolve = resolve;
        return;
      }
      queue.set(key, { blob, resolve });
      if (queue.size === 1) {
        this.process();
      }
    });
  }

  private async process() {
    const { diffusers, queue, prompt, negativePrompt, strength } = this;
    const next = queue.entries().next();
    const { value: [key, queued] } = next;
    const { blob } = queued;
    const result = await diffusers.diffusion(blob, {
      prompt,
      negativePrompt,
      strength,
    });
    if (queued.blob === blob) {
      queue.delete(key);
      queued.resolve(result);
    }
    if (queue.size > 0) {
      this.process();
    }
  }

  setNegativePrompt(prompt: string) {
    this.negativePrompt = prompt;
  }

  setPrompt(prompt: string) {
    this.prompt = prompt;
  }

  setStrength(strength: number) {
    this.strength = strength;
  }
}

export default Diffusion;
