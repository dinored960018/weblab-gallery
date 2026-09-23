/* 오방색 아카이브 — 모션 두 가지만 크게 쓴다.
   1) 물감 차오름: 색 링크를 누르면 누른 자리에서 그 색이 퍼진 뒤 페이지가 바뀐다
   2) 먹 ↔ 한지: 대각선으로 한 번 쓸어내며 테마가 바뀐다
   나머지는 스크롤 등장뿐. reduced-motion 이면 전부 끄고 즉시 이동한다. */
(function () {
  var root = document.documentElement
  var pour = document.getElementById('pour')
  var calm = matchMedia('(prefers-reduced-motion: reduce)')

  root.classList.add('js')

  /* ── 테마 ─────────────────────────────────────────────── */
  var btn = document.getElementById('themeToggle')

  function syncBtn() {
    if (btn) btn.setAttribute('aria-pressed', String(root.dataset.theme === 'light'))
  }
  syncBtn()

  function setTheme(next) {
    root.dataset.theme = next
    try { localStorage.setItem('obang-theme', next) } catch (e) {}
    syncBtn()
  }

  if (btn) {
    btn.addEventListener('click', function () {
      var next = root.dataset.theme === 'light' ? 'dark' : 'light'
      if (calm.matches || !pour) return setTheme(next)

      // 바뀔 쪽 바탕색으로 화면을 덮었다가 걷어낸다
      pour.style.setProperty('--pc', next === 'light' ? '#F3EEE2' : '#100E0D')
      pour.dataset.wipe = '1'
      pour.dataset.on = '1'
      window.setTimeout(function () {
        setTheme(next)
        pour.dataset.on = '0'
        window.setTimeout(function () { delete pour.dataset.wipe }, 760)
      }, 380)
    })
  }

  /* ── 물감 차오름 ──────────────────────────────────────── */
  function pourTo(href, color, x, y) {
    pour.style.setProperty('--pc', color)
    pour.style.setProperty('--px', x + 'px')
    pour.style.setProperty('--py', y + 'px')
    // 리플로우를 한 번 강제해야 clip-path 전환이 처음부터 재생된다
    void pour.offsetWidth
    pour.dataset.on = '1'
    window.setTimeout(function () { location.href = href }, 560)
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[data-pour]') : null
    if (!a) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    if (calm.matches || !pour) return

    e.preventDefault()
    var r = a.getBoundingClientRect()
    var x = e.clientX || r.left + r.width / 2
    var y = e.clientY || r.top + r.height / 2
    pourTo(a.getAttribute('href'), a.dataset.pour, x, y)
  })

  // 뒤로 가기로 돌아왔을 때 덮개가 남아 있지 않게
  window.addEventListener('pageshow', function () {
    if (pour) { pour.dataset.on = '0'; delete pour.dataset.wipe }
  })

  /* ── 등장 ─────────────────────────────────────────────── */
  var targets = document.querySelectorAll(
    '.hero > .wrap > *, .swatches > li, .band .wrap > *, .facts, .chip, .uses li, .inter li'
  )
  Array.prototype.forEach.call(targets, function (el) { el.classList.add('rv') })

  if (calm.matches || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('on') })
    return
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return
      var sibs = Array.prototype.filter.call(
        en.target.parentNode.children,
        function (n) { return n.classList.contains('rv') }
      )
      en.target.style.transitionDelay = Math.min(sibs.indexOf(en.target), 6) * 70 + 'ms'
      en.target.classList.add('on')
      io.unobserve(en.target)
    })
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 })

  Array.prototype.forEach.call(targets, function (el) { io.observe(el) })

  // 안전장치 — 빠르게 스크롤하면 IO 가 프레임을 놓쳐 요소가 숨은 채 남을 수 있다.
  // 스크롤이 멎을 때마다 화면 위로 지나간 것들을 쓸어 담는다.
  var t = null
  addEventListener('scroll', function () {
    clearTimeout(t)
    t = setTimeout(function () {
      Array.prototype.forEach.call(document.querySelectorAll('.rv:not(.on)'), function (el) {
        if (el.getBoundingClientRect().top < innerHeight) { el.classList.add('on'); io.unobserve(el) }
      })
    }, 140)
  }, { passive: true })

})()
