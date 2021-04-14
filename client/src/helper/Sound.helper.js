export const SoundHandler = (url) => {
  const audio = new Audio(`/${url}`);
  audio.play();
};
