
export const resumeAudioCtx = (audioCtx: AudioContext) => {
  if (audioCtx.state === 'running') return;

  console.log('[Audio]', 'Try resuming audio...');

  const gain = audioCtx.createGain();
  const osc = audioCtx.createOscillator();

  osc.frequency.value = 440;

  osc.start(audioCtx.currentTime + 0.1);
  osc.stop(audioCtx.currentTime + 0.1);

  gain.connect(audioCtx.destination);
  gain.disconnect();

  audioCtx.resume()
    .catch((e) => {
      console.error('[Audio]', 'Failed to resume audio');
      console.error(e);
    });
};
