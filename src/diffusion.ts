import Diffusers from '@danielesteban/diffusers';

type Options = {
  negativePrompt: string;
  prompt: string;
  strength: number;
};

class Diffusion {
  private readonly diffusers: Diffusers = new Diffusers('799b65dd2681d9123862b618d038b86f');
  private options: Options = {
    negativePrompt: 'deformed, distorted, disfigured, poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, mutated hands and fingers, disconnected limbs, mutation, mutated, ugly, disgusting, blurry, amputation.',
    prompt: '',
    strength: 0.9,
  };
  private readonly queue: Map<any, { blob: Blob; options: Options, resolve: (blob: Blob) => void; }> = new Map();

  available() {
    return this.diffusers.available().then(({ diffusion }) => (diffusion));
  }

  generate(key: any, blob: Blob) {
    return new Promise<Blob>((resolve) => {
      const { queue, options } = this;
      const queued = queue.get(key);
      if (queued) {
        queued.blob = blob;
        queued.options = { ...options };
        queued.resolve = resolve;
        return;
      }
      queue.set(key, { blob, options: { ...options }, resolve });
      if (queue.size === 1) {
        this.process();
      }
    });
  }

  private async process() {
    const { diffusers, queue } = this;
    const next = queue.entries().next();
    const { value: [key, queued] } = next;
    const { blob, options } = queued;
    const result = await diffusers.diffusion(blob, options);
    if (queued.blob === blob) {
      queue.delete(key);
      queued.resolve(result);
    }
    if (queue.size > 0) {
      this.process();
    }
  }

  setNegativePrompt(prompt: string) {
    this.options.negativePrompt = prompt;
  }

  setPrompt(prompt: string) {
    this.options.prompt = prompt;
  }

  setStrength(strength: number) {
    this.options.strength = strength;
  }
}

export default Diffusion;
