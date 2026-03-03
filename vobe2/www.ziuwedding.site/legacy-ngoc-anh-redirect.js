(function () {
  function normalizePath(pathname) {
    return pathname.replace(/\/+$/, '') || '/';
  }

  var currentPath = normalizePath(window.location.pathname);
  if (currentPath !== '/ngoc-anh') return;

  var target = new URL('/vanphong-ngocanh', window.location.origin);
  target.search = window.location.search || '';
  target.hash = window.location.hash || '';

  window.location.replace(target.toString());
})();
