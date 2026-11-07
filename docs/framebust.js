// Clickjacking mitigation: GitHub Pages cannot send X-Frame-Options / frame-ancestors,
// so break out of any frame that is not this site.
if (window.top !== window.self) {
  try {
    window.top.location = window.self.location;
  } catch (e) {
    document.documentElement.style.display = "none";
  }
}
