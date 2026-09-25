const video = document.querySelector(".scene");

if (video) {
  const small = window.matchMedia("(max-width: 820px)").matches;
  const base = small ? "media/scene-mobile" : "media/scene";

  [["webm", "video/webm"], ["mp4", "video/mp4"]].forEach(([ext, type]) => {
    const source = document.createElement("source");
    source.src = `${base}.${ext}`;
    source.type = type;
    video.append(source);
  });

  video.load();

  video.play().catch(() => {});

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    video.pause();
  }
}
