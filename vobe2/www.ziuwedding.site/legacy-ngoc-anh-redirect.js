(function () {
  function normalizePath(pathname) {
    return pathname.replace(/\/+$/, '') || '/';
  }

  var currentPath = normalizePath(window.location.pathname);
  if (currentPath !== '/vanphong-ngocanh') return;

  var target = new URL('/tranphong-ngocanh', window.location.origin);
  target.search = window.location.search || '';
  target.hash = window.location.hash || '';

  window.location.replace(target.toString());
})();
