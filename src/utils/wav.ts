export const bufferToWav = (buffer: AudioBuffer) => {
  const numOfChan = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1;
  const bitDepth = 16;
  const result = interleave(buffer);
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numOfChan * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = result.length * bytesPerSample;
  const bufferSize = 44 + dataSize;
  const ab = new ArrayBuffer(bufferSize);
  const view = new DataView(ab);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numOfChan, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);
  floatTo16BitPCM(view, 44, result);

  return new Blob([view], { type: "audio/wav" });
};

const interleave = (buffer: AudioBuffer) => {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan;
  const result = new Float32Array(length);

  let index = 0;
  const channels = [];

  for (let i = 0; i < numOfChan; i++) channels.push(buffer.getChannelData(i));
  for (let i = 0; i < buffer.length; i++) {
    for (let c = 0; c < numOfChan; c++) {
      result[index++] = channels[c][i];
    }
  }

  return result;
};

const writeString = (view: DataView, offset: number, str: string) => {
  for (let i = 0; i < str.length; i++)
    view.setUint8(offset + i, str.charCodeAt(i));
};

const floatTo16BitPCM = (
  output: DataView,
  offset: number,
  input: Float32Array
) => {
  let pos = offset;
  for (let i = 0; i < input.length; i++, pos += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(pos, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
};
