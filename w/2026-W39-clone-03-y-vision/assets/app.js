/* clone-03 — 기능은 눌러서 동작해야 한다. href="#" 로 막지 않는다.
   메뉴 · 서비스 전환 · 문의 폼 검증 · 스크롤 등장. */
(function () {
  var root = document.documentElement
  var calm = matchMedia('(prefers-reduced-motion: reduce)')
  root.classList.add('js')

  /* ── 메뉴 오버레이 ───────────────────────────────────── */
  var mBtn = document.getElementById('menuBtn')
  var menu = document.getElementById('menu')

  if (mBtn && menu) {
    var lastFocus = null

    function setMenu(open) {
      menu.dataset.open = open ? '1' : '0'
      mBtn.setAttribute('aria-expanded', String(open))
      mBtn.querySelector('.nav__label').textContent = open ? 'CLOSE' : 'MENU'
      document.body.classList.toggle('lock', open)
      if (open) {
        lastFocus = document.activeElement
        // visibility 가 풀리기 전에는 focus() 가 먹지 않는다. 한 프레임 넘긴 뒤 옮긴다
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            var first = menu.querySelector('a')
            if (first) first.focus()
          })
        })
      } else if (lastFocus) {
        lastFocus.focus()
      }
    }
    mBtn.setAttribute('aria-expanded', 'false')
    mBtn.addEventListener('click', function () {
      setMenu(menu.dataset.open !== '1')
    })
    menu.addEventListener('click', function (e) {
      // 링크를 누르거나, 누를 것이 아닌 곳을 누르면 닫는다.
      // .menu__in 이 화면을 덮으므로 e.target === menu 만으로는 바깥 클릭이 안 잡힌다
      if (!e.target.closest('a,button')) return setMenu(false)
      if (e.target.closest('a')) setMenu(false)
    })
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.dataset.open === '1') setMenu(false)
      // 열려 있는 동안 포커스를 오버레이 안에 가둔다
      if (e.key === 'Tab' && menu.dataset.open === '1') {
        var f = menu.querySelectorAll('a[href],button')
        if (!f.length) return
        var first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    })
  }

  /* ── 서비스 전환 ─────────────────────────────────────── */
  var tabs = document.querySelectorAll('.srv__b')
  var panels = document.querySelectorAll('.srv__panel')
  var counter = document.getElementById('srvCount')

  function select(i) {
    Array.prototype.forEach.call(tabs, function (t, n) {
      t.setAttribute('aria-selected', String(n === i))
      t.tabIndex = n === i ? 0 : -1
    })
    Array.prototype.forEach.call(panels, function (p, n) {
      p.hidden = n !== i
    })
    if (counter) {
      counter.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(tabs.length).padStart(2, '0')
    }
  }

  if (tabs.length) {
    select(0)
    Array.prototype.forEach.call(tabs, function (t, i) {
      t.addEventListener('click', function () { select(i) })
      t.addEventListener('keydown', function (e) {
        var n = null
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = (i + 1) % tabs.length
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length
        if (e.key === 'Home') n = 0
        if (e.key === 'End') n = tabs.length - 1
        if (n === null) return
        e.preventDefault()
        select(n)
        tabs[n].focus()
      })
    })
  }

  /* ── 문의 폼 ─────────────────────────────────────────── */
  var form = document.getElementById('askForm')
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault() // 보낼 곳이 없다. 검증만 보여준다
      var bad = 0
      Array.prototype.forEach.call(form.querySelectorAll('[data-req]'), function (f) {
        var wrap = f.closest('.field')
        var v = f.value.trim()
        var ok = v.length > 0 && (f.type !== 'email' || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v))
        wrap.dataset.bad = ok ? '0' : '1'
        if (!ok) bad++
      })
      form.dataset.sent = bad ? '0' : '1'
      if (bad) {
        var first = form.querySelector('.field[data-bad="1"] input, .field[data-bad="1"] textarea')
        if (first) first.focus()
      }
    })
    Array.prototype.forEach.call(form.querySelectorAll('[data-req]'), function (f) {
      f.addEventListener('input', function () {
        var wrap = f.closest('.field')
        if (wrap.dataset.bad === '1' && f.value.trim()) wrap.dataset.bad = '0'
      })
    })
  }

  /* ── 등장 ────────────────────────────────────────────── */
  var items = document.querySelectorAll('.rv')
  if (calm.matches || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(items, function (el) { el.classList.add('on') })
    return
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (!en.isIntersecting) return
      var sibs = Array.prototype.filter.call(en.target.parentNode.children, function (n) {
        return n.classList.contains('rv')
      })
      en.target.style.transitionDelay = Math.min(sibs.indexOf(en.target), 6) * 80 + 'ms'
      en.target.classList.add('on')
      io.unobserve(en.target)
    })
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 })
  Array.prototype.forEach.call(items, function (el) { io.observe(el) })

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
